import photos from './interior-film-photos.json' with {type:'json'};

interface FilmImage {
  src:string;
  alt:string;
  title:string;
  width:number;
  height:number;
  fit?:string;
}
const replacements:Record<string,string>=photos.replacements;
const images=new Map(photos.images.map(image=>[image.id,image]));

export function resolveInteriorFilmImage(original:FilmImage):FilmImage {
  const id=replacements[original.src];
  if(!id)return original;
  const image=images.get(id);
  if(!image)throw new Error('Missing interior film photo: '+id);
  return image;
}

export const interiorFilmGallery=photos.images;
