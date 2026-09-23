const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];

function openLead(){
  const modal=$('#leadModal'); if(!modal) return;
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
}
function closeLead(){
  const modal=$('#leadModal'); if(!modal) return;
  modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow='';
}
$$('.js-book,.js-contact').forEach(b=>b.addEventListener('click',openLead));
window.addEventListener('keydown',e=>{if(e.key==='Escape'){closeLead();closeLightbox();}});
window.addEventListener('scroll',()=>$('#header')?.classList.toggle('scrolled',scrollY>30),{passive:true});

// Reveal on scroll
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.10});
  $$('.reveal').forEach(el=>observer.observe(el));
}else $$('.reveal').forEach(el=>el.classList.add('visible'));

// Lightbox for every content image
const lightbox=$('#lightbox'), lightboxImage=$('#lightboxImage'), lightboxCaption=$('#lightboxCaption');
function openLightbox(img){
  if(!lightbox||!lightboxImage) return;
  lightboxImage.src=img.currentSrc||img.src; lightboxImage.alt=img.alt||''; lightboxCaption.textContent=img.alt||'';
  lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
}
function closeLightbox(){
  if(!lightbox) return;
  lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true'); document.body.style.overflow='';
  setTimeout(()=>{if(!lightbox.classList.contains('open')) lightboxImage.src=''},150);
}
$$('main img').forEach(img=>{img.classList.add('lightboxable');img.addEventListener('click',()=>openLightbox(img));});
$('.lightbox-close')?.addEventListener('click',closeLightbox);
lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});

// YouTube video from config
function youtubeEmbed(url){
  if(!url) return '';
  try{
    const u=new URL(url);
    let id=u.searchParams.get('v');
    if(u.hostname.includes('youtu.be')) id=u.pathname.slice(1);
    if(u.pathname.includes('/embed/')) id=u.pathname.split('/embed/')[1].split('/')[0];
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` : '';
  }catch{return '';}
}
const embed=youtubeEmbed(COSTELLA_CONFIG.youtubeUrl);
if(embed && $('#youtubeFrame')) $('#youtubeFrame').src=embed;

// Apply the browser-saved admin configuration (prototype CMS layer).
function applyAdminOverrides(){
  try{
    const data=JSON.parse(localStorage.getItem('costella_admin_v2')||'{}');
    const set=(selector,key)=>{if(data[key]!==undefined && $(selector)) $(selector).textContent=data[key];};
    set('.hero h1','heroTitle');
    set('.hero .lead','heroLead');
    set('.location h2','telchacTitle');
    set('.stats h2','costellaTitle');
    set('.gallery h2','galleryTitle');
    set('.amenities h2','amenitiesTitle');
    set('.feature h2','clubTitle');
    set('.commercial h2','commercialTitle');
    const priceEls=$$('.commercial-data > div strong');
    if(data.apartado && priceEls[0]) priceEls[0].textContent=data.apartado;
    if(data.enganche && priceEls[1]) priceEls[1].textContent=data.enganche;
    if(data.financiamiento && priceEls[2]) priceEls[2].textContent=data.financiamiento.replace(' meses','');
    if(data.mensualidades && priceEls[3]) priceEls[3].textContent=data.mensualidades;
    if(data.heroImage) $('.hero-bg')?.style.setProperty('background-image',`url('${data.heroImage}')`);
    if(data.clubImage) $('.feature')?.style.setProperty('background-image',`url('${data.clubImage}')`);
    if(data.youtubeUrl){const embed=youtubeEmbed(data.youtubeUrl);if(embed&&$('#youtubeFrame'))$('#youtubeFrame').src=embed;}
    if(data.booking) COSTELLA_CONFIG.bookingUrl=data.booking;
    if(data.whatsapp) COSTELLA_CONFIG.whatsappNumber=data.whatsapp;
    if(data.leadEndpoint) COSTELLA_CONFIG.leadEndpoint=data.leadEndpoint;
    if(data.pixel) COSTELLA_CONFIG.metaPixelId=data.pixel;
  }catch(err){console.warn('Admin config not available',err)}
}
applyAdminOverrides();

// WhatsApp floating button and success action
function whatsappUrl(){
  const wa=(COSTELLA_CONFIG.whatsappNumber||'').replace(/\D/g,'');
  return wa?`https://wa.me/${wa}?text=${encodeURIComponent('Hola, quiero recibir información de Costella Telchac Residencial.')}`:'#';
}
const floatingWhatsapp=$('#floatingWhatsapp');
if(floatingWhatsapp) floatingWhatsapp.href=whatsappUrl();

$('#leadForm')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.currentTarget, data=Object.fromEntries(new FormData(form));
  if(COSTELLA_CONFIG.leadEndpoint){
    try{await fetch(COSTELLA_CONFIG.leadEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,source:'costella-landing'})})}
    catch(err){console.warn('Lead endpoint unavailable',err)}
  }
  if(COSTELLA_CONFIG.metaPixelId && window.fbq) fbq('track','Lead');
  $('#bookingLink').href=COSTELLA_CONFIG.bookingUrl||'#';
  $('#whatsappLink').href=whatsappUrl();
  $('#leadFormView').hidden=true; $('#successView').hidden=false;
});
