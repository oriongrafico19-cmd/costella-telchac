const $ = (s,root=document)=>root.querySelector(s); const $$=(s,root=document)=>[...root.querySelectorAll(s)];
function openLead(){ $('#leadModal').classList.add('open'); $('#leadModal').setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeLead(){ $('#leadModal').classList.remove('open'); $('#leadModal').setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
$$('.js-book').forEach(b=>b.addEventListener('click',openLead));
$$('.js-contact').forEach(b=>b.addEventListener('click',openLead));
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeLead()});
window.addEventListener('scroll',()=>$('#header').classList.toggle('scrolled',scrollY>30),{passive:true});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));
$('#leadForm').addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget;const data=Object.fromEntries(new FormData(form));
  if(COSTELLA_CONFIG.leadEndpoint){try{await fetch(COSTELLA_CONFIG.leadEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,source:'costella-landing'})})}catch(err){console.warn('Lead endpoint unavailable',err)}}
  if(COSTELLA_CONFIG.metaPixelId && window.fbq) fbq('track','Lead');
  $('#bookingLink').href=COSTELLA_CONFIG.bookingUrl||'#';
  const wa=COSTELLA_CONFIG.whatsappNumber; $('#whatsappLink').href=wa?`https://wa.me/${wa.replace(/\D/g,'')}?text=${encodeURIComponent('Hola, quiero recibir información de Costella Telchac Residencial.')}`:'#';
  $('#leadFormView').hidden=true;$('#successView').hidden=false;
});
