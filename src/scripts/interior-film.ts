const root=document.querySelector<HTMLElement>('[data-interior-film]');
if(root){
  const tabList=root.querySelector<HTMLElement>('[data-film-tabs]')!;
  const tabs=[...root.querySelectorAll<HTMLButtonElement>('[data-film-tab]')];
  const panels=[...root.querySelectorAll<HTMLElement>('[data-film-application]')];
  if(tabs.length===panels.length&&tabs.length){
    tabList.hidden=false;
    tabList.setAttribute('role','tablist');
    const select=(index:number,focus=false)=>{
      tabs.forEach((tab,i)=>{
        tab.setAttribute('role','tab');
        tab.setAttribute('aria-selected',String(i===index));
        tab.tabIndex=i===index?0:-1;
        panels[i].setAttribute('role','tabpanel');
        panels[i].setAttribute('aria-labelledby',tab.id);
        panels[i].tabIndex=0;
        panels[i].hidden=i!==index;
      });
      if(focus){
        tabs[index].focus({preventScroll:true});
        const tab=tabs[index].getBoundingClientRect();
        const list=tabList.getBoundingClientRect();
        if(tab.left<list.left)tabList.scrollLeft-=list.left-tab.left+8;
        else if(tab.right>list.right)tabList.scrollLeft+=tab.right-list.right+8;
      }
    };
    select(0);
    tabs.forEach((tab,index)=>{
      tab.addEventListener('click',()=>select(index));
      tab.addEventListener('keydown',event=>{
        const next=event.key==='ArrowRight'?(index+1)%tabs.length:event.key==='ArrowLeft'?(index+tabs.length-1)%tabs.length:event.key==='Home'?0:event.key==='End'?tabs.length-1:null;
        if(next!==null){event.preventDefault();select(next,true);}
      });
    });
  }
  const navigation=root.querySelector<HTMLElement>('[data-film-navigation]')!;
  const links=[...navigation.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
  const sections=links.map(link=>root.querySelector<HTMLElement>(link.hash)).filter((section):section is HTMLElement=>Boolean(section));
  const update=()=>{
    const offset=navigation.getBoundingClientRect().bottom+40;
    const current=sections.filter(section=>section.getBoundingClientRect().top<=offset).at(-1)??sections[0];
    for(const link of links){
      if(link.hash==='#'+current.id)link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    }
  };
  let queued=false;
  const schedule=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{update();queued=false;});
  };
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  window.addEventListener('load',schedule,{once:true});
  update();
}
