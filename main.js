const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
try {
  const localConfig = localStorage.getItem('costella_config');
  if (localConfig) Object.assign(COSTELLA_CONFIG, JSON.parse(localConfig));
} catch {}


function track(name, params = {}) {
  if (COSTELLA_CONFIG.metaPixelId && window.fbq) window.fbq('track', name, params);
}

function openExternal(url, fallbackMessage) {
  const clean = String(url || '').trim();
  if (clean) {
    window.open(clean, '_blank', 'noopener,noreferrer');
    return true;
  }
  if (fallbackMessage) alert(fallbackMessage);
  return false;
}

function openBooking() {
  track('Schedule');
  openExternal(
    COSTELLA_CONFIG.bookingUrl,
    'El enlace de agenda del asesor todavía no está configurado.'
  );
}

function openWebinar() {
  track('ViewContent', { content_name: 'Costella Webinar' });
  openExternal(
    COSTELLA_CONFIG.webinarUrl,
    'El enlace del próximo webinar todavía no está configurado.'
  );
}

window.addEventListener('scroll', () => {
  $('#header')?.classList.toggle('scrolled', scrollY > 35);
}, { passive: true });

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  }), { threshold: .08 });
  $$('.reveal').forEach(el => io.observe(el));
} else {
  $$('.reveal').forEach(el => el.classList.add('visible'));
}

// Lightbox
const lb = $('#lightbox');
const lbi = $('#lightboxImage');
const lbc = $('#lightboxCaption');
function closeLightbox() {
  if (!lb) return;
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { if (!lb.classList.contains('open')) lbi.src = ''; }, 120);
}
$$('.lightboxable').forEach(img => img.addEventListener('click', () => {
  lbi.src = img.currentSrc || img.src;
  lbi.alt = img.alt || '';
  lbc.textContent = img.alt || '';
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}));
$('.lightbox-close')?.addEventListener('click', closeLightbox);
lb?.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

// Qualification funnel
const modal = $('#qualifyModal');
const form = $('#qualificationForm');
const modalClose = $('#qualifyClose');
const modalBackdrop = $('#qualifyBackdrop');
const progress = $('#qualifyProgress');
const progressText = $('#qualifyProgressText');
const stepCounter = $('#qualifyStepCounter');
const status = $('#qualifyStatus');
const resultPanel = $('#qualifyResult');
const resultTitle = $('#qualifyResultTitle');
const resultBody = $('#qualifyResultBody');
const resultPrimary = $('#qualifyResultPrimary');
const resultSecondary = $('#qualifyResultSecondary');
const resultUrgency = $('#qualifyUrgency');
const altLead = $('#altLead');
const questionSteps = $$('.qualify-step');
const TOTAL_STEPS = 5;

// 4 choices per question = 1,024 possible combinations.
// Compatibility is intentionally based on the combination, not one single answer.
// Compatible choices: Q1=1/4, Q2=2/4, Q3=2/4, Q4=2/4, Q5=2/4.
// Threshold: >= 2 compatible answers.
// Result: exactly 768/1,024 = 75% compatible and 256/1,024 = 25% alternative.
const PROGRESS = [0, 38, 58, 78, 92, 100];
const COMPATIBLE_OPTIONS = {
  q1: new Set(['80k-plus']),
  q2: new Set(['build', 'invest']),
  q3: new Set(['2029', '2030-plus']),
  q4: new Set(['30-days', '1-3-months']),
  q5: new Set(['call', 'webinar'])
};

let currentStep = 0;
let answers = {};

function resetQualification() {
  currentStep = 0;
  answers = {};
  form?.reset();
  resultPanel?.classList.remove('show');
  resultPanel?.setAttribute('aria-hidden', 'true');
  altLead?.setAttribute('hidden', '');
  form?.classList.remove('hidden');
  questionSteps.forEach(step => step.classList.remove('active'));
  $('.qualify-step[data-step="0"]')?.classList.add('active');
  if (resultPrimary) resultPrimary.hidden = false;
  if (resultSecondary) resultSecondary.hidden = false;
  if (resultUrgency) resultUrgency.hidden = true;
  updateProgress();
  if (status) {
    status.textContent = '';
    status.classList.remove('show');
  }
  const altNote = $('#altLeadNote');
  if (altNote) altNote.textContent = '';
}

function updateProgress() {
  const pct = PROGRESS[Math.min(currentStep, TOTAL_STEPS)];
  if (progress) progress.style.width = `${pct}%`;
  if (progressText) {
    progressText.textContent = currentStep === 0 ? 'Empieza la evaluación' : `${pct}% de avance`;
  }
  if (stepCounter) {
    stepCounter.textContent = currentStep < TOTAL_STEPS
      ? `Pregunta ${currentStep + 1} de ${TOTAL_STEPS}`
      : 'Evaluación completada';
  }
}

function previewProgressForAnswer(stepIndex) {
  const pct = PROGRESS[Math.min(stepIndex + 1, TOTAL_STEPS)];
  if (progress) progress.style.width = `${pct}%`;
  if (progressText) progressText.textContent = `${pct}% de avance`;
}

function openQualification() {
  resetQualification();
  modal?.classList.add('open');
  modal?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  track('ViewContent', { content_name: 'Costella Qualification V12' });
}

function closeQualification() {
  modal?.classList.remove('open');
  modal?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Every landing CTA opens the qualification first; booking/webinar are only
// exposed after the five questions are completed and the profile is compatible.
$$('.js-qualify').forEach(btn => btn.addEventListener('click', openQualification));
modalClose?.addEventListener('click', closeQualification);
modalBackdrop?.addEventListener('click', closeQualification);

$$('.qualify-option input').forEach(input => input.addEventListener('change', () => {
  const step = Number(input.closest('.qualify-step')?.dataset.step || 0);
  previewProgressForAnswer(step);
  if (status) {
    status.textContent = '';
    status.classList.remove('show');
  }
}));

function selectedValue(step) {
  return form?.querySelector(`input[name="q${step}"]:checked`)?.value || '';
}

function showStep(index) {
  questionSteps.forEach(step => step.classList.remove('active'));
  $(`.qualify-step[data-step="${index}"]`)?.classList.add('active');
  currentStep = index;
  updateProgress();
}

function calculateQualification() {
  const breakdown = Object.entries(COMPATIBLE_OPTIONS).map(([question, options]) => ({
    question,
    value: answers[question] || '',
    compatible: options.has(answers[question])
  }));

  const compatibleCount = breakdown.filter(item => item.compatible).length;
  const qualified = compatibleCount >= 2;
  const priority = qualified && COMPATIBLE_OPTIONS.q1.has(answers.q1) && COMPATIBLE_OPTIONS.q4.has(answers.q4);

  return { qualified, priority, compatibleCount, breakdown };
}

async function submitLead(extra = {}) {
  const payload = {
    source: 'costella-qualification-v12',
    timestamp: new Date().toISOString(),
    answers,
    ...extra
  };

  try {
    sessionStorage.setItem('costella_lead_v9', JSON.stringify(payload));
  } catch {}

  const endpoint = String(COSTELLA_CONFIG.leadEndpoint || '').trim();
  if (!endpoint) return;

  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    });
  } catch (error) {
    console.warn('No se pudo enviar el lead:', error);
  }
}

async function showResult() {
  const result = calculateQualification();

  form?.classList.add('hidden');
  resultPanel?.classList.add('show');
  resultPanel?.setAttribute('aria-hidden', 'false');
  currentStep = TOTAL_STEPS;
  updateProgress();

  await submitLead({
    qualification: result.qualified ? 'compatible' : 'alternative',
    priority: result.priority,
    compatibleCount: result.compatibleCount
  });

  track('Lead', {
    qualification: result.qualified ? 'compatible' : 'alternative',
    priority: result.priority ? 'high' : 'standard'
  });

  if (result.qualified) {
    resultTitle.textContent = result.priority
      ? 'Tu perfil es compatible con Costella y estás en un buen momento para avanzar.'
      : 'Tu perfil es compatible con Costella Telchac Residencial.';

    resultBody.innerHTML = result.priority
      ? '<strong>Ya cuentas con el punto de partida que buscamos.</strong><br>Ahora puedes avanzar al siguiente paso que elegiste y confirmar las condiciones vigentes con el asesor.'
      : 'Tus respuestas encajan con los criterios iniciales de Costella.<br>Ahora puedes conocer el siguiente paso y confirmar las condiciones vigentes.';

    // Only expose the path the prospect requested in Q5.
    const wantsBooking = answers.q5 === 'call';
    const wantsWebinar = answers.q5 === 'webinar';

    resultPrimary.textContent = 'Agenda una videollamada';
    resultPrimary.onclick = openBooking;
    resultPrimary.hidden = !wantsBooking || !String(COSTELLA_CONFIG.bookingUrl || '').trim();

    resultSecondary.textContent = 'Participa en el próximo webinar';
    resultSecondary.onclick = openWebinar;
    resultSecondary.hidden = !wantsWebinar || !String(COSTELLA_CONFIG.webinarUrl || '').trim();

    // Safety fallback in case a URL is not configured yet.
    if ((wantsBooking && !String(COSTELLA_CONFIG.bookingUrl || '').trim()) ||
        (wantsWebinar && !String(COSTELLA_CONFIG.webinarUrl || '').trim())) {
      resultBody.innerHTML += '<br><br><small>El enlace del siguiente paso todavía está por configurarse. Tu evaluación quedó registrada.</small>';
    }

    if (COSTELLA_CONFIG.showWebinarScarcity && COSTELLA_CONFIG.webinarSlots && wantsWebinar && !resultSecondary.hidden) {
      resultUrgency.textContent = `Cupo confirmado: quedan ${COSTELLA_CONFIG.webinarSlots} lugares para el próximo webinar.`;
      resultUrgency.hidden = false;
    } else {
      resultUrgency.hidden = true;
    }

    altLead.hidden = true;
  } else {
    resultTitle.textContent = 'Hoy tu perfil no es el mejor ajuste para Costella.';
    resultBody.innerHTML = 'No es un problema: tus respuestas indican que estás buscando otras condiciones en este momento.<br><strong>Déjanos tus datos y podremos avisarte cuando exista un proyecto que encaje mejor contigo.</strong>';
    resultPrimary.hidden = true;
    resultSecondary.hidden = true;
    resultUrgency.hidden = true;
    altLead.hidden = false;
  }
}

function nextStep() {
  const value = selectedValue(currentStep + 1);

  if (!value) {
    if (status) {
      status.textContent = 'Selecciona una opción para continuar.';
      status.classList.add('show');
    }
    return;
  }

  answers[`q${currentStep + 1}`] = value;

  if (currentStep < TOTAL_STEPS - 1) {
    showStep(currentStep + 1);
  } else {
    showResult();
  }
}

form?.addEventListener('submit', event => {
  event.preventDefault();
  nextStep();
});

$$('[data-back-step]').forEach(btn => btn.addEventListener('click', () => {
  showStep(Math.max(0, currentStep - 1));
}));

$('#qualifyReset')?.addEventListener('click', resetQualification);

$('#altLeadForm')?.addEventListener('submit', async event => {
  event.preventDefault();
  const fd = new FormData(event.currentTarget);
  const contact = {
    name: String(fd.get('name') || '').trim(),
    whatsapp: String(fd.get('whatsapp') || '').trim()
  };
  const note = $('#altLeadNote');

  if (!contact.name || !contact.whatsapp) {
    if (note) note.textContent = 'Agrega tu nombre y WhatsApp para continuar.';
    return;
  }

  await submitLead({
    contact,
    qualification: 'alternative',
    alternative_interest: true,
    compatibleCount: calculateQualification().compatibleCount
  });

  if (note) note.textContent = 'Listo. Registramos tu interés y te avisaremos cuando tengamos una alternativa compatible.';
  const submitButton = event.currentTarget.querySelector('button');
  if (submitButton) submitButton.disabled = true;

  track('Lead', { qualification: 'alternative', alternative_interest: true });
});

window.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeLightbox();
    closeQualification();
  }
});
