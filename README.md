# Costella Telchac Residencial · V11

Landing editorial/cinematográfica para Costella Telchac Residencial.

## Estructura de despliegue

Este es un sitio estático de una sola raíz. No usa `site/`, no usa un Worker runtime y no requiere Gemini.

```text
assets/
css/
js/
index.html
admin.html
wrangler.toml
README.md
```

## Imágenes especiales

- `assets/renders/day/top-master-plan.webp` — Top Master Plan utilizado en la primera sección territorial.
- `assets/renders/day/master-plan-final.webp` — Master Plan detallado con etapas y núcleos de amenidades.

## Administración de enlaces

Abre `/admin.html` en el mismo dominio. Desde ahí puedes preparar: booking del asesor, webinar, lead endpoint y video.

El panel guarda cambios localmente para pruebas y permite descargar un `config.js`. Para publicar cambios a todos los visitantes: descarga el archivo y reemplaza `js/config.js` en GitHub.

## Cloudflare

Usa Workers Static Assets:

- Root directory: `/`
- Build command: vacío
- Deploy command: `npx wrangler deploy`
- Branch: `main`

No agregues `GEMINI_API_KEY`.

## Funnel

Todos los CTA principales abren una evaluación de 5 preguntas. La combinación de respuestas determina el resultado comercial:

- 768 de 1,024 combinaciones = 75% compatibles
- 256 de 1,024 combinaciones = 25% alternativa

Perfil compatible → booking/webinar.

Perfil alternativo → formulario corto de nombre + WhatsApp.

## Datos comerciales destacados

La página usa datos proporcionados en la documentación de Costella: 19 ha, 533 lotes, terrenos de 200–350 m², 5 etapas, apartado de $5,000 MXN, enganche mínimo de 12%, financiamiento de 12–180 meses y mensualidades desde $3,300 MXN, sujetos a condiciones vigentes.

Etapas: 1 (2029), 2 (2030), 3 (2031), 4 y 5 próximamente.

Amenidades: Capella Core (Etapa 2), Tau Core (Etapa 3), Club Stella (Etapa 4) y Ara Wellness Center (Etapa 5).

## Video

https://youtu.be/GN3wHvDtAbM
