# Costella Telchac · V14 Editorial

Landing estática editorial inspirada en la lógica de sitios institucionales de arquitectura: grid asimétrico, tipografía protagonista, bloques de imagen grandes, cifras como sistema visual y alternancia entre crema, azul profundo y noche.

No copia el sitio de referencia. La dirección se adapta al Brandbook y al contenido de Costella.

## Contenido
- 19 ha
- 533 lotes residenciales
- 200–350 m²
- 5 etapas
- Capella Core · Etapa 2
- Tau Core · Etapa 3
- Club Stella · Etapa 4
- Ara Wellness Center · Etapa 5
- Apartado $5,000 MXN
- Enganche mínimo 12%
- Financiamiento 12–180 meses
- Mensualidades desde $3,300 MXN
- Primeros 84 meses sin interés, según información comercial disponible
- Video YouTube: https://youtu.be/GN3wHvDtAbM

## Imágenes
Los originales se normalizan a WebP para asegurar carga consistente en navegador y Cloudflare Static Assets. Se conservan separadas las vistas de día y noche.

## CTA / evaluación
Todos los CTA principales usan el mismo texto:
“Descubre si tu perfil es compatible”

El formulario aparece solamente cuando el visitante pulsa un CTA.

La evaluación contiene 5 preguntas. 2 o más criterios compatibles producen un resultado compatible; la estructura de criterios divide matemáticamente 1,024 combinaciones en 75% compatibles y 25% alternativas. Esto es una distribución de combinaciones, no una predicción del comportamiento real de los visitantes.

Compatible → booking/webinar.
Alternativa → formulario con nombre, WhatsApp, correo, presupuesto e interés.

## Configuración
Editar `js/config.js` o usar `/admin.html` para generar un archivo `config.js`.

## Cloudflare
Root directory: `/`
Build: vacío
Deploy: `npx wrangler deploy`

Workers Static Assets sirven todo el sitio desde la raíz.
