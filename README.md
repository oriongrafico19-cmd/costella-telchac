# Costella Telchac Residencial · V12

Landing editorial/cinematográfica con identidad Costella, renders separados día/noche y funnel de evaluación de 5 preguntas.

## Estructura

```text
assets/
  brand/
  renders/
    day/
    night/
css/
  style.css
js/
  config.js
  main.js
index.html
admin.html
wrangler.toml
.assetsignore
README.md
```

## Imágenes de Master Plan

Se incluyen explícitamente las dos piezas proporcionadas por el proyecto:

- `assets/renders/day/top-master-plan.webp` — Top Master Plan para la sección de territorio.
- `assets/renders/day/master-plan-detail.webp` — Master Plan detallado para etapas y núcleos de amenidades.

Ambas fueron convertidas a WebP desde los PNG proporcionados para mejorar compatibilidad y peso.

## CTA y funnel

Todos los CTA principales utilizan el mismo concepto:

**Conoce si tu perfil es compatible con Costella**

Al hacer clic se abre el formulario en modal; no aparece como bloque visible permanente en la landing.

La evaluación tiene 5 preguntas de opción múltiple. La clasificación comercial se calcula con la combinación de respuestas:

- 2 o más respuestas compatibles → compatible con Costella.
- 0 o 1 → alternativa / otro proyecto.

Con 4 opciones por pregunta, esto divide el espacio matemático de 1,024 combinaciones en 768 (75%) compatibles y 256 (25%) alternativas. Esto no garantiza que 75% de los visitantes reales califiquen.

### Compatible

El siguiente paso se habilita según la respuesta elegida:
- videollamada / booking
- webinar

### Alternativa

Se muestra un segundo formulario con nombre + WhatsApp para captar lo que busca el prospecto.

## Configuración de enlaces

Entra a `/admin.html` en el mismo Worker para preparar:

- Booking / calendario del asesor
- Webinar
- Lead endpoint
- Cupo del webinar
- Video de YouTube
- Referencia de enganche

El panel guarda cambios en el navegador para pruebas y permite descargar `config.js`. Para publicar un cambio para todos, reemplaza `js/config.js` en GitHub y deja que Cloudflare haga un nuevo despliegue.

## Datos comerciales utilizados

Los textos del sitio están basados en la documentación entregada para Costella:

- 19 hectáreas
- 533 lotes residenciales
- lotes de 200 a 350 m²
- 5 etapas
- apartado de $5,000 MXN
- enganche mínimo de 12%
- financiamiento de 12 a 180 meses
- referencia comercial de mensualidades desde $3,300 MXN
- Etapa 1: 2029
- Etapa 2: 2030
- Etapa 3: 2031
- Etapas 4 y 5: próximamente
- más de 50 amenidades distribuidas en Capella Core, Tau Core, Club Stella y Ara Wellness Center

Las condiciones y disponibilidad deben confirmarse con el asesor.

## Amenidades

### Capella Core · Etapa 2
Mixed Park, Kids Park, Pet Park, Movie Park, Ciclopista.

### Tau Core · Etapa 3
Mixed Park, Wet Park, Pet Park, Zen Garden, Ciclopista.

### Club Stella · Etapa 4
Restaurante, Kids Park, Juice Bar/Coffee Station, Bar, Muelle, Mirador, cuerpo de agua, Grill y Ciclopista.

### Ara Wellness Center · Etapa 5
Mini Golf, Gym, Tennis, Pádel, 2 cajones de bateo, Spa Zen, Volleyball, Canal de Nado y Alberca, Ciclopista.

## Video

YouTube:
https://youtu.be/GN3wHvDtAbM

## Cloudflare

Este proyecto es estático y está pensado para Workers Static Assets.

```text
Root directory: /
Build command: [vacío]
Deploy command: npx wrangler deploy
Branch: main
```

No necesita `GEMINI_API_KEY`.
