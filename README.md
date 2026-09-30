# Costella Telchac · V13

Landing editorial inspirada en la lógica visual de un sitio institucional de arquitectura: hero visual fuerte, grid editorial, tipografía protagonista, blancos amplios, bloques asimétricos, secciones de proceso y cierre cinematográfico. La referencia se adapta a Costella y no reproduce el sitio de referencia.

## Contenido de Costella
- 19 ha
- 533 lotes
- 200–350 m²
- 5 etapas
- Etapa 1: 2029 · Etapa 2: 2030 · Etapa 3: 2031
- Capella Core (Etapa 2)
- Tau Core (Etapa 3)
- Club Stella (Etapa 4)
- Ara Wellness Center (Etapa 5)
- Apartado $5,000 MXN
- Enganche mínimo 12%
- Financiamiento 12–180 meses
- Mensualidades desde $3,300 MXN
- Primeros 84 meses sin interés, según la información comercial proporcionada

## CTA y evaluación
Todos los CTA principales abren la misma evaluación de 5 preguntas. La evaluación usa una combinación de respuestas con umbral comercial: 2 o más criterios compatibles sobre 5 = perfil compatible. La lógica divide exactamente el espacio de 1,024 combinaciones en 75% compatibles y 25% alternativas; no implica que 75% de los visitantes reales vaya a calificar.

Perfil compatible → booking / webinar.
Perfil alternativo → formulario de nombre, WhatsApp, correo, presupuesto e interés.

## Video
https://youtu.be/GN3wHvDtAbM

## Admin
`/admin.html` genera un `config.js` con booking, webinar, lead endpoint y Meta Pixel para reemplazar `js/config.js` en GitHub.

## Cloudflare
Root `/` · Build vacío · Deploy `npx wrangler deploy`. Workers Static Assets sirven la landing completa.
