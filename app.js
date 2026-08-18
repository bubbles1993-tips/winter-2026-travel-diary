
const D = window.TRAVEL_DIARY;
const esc = s => String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function photo([src,caption,poster]){
  const posterAttr=poster?` poster="${esc(poster)}"`:'';
  const media=/\.mp4(?:$|\?)/i.test(src)
    ?`<video src="${esc(src)}" controls muted playsinline preload="metadata"${posterAttr} aria-label="${esc(caption)}"></video>`
    :`<img src="${esc(src)}" alt="${esc(caption)}" loading="lazy">`;
  return `<figure class="photo">${media}<figcaption>${esc(caption)}</figcaption></figure>`
}
function entry(e){
  const photos=e.photos?.length?`<div class="gallery ${e.photos.length>2?'many':''}">${e.photos.map(photo).join('')}</div>`:'';
  return `<section class="entry ${e.dark?'dark':''}" id="${e.id}">
    <div class="entry-head"><div class="date">${e.date}</div><h2>${e.title}</h2><p class="route">${e.location}</p></div>
    <div class="copy">${e.paragraphs.map(p=>`<p>${p}</p>`).join('')}${e.note?`<aside class="note"><strong>Date / data note:</strong> ${e.note}</aside>`:''}</div>
    ${photos}
  </section>`
}
document.getElementById('hero-image').src=D.heroImage;
document.getElementById('title').textContent=D.title;
document.getElementById('subtitle').textContent=D.subtitle;
document.getElementById('dates').textContent=D.dates;
document.getElementById('stats').innerHTML=D.stats.map(([n,l])=>`<div class="stat"><b>${n}</b><span>${l}</span></div>`).join('');
document.getElementById('intro-copy').innerHTML=D.intro.map(p=>`<p>${p}</p>`).join('');
document.getElementById('route').textContent=D.route;
document.getElementById('entries').innerHTML=D.entries.map(entry).join('');
document.getElementById('nav').innerHTML=D.entries.map(e=>`<a href="#${e.id}">${e.title}</a>`).join('');
document.getElementById('reflection-copy').innerHTML=D.reflection.map(p=>`<p>${p}</p>`).join('');
const box=document.getElementById('lightbox'), big=box.querySelector('img');
document.addEventListener('click',e=>{if(e.target.matches('.photo img')){big.src=e.target.src;big.alt=e.target.alt;box.classList.add('open')}});
box.addEventListener('click',e=>{if(e.target===box||e.target.tagName==='BUTTON'){box.classList.remove('open');big.src=''}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')box.classList.remove('open')});
