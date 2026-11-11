export interface SearchEntry {
  url:string;
  title:string;
  description:string;
  category:string;
  keywords:string[];
  searchText:string;
}
export function normalizeSearch(value:string):string {
  return value.normalize('NFKD').replace(/\p{M}/gu,'').replace(/[đĐ]/g,'d').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
}
export function searchEntries(entries:SearchEntry[],query:string):SearchEntry[] {
  const normalized=normalizeSearch(query.slice(0,120));
  if(normalized.length<2)return [];
  const terms=normalized.split(' ');
  const compact=normalized.replaceAll(' ','');
  return entries.map(entry=>{
    const title=normalizeSearch(entry.title);
    const description=normalizeSearch(entry.description);
    const keywords=entry.keywords.map(normalizeSearch);
    const body=normalizeSearch(entry.searchText);
    const fields=[title,description,...keywords,body];
    const compactMatch=compact.length>=3&&[title,...keywords].some(field=>field.replaceAll(' ','').includes(compact));
    if(!terms.every(term=>fields.some(field=>field.includes(term)))&&!compactMatch)return {entry,score:0};
    let score=keywords.some(keyword=>keyword.replaceAll(' ','')===compact)?180:0;
    if(title===normalized)score+=100;
    if(title.includes(normalized))score+=45+10*normalized.length/Math.max(title.length,1);
    if(compactMatch)score+=25;
    for(const term of terms){
      if(title.includes(term))score+=12;
      if(keywords.some(keyword=>keyword.includes(term)))score+=8;
      if(description.includes(term))score+=5;
      if(body.includes(term))score+=1;
    }
    return {entry,score};
  }).filter(result=>result.score>0).sort((a,b)=>b.score-a.score||a.entry.title.localeCompare(b.entry.title,'vi')).map(result=>result.entry);
}
