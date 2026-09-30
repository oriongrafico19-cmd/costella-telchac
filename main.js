document.documentElement.classList.add('js-enabled');

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

const config = window.COSTELLA_CONFIG || {
  bookingUrl:'',
  webinarUrl:'',
  leadEndpoint:'',
  webinarSlots:10,
  showWebinarScarcity:false,
  metaPixelId:'',
  qualificationReferenceDownPayment:80000
};

const header = $('#siteHeader');
const pageProgress = $('#pageProgress');
const modal = $('#qualifyModal');
const steps = $$('.qualify-step');
const progress = $('#qualifyProgress');
const progressText = $('#qualifyProgressText');
const stepCounter = $('#qualifyStepCounter');
const form = $('#qualificationForm');
const formStatus = $('#formStatus');
const resultPanel = $('#resultPanel');
const resultBooking = $('#resultBooking');
const resultWebinar = $('#resultWebinar');
const resultTitle = $('#resultTitle');
const resultBody = $('#resultBody');
const resultScarcity = $('#resultScarcity');
const altBox = $('#alternativeForm');
const altForm = $('#altLeadForm');
const altStatus = $('#altStatus');

let currentStep = 0;
const answers = {};
const progressMap = [0,38,58,78,92,100];

const compatible = {
  q1: new Set(['80k-plus']),
  q2: new Set(['build','invest']),
  q3: new Set(['2029','2030-plus']),
  q4: new Set(['30-days','1-3-months']),
  q5: new Set(['call','webinar'])
};

function updatePageProgress(){
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  pageProgress.style.width = pct.toFixed(1) + '%';
}
function handleHeader(){
  header.classList.toggle('scrolled', window.scrollY > 25);
}
window.addEventListener('scroll',()=>{ updatePageProgress(); handleHeader(); },{passive:true});
updatePageProgress(); handleHeader();

const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('is-visible'); });
},{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));

function openModal(){
  currentStep=0;
  Object.keys(answers).forEach(k=>delete answers[k]);
  form.reset();
  form.classList.remove('hidden');
  resultPanel.hidden=true;
  altBox.hidden=true;
  resultBooking.hidden=true;
  resultWebinar.hidden=true;
  resultScarcity.hidden=true;
  formStatus.textContent='';
  renderStep();
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}
function closeModal(){
  modal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
$$('.js-qualify').forEach(b=>b.addEventListener('click',openModal));
$('#qualifyClose').addEventListener('click',closeModal);
$$('[data-close-modal]').forEach(b=>b.addEventListener('click',closeModal));

function renderStep(){
  steps.forEach((step,i)=>step.classList.toggle('active',i===currentStep));
  const pct=progressMap[currentStep];
  progress.style.width=pct+'%';
  progressText.textContent=currentStep===0?'Empieza la evaluación':pct+'% de avance';
  stepCounter.textContent='Pregunta '+(currentStep+1)+' de 5';
}
function requireChoice(q){
  const value = form.querySelector(`input[name="${q}"]:checked`);
  if(!value){
    formStatus.textContent='Selecciona una opción para continuar.';
    return null;
  }
  formStatus.textContent='';
  return value.value;
}
$$('[data-next]').forEach(btn=>btn.addEventListener('click',()=>{
  const q='q'+(currentStep+1);
  const value=requireChoice(q);
  if(!value)return;
  answers[q]=value;
  if(currentStep<steps.length-1){currentStep++; renderStep();}
}));
$$('[data-prev]').forEach(btn=>btn.addEventListener('click',()=>{currentStep=Math.max(0,currentStep-1); renderStep();}));

function computeResult(){
  const score = Object.keys(compatible).reduce((sum,q)=>sum+(compatible[q].has(answers[q])?1:0),0);
  return {qualified:score>=2,score};
}
async function sendLead(extra){
  const payload={source:'costella-v14-qualification',timestamp:new Date().toISOString(),answers,...extra};
  try{localStorage.setItem('costella_last_lead',JSON.stringify(payload));}catch{}
  if(!config.leadEndpoint)return;
  try{
    await fetch(config.leadEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true});
  }catch(err){console.warn('Lead endpoint error',err);}
}
function track(event,params={}){
  if(window.fbq) window.fbq('track',event,params);
}
async function showResult(){
  const {qualified,score}=computeResult();
  form.hidden=true;
  resultPanel.hidden=false;
  if(qualified){
    $('#resultIcon').textContent='✓';
    resultTitle.textContent='Tu perfil es compatible con Costella.';
    resultBody.innerHTML='Tus respuestas coinciden con los criterios iniciales de esta evaluación.<br><strong>El siguiente paso es conocer disponibilidad, condiciones vigentes y resolver tus preguntas con un asesor.</strong>';
    if(config.bookingUrl){
      resultBooking.href=config.bookingUrl;
      resultBooking.hidden=false;
    }
    if(config.webinarUrl){
      resultWebinar.href=config.webinarUrl;
      resultWebinar.hidden=false;
      if(config.showWebinarScarcity){
        resultScarcity.textContent=`Cupo confirmado: ${config.webinarSlots} lugares disponibles para el próximo webinar.`;
        resultScarcity.hidden=false;
      }
    }
    altBox.hidden=true;
    await sendLead({qualification:'compatible',score});
    track('Lead',{content_name:'Costella compatible',score});
  }else{
    $('#resultIcon').textContent='–';
    resultTitle.textContent='Quizá estás buscando algo diferente a Costella.';
    resultBody.innerHTML='No pasa nada. Queremos conocer mejor lo que buscas para poder avisarte cuando exista una alternativa que encaje mejor contigo.';
    resultBooking.hidden=true;
    resultWebinar.hidden=true;
    resultScarcity.hidden=true;
    altBox.hidden=false;
    await sendLead({qualification:'alternative',score});
    track('Lead',{content_name:'Costella alternative',score});
  }
}
$('#showResult').addEventListener('click',async()=>{
  const q='q5';
  const value=requireChoice(q);
  if(!value)return;
  answers[q]=value;
  currentStep=4;
  progress.style.width='100%';
  progressText.textContent='100% de avance';
  stepCounter.textContent='Evaluación completada';
  await showResult();
});

altForm.addEventListener('submit',async e=>{
  e.preventDefault();
  const fd=new FormData(altForm);
  const contact={
    name:String(fd.get('name')||'').trim(),
    whatsapp:String(fd.get('whatsapp')||'').trim(),
    email:String(fd.get('email')||'').trim(),
    budget:String(fd.get('budget')||'').trim(),
    interest:String(fd.get('interest')||'').trim()
  };
  if(!contact.name||!contact.whatsapp){altStatus.textContent='Agrega tu nombre y WhatsApp para continuar.';return;}
  await sendLead({alternative:true,contact});
  altStatus.textContent='Listo. Registramos tu interés y te contactaremos cuando tengamos una alternativa compatible.';
  altForm.querySelector('button').disabled=true;
});

document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.getAttribute('aria-hidden')==='false')closeModal();});
$('#year').textContent=new Date().getFullYear();
