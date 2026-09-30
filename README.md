# Costella Telchac Residencial · V10 FINAL

Landing single-page lista para un repositorio nuevo de GitHub y un Worker de Cloudflare independiente.

## Funnel
Meta Ads → Landing → CTA único → evaluación de 5 preguntas → resultado → videollamada/webinar o captura alternativa.

El formulario no aparece en la landing de forma permanente. Se abre al pulsar cualquier CTA principal.

## CTA único
Todos los CTAs principales utilizan: `DESCUBRE SI TU PERFIL ES COMPATIBLE CON COSTELLA`.

## Datos de Costella incorporados desde la documentación
- Telchac Pueblo, Yucatán.
- 19 hectáreas.
- 533 lotes residenciales.
- 200–350 m² por lote.
- 5 etapas.
- Apartado: $5,000 MXN.
- Enganche mínimo: 12%.
- Financiamiento: 12–180 meses; primeros 84 meses sin interés según la documentación.
- Mensualidades: desde $3,300 MXN.
- Entregas por etapa: 1 en 2029, 2 en 2030, 3 en 2031; 4 y 5 próximamente según comercialización.
- Más de 50 amenidades distribuidas en cuatro núcleos.

## Amenidades por etapa
### Etapa 2 · Capella Core
Mixed Park, Kids Park, Pet Park, Movie Park, Ciclopista.

### Etapa 3 · Tau Core
Mixed Park, Wet Park, Pet Park, Zen Garden, Ciclopista.

### Etapa 4 · Club Stella
Restaurante, Kids Park, Juice Bar/Coffee Station, Bar, Muelle, Mirador, Cuerpo de agua, Grill, Ciclopista. Ojo de agua aproximado: 2,330 m².

### Etapa 5 · Ara Wellness Center
Mini Golf, Gym, Tennis, Pádel, 2 cajones de bateo, Spa Zen (vapor, sauna, jacuzzi, masajes), Voleibol, Canal de Nado y Alberca, Ciclopista.

## Club de playa
Se incluye una sección de acceso a club de playa como beneficio, con la nota de confirmar condiciones vigentes. El Brandbook contempla la variante de marca “Costella Beach Club” para el club de playa.

## Video
https://youtu.be/GN3wHvDtAbM

## Evaluación 75 / 25
4 opciones por pregunta durante 5 preguntas = 1,024 combinaciones. El umbral de 2 respuestas compatibles produce 768 combinaciones compatibles (75%) y 256 alternativas (25%). Es una proporción matemática de combinaciones, no una predicción de conversión real.

## Configuración
Editar `js/config.js` para `bookingUrl`, `leadEndpoint`, `webinarUrl` y `metaPixelId`. La escasez del webinar está desactivada hasta confirmar un cupo real.

## Cloudflare
- Directorio raíz: `/`
- Build command: ninguno
- Deploy command: `npx wrangler deploy`
- El `wrangler.toml` está en la raíz.
- Esta versión no necesita Gemini.

## Estructura
```text
assets/
  brand/
  renders/day/
  renders/night/
css/style.css
js/config.js
js/main.js
index.html
worker.js
wrangler.toml
README.md
```

Las imágenes son ilustrativas y referenciales; disponibilidad y condiciones deben confirmarse con el asesor.
