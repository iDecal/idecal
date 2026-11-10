import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { regions } from './regions';
import { districts, districtUrl } from './districts';
import originalQuan1 from './quan-1-original.json';
import originalQuan2 from './quan-2-original.json';
import originalTanBinh from './quan-tan-binh-original.json';
import originalQuan12 from './quan-12-original.json';
import importedLibrary from './installation-photo-library.json';
export const photoAreas=[...regions.map(region=>({key:region.slug,name:region.shortName,url:`/khu-vuc/${region.slug}`,type:'region' as const})),...districts.flatMap(district=>[district,...(district.mergedAreas??[])]).map(district=>({key:district.slug,name:district.name,url:districtUrl(district.slug),type:'district' as const}))];
export interface LocalPhoto {src:string;alt:string;caption:string;area:string;}
const root=path.resolve('public/images/khu-vuc');
const extensions=/\.(?:jpe?g|png|webp|avif)$/i;
export async function getLocalPhotos(key:string):Promise<LocalPhoto[]>{
 const area=photoAreas.find(item=>item.key===key);if(!area)return [];
 const keys=key==='tp-hcm'?[key,...districts.flatMap(item=>[item.slug,...(item.mergedAreas??[]).map(area=>area.slug)])]:[key,...(districts.find(item=>item.slug===key)?.mergedAreas??[]).map(area=>area.slug)];
 const photos:LocalPhoto[]=[];
 for(const areaKey of keys){
  const item=photoAreas.find(item=>item.key===areaKey)??districts.flatMap(district=>district.mergedAreas??[]).find(area=>area.slug===areaKey)!;const folder=path.join(root,areaKey);
  let files:string[];try{files=await readdir(folder);}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')continue;throw error;}
  let captions:Record<string,{caption?:string;alt?:string}>={};
  try{captions=JSON.parse(await readFile(path.join(folder,'captions.json'),'utf8'));}catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw new Error(`Kiểm tra captions.json trong thư mục ảnh ${areaKey}: ${String(error)}`);}
  for(const file of files.filter(file=>extensions.test(file)).sort((a,b)=>a.localeCompare(b,'vi',{numeric:true}))){
   const detail=captions[file];const caption=detail?.caption?.trim()||`Thi công Decal tại ${item.name}`;
   photos.push({src:`/images/khu-vuc/${areaKey}/${encodeURIComponent(file)}`,caption,alt:detail?.alt?.trim()||caption,area:item.name});
  }
 }
 // Imported photos appear in local galleries only after their locality is confirmed.
 for(const photo of importedLibrary as {src:string;alt:string;caption:string;areaKey:string|null;kind:string}[]){
  if(photo.kind!=='installation'||!photo.areaKey||!keys.includes(photo.areaKey))continue;
  const locality=photoAreas.find(item=>item.key===photo.areaKey);if(!locality)continue;
  photos.push({src:photo.src,alt:photo.alt,caption:photo.caption,area:locality.name});
 }
 // Photo provided by the owner with the original Quận 12 page; never substitute stock images.
 if(key==='quan-12'||key==='tp-hcm')photos.push({src:originalQuan12.hero.image,alt:originalQuan12.hero.imageAlt,caption:'Decal mờ vách ngăn văn phòng · Quận 12',area:'Quận 12'});
 for(const [district,images] of [['quan-1',originalQuan1.images.slice(1)],['quan-2',originalQuan2.images.slice(2)]] as const){
  if(key===district||key==='tp-hcm')for(const image of images)photos.push({src:image.src,alt:image.alt,caption:('caption' in image?image.caption:undefined)??image.alt,area:district==='quan-1'?'Quận 1':'Quận 2'});
 }
 if(key==='quan-tan-binh'||key==='tp-hcm')for(const image of originalTanBinh.images.slice(2))photos.push({src:image.src,alt:image.alt,caption:image.caption??image.alt,area:'Tân Bình'});
 return photos.filter((photo,index,list)=>list.findIndex(other=>other.src===photo.src)===index);
}
