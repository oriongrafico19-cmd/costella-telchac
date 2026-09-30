document.documentElement.classList.add('js');

const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>Array.from(root.querySelectorAll(s));
const cfg = window.COSTELLA_CONFIG || {};

const header = $('#siteHeader');
const scrollProgress = $('#scrollProgress');
const modal = $('#qualifyModal');
const form = $('#qualificationForm');
const steps = $$('.qualify-step');
const qualifyProgress = $('#qualifyProgress');
const progressText = $('#progressText');
const stepCounter = $('#stepCounter');
const formStatus = $('#formStatus');
const resultPanel = $('#resultPanel');
const resultBooking = $('#resultBooking');
const resultWebinar = $('#resultWebinar');
const resultTitle = $('#resultTitle');
const resultBody = $('#resultBody');
const resultScarcity = $('#resultScarcity');
const alternativeForm = $('#alternativeForm');
const altForm = $('#altLeadForm');
const altStatus = $('#altStatus');
const nextBtn = $('#nextBtn');

let step = 0;
let answers = {};
const progressMap = [0,38,58,78,92,100];
const compatible = {
  q1:new Set(['80k-plus']),
  q2:new Set(['build','invest']),
  q3:new Set(['2029','2030-plus']),
  q4:new Set(['30-days','1-3-months']),
  q5:new Set(['call','webinar'])
};

function updateScroll(){
  const max=document.documentElement.scrollHeight-window.innerHeight;
  scrollProgress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
  header.classList.toggle('scrolled',window.scrollY>20);
}
window.addEventListener('scroll',updateScroll,{passive:true}); updateScroll();

const revealObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('is-visible'); });
},{threshold:.12});
$$('.section-kicker,.editorial-head,.image-wide,.stats-band,.finance-grid,.amenity-card,.club-hero,.beach-grid,.certainty-grid,.history-grid,.faq-list,.final-content').forEach(el=>{
  el.classList.add('reveal'); revealObserver.observe(el);
});

function resetModal(){
  step=0; answers={}; form.reset(); form.hidden=false; resultPanel.hidden=true; alternativeForm.hidden=true;
  resultBooking.hidden=true; resultWebinar.hidden=true; resultScarcity.hidden=true;
  formStatus.textContent=''; altStatus.textContent=''; renderStep();
}
function openModal(){
  resetModal(); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open');
}
function closeModal(){
  modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open');
}
$$('.js-qualify').forEach(btn=>btn.addEventListener('click',openModal));
$('#qualifyClose').addEventListener('click',closeModal);
$$('[data-close-modal]').forEach(x=>x.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{ if(e.key==='Escape' && modal.getAttribute('aria-hidden')==='false') closeModal(); });

function renderStep(){
  steps.forEach((s,i)=>s.classList.toggle('active',i===step));
  qualifyProgress.style.width=progressMap[step]+'%';
  progressText.textContent=step===0?'Empieza la evaluación':progressMap[step]+'% de avance';
  stepCounter.textContent='Pregunta '+(step+1)+' de 5';
  $('#qualifyModal').querySelector('[data-prev]').style.visibility=step===0?'hidden':'visible';
  nextBtn.textContent=(step===steps.length-1?'Ver mi resultado':'Continuar')+' →';
}
function readCurrent(){
  const key='q'+(step+1);
  const input=form.querySelector(`input[name="${key}"]:checked`);
  if(!input){formStatus.textContent='Selecciona una opción para continuar.';return null;}
  formStatus.textContent=''; answers[key]=input.value; return input.value;
}
nextBtn.addEventListener('click',()=>{
  if(!readCurrent()) return;
  if(step<steps.length-1){step++;renderStep();}else{showResult();}
});
$('[data-prev]').addEventListener('click',()=>{if(step>0){step--;renderStep();}});

function compute(){
  const score=Object.keys(compatible).reduce((n,q)=>n+(compatible[q].has(answers[q])?1:0),0);
  return {qualified:score>=2,score};
}
function openExternal(url){
  if(url) window.open(url,'_blank','noopener,noreferrer');
}
function showResult(){
  const result=compute();
  form.hidden=true; resultPanel.hidden=false;
  if(result.qualified){
    resultTitle.textContent='Tu perfil es compatible con Costella.';
    resultBody.innerHTML='<strong>Por tus respuestas, vale la pena avanzar.</strong><br>El siguiente paso es conocer condiciones vigentes, disponibilidad y resolver tus preguntas con un asesor.';
    resultBooking.hidden=!cfg.bookingUrl;
    resultWebinar.hidden=!cfg.webinarUrl;
    resultBooking.onclick=()=>openExternal(cfg.bookingUrl);
    resultWebinar.onclick=()=>openExternal(cfg.webinarUrl);
    if(cfg.showWebinarScarcity && cfg.webinarUrl){
      resultScarcity.textContent=`Cupo confirmado: quedan ${cfg.webinarSlots||10} lugares para el próximo webinar.`;
      resultScarcity.hidden=false;
    }
  }else{
    resultTitle.textContent='Hoy quizá estés buscando algo diferente.';
    resultBody.textContent='Déjanos tus datos y cuéntanos qué estás buscando. Cuando exista un proyecto que encaje mejor contigo, podremos contactarte.';
    alternativeForm.hidden=false;
  }
  resultPanel.scrollIntoView({block:'nearest'});
}
altForm.addEventListener('submit',e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(altForm).entries());
  try{localStorage.setItem('costella_alt_lead',JSON.stringify({timestamp:new Date().toISOString(),...data}));}catch{}
  altStatus.textContent='Listo. Registramos tu interés.';
  altForm.querySelector('button').disabled=true;
});
