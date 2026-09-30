const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const header=$('#siteHeader');
window.addEventListener('scroll',()=>header?.classList.toggle('scrolled',window.scrollY>40),{passive:true});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('is-visible')}),{threshold:.14});
$$('.reveal').forEach(el=>io.observe(el));

const modal=$('#qualificationModal'),closeBtn=$('#modalClose'),form=$('#qualificationForm'),steps=$$('.q-step'),bar=$('#progressBar'),progressText=$('#progressText'),counter=$('#stepCounter'),prev=$('#prevQ'),next=$('#nextQ'),err=$('#formError');
const result=$('#resultPanel'),resultBadge=$('#resultBadge'),resultTitle=$('#resultTitle'),resultBody=$('#resultBody'),booking=$('#bookingLink'),webinar=$('#webinarLink'),altForm=$('#altForm');
let step=0,answers={};
const pct=[0,38,58,78,92,100];
const compat={q1:new Set(['80k-plus']),q2:new Set(['build','invest']),q3:new Set(['2029','2030-plus']),q4:new Set(['30-days','1-3-months']),q5:new Set(['call','webinar'])};
function openModal(){step=0;answers={};form.hidden=false;result.hidden=true;altForm.hidden=true;form.reset();showStep(0);modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
$$('.js-qualify').forEach(b=>b.addEventListener('click',openModal));
$$('[data-close-modal]').forEach(x=>x.addEventListener('click',closeModal));closeBtn?.addEventListener('click',closeModal);
function showStep(i){steps.forEach(s=>s.classList.remove('active'));steps[i].classList.add('active');step=i;bar.style.width=(pct[i]||0)+'%';progressText.textContent=i===0?'Empieza la evaluación':`${pct[i]}% de avance`;counter.textContent=`Pregunta ${i+1} de 5`;prev.style.visibility=i===0?'hidden':'visible';next.textContent=i===4?'Ver mi resultado →':'Continuar →';err.textContent=''}
steps.forEach((fs,i)=>$$('input',fs).forEach(inp=>inp.addEventListener('change',()=>{bar.style.width=pct[i+1]+'%';progressText.textContent=`${pct[i+1]}% de avance`})));
prev.addEventListener('click',()=>showStep(Math.max(0,step-1)));
next.addEventListener('click',()=>{const input=$(`input[name="q${step+1}"]:checked`,steps[step]);if(!input){err.textContent='Selecciona una opción para continuar.';return}answers['q'+(step+1)]=input.value;if(step<4)showStep(step+1);else finish()});
function qualified(){let score=0;for(const q of Object.keys(compat))if(compat[q].has(answers[q]))score++;return {score,ok:score>=2}};
async function sendLead(extra){const payload={source:'costella-v13',createdAt:new Date().toISOString(),answers,...extra};try{sessionStorage.setItem('costellaLead',JSON.stringify(payload))}catch{}if(!COSTELLA_CONFIG.leadEndpoint)return;try{await fetch(COSTELLA_CONFIG.leadEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true})}catch{}}
function finish(){const r=qualified();form.hidden=true;result.hidden=false;resultBadge.textContent=r.ok?'Perfil compatible':'Perfil alternativo';if(r.ok){resultTitle.textContent='Tu perfil es compatible con Costella.';resultBody.textContent='Por tus respuestas, vale la pena avanzar. Conoce condiciones vigentes y disponibilidad directamente con el equipo.';if(COSTELLA_CONFIG.bookingUrl){booking.href=COSTELLA_CONFIG.bookingUrl;booking.hidden=false}else booking.hidden=true;if(COSTELLA_CONFIG.webinarUrl){webinar.href=COSTELLA_CONFIG.webinarUrl;webinar.hidden=false}else webinar.hidden=true}else{resultTitle.textContent='Hoy quizá estés buscando algo diferente.';resultBody.textContent='No queremos hacerte avanzar a una opción que no encaje contigo. Déjanos tus datos y cuéntanos qué estás buscando para acercarte un proyecto más adecuado.';booking.hidden=true;webinar.hidden=true;altForm.hidden=false}sendLead({qualification:r.ok?'compatible':'alternative',score:r.score})}
$('#altLeadForm')?.addEventListener('submit',async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);await sendLead({qualification:'alternative',contact:Object.fromEntries(fd.entries())});$('#altLeadNote').textContent='Listo. Registramos tu interés.';e.currentTarget.querySelector('button').disabled=true});
