import type { CollectionEntry } from 'astro:content';
export const contentTopics=['frosted','thermal','interior','advertising','cutting','printing','materials','installation','design','pricing','local','event','protection'] as const;
export type ContentTopic=typeof contentTopics[number];
const normalize=(text:string)=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase();
export function inferTopics(context:string):ContentTopic[]{
 const text=normalize(context);const result=new Set<ContentTopic>();
 if(/bao-ve|ppf|safety/.test(text))result.add('protection');
 if(/cach-nhiet|chong-nang|thermal/.test(text))result.add('thermal');
 if(/noi-that|van-go|gach-bong/.test(text))result.add('interior');
 if(/decal-mo|kinh-van-phong|trang-tri-kinh|song-3d/.test(text))result.add('frosted');
 if(/quang-cao|show-window/.test(text))result.add('advertising');
 if(/in-decal|in-pp|decal-giay|decal-trong|decal-luoi|phan-quang/.test(text))result.add('printing');
 if(/pvc|oracal|avery|vat-lieu/.test(text))result.add('materials');
 if(/cat-decal|cat-va-in-logo|logo/.test(text))result.add('cutting');
 if(/thiet-ke/.test(text))result.add('design');
 if(/thi-cong/.test(text))result.add('installation');
 if(/tron-goi|bao-gia/.test(text))result.add('pricing');
 if(/tp-hcm|binh-duong|khu-vuc/.test(text))result.add('local');
 return [...result];
}
export function relatedGuides(posts:CollectionEntry<'blog'>[],options:{topics?:ContentTopic[];context?:string;exclude?:string;limit?:number}){
 const topics=options.topics??inferTopics(options.context??'');
 const words=normalize(options.context??'').replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(word=>word.length>3&&!['decal','film','kinh','phim','dich','cong'].includes(word));
 return posts.filter(post=>post.id!==options.exclude).map(post=>({post,score:(post.data.contentTopics??[]).reduce((sum,topic)=>sum+(topics.includes(topic)?8:0),0)+words.reduce((sum,word)=>sum+(normalize(post.data.title+' '+(post.data.focusKeyword??'')).includes(word)?2:0),0)})).filter(item=>item.score>0).sort((a,b)=>b.score-a.score||b.post.data.pubDate.valueOf()-a.post.data.pubDate.valueOf()||a.post.id.localeCompare(b.post.id)).slice(0,options.limit??3).map(item=>item.post);
}
