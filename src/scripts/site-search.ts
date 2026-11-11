import {searchEntries,type SearchEntry} from '../lib/site-search';
const root=document.querySelector<HTMLElement>('[data-site-search]');
if(root){
  const form=root.querySelector<HTMLFormElement>('[data-site-search-form]')!;
  const input=form.querySelector<HTMLInputElement>('[name="q"]')!;
  const output=root.querySelector<HTMLElement>('[data-search-output]')!;
  const status=root.querySelector<HTMLElement>('[data-search-status]')!;
  const list=root.querySelector<HTMLOListElement>('[data-search-results]')!;
  const more=root.querySelector<HTMLButtonElement>('[data-search-more]')!;
  const empty=root.querySelector<HTMLElement>('[data-search-empty]')!;
  let indexPromise:Promise<SearchEntry[]>|null=null;
  let version=0;
  let matches:SearchEntry[]=[];
  let limit=12;
  const loadIndex=()=>{
    if(!indexPromise)indexPromise=fetch('/search-index.json').then(async response=>{
      if(!response.ok)throw new Error('search_unavailable');
      const data:SearchEntry[]=await response.json();
      return data.filter(entry=>entry.url.startsWith('/')&&!entry.url.startsWith('//'));
    }).catch(error=>{indexPromise=null;throw error;});
    return indexPromise;
  };
  const render=()=>{
    const fragment=document.createDocumentFragment();
    for(const entry of matches.slice(0,limit)){
      const item=document.createElement('li');
      const link=document.createElement('a');
      link.href=entry.url;
      const category=document.createElement('span');category.className='search-result-category';category.textContent=entry.category;
      const title=document.createElement('h2');title.textContent=entry.title;
      const description=document.createElement('p');description.textContent=entry.description;
      const arrow=document.createElement('span');arrow.className='search-result-arrow';arrow.textContent='→';arrow.setAttribute('aria-hidden','true');
      link.append(category,title,description,arrow);item.append(link);fragment.append(item);
    }
    list.replaceChildren(fragment);
    more.hidden=matches.length<=limit;
  };
  const run=async(raw:string,historyMode:'push'|'replace'|false=false)=>{
    const query=raw.trim().slice(0,120);
    const request=++version;
    input.value=query;matches=[];limit=12;list.replaceChildren();more.hidden=true;empty.hidden=true;
    if(historyMode){
      const destination=new URL(location.href);
      if(query)destination.searchParams.set('q',query);else destination.searchParams.delete('q');
      if(destination.href!==location.href)history[historyMode==='push'?'pushState':'replaceState'](null,'',destination);
    }
    if(query.length<2){
      status.textContent=query?'Nhập ít nhất 2 ký tự để tìm kiếm.':'Nhập từ khóa để bắt đầu tìm kiếm.';
      output.removeAttribute('aria-busy');return;
    }
    status.textContent='Đang tìm kiếm…';output.setAttribute('aria-busy','true');
    try{
      const index=await loadIndex();
      if(request!==version)return;
      matches=searchEntries(index,query);
      status.textContent=matches.length?'Tìm thấy '+matches.length+' kết quả cho “'+query+'”.':'Không có kết quả cho “'+query+'”.';
      empty.hidden=matches.length>0;
      render();
    }catch{
      if(request!==version)return;
      status.textContent='Chưa tải được kết quả. Vui lòng thử tìm lại hoặc mở danh mục bên dưới.';
    }finally{
      if(request===version)output.removeAttribute('aria-busy');
    }
  };
  form.addEventListener('submit',event=>{event.preventDefault();void run(input.value,'push');});
  input.addEventListener('input',()=>{if(!input.value.trim())void run('','replace');});
  more.addEventListener('click',()=>{
    const nextIndex=limit;limit+=12;render();
    list.querySelector<HTMLAnchorElement>('li:nth-child('+(nextIndex+1)+') a')?.focus();
  });
  window.addEventListener('popstate',()=>void run(new URLSearchParams(location.search).get('q')??''));
  void run(new URLSearchParams(location.search).get('q')??'');
}
