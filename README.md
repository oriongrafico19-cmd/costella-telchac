# Costella Landing V6 — Final

Landing de Costella Telchac Residencial replanteada con base en el Brandbook y en la estrategia conversacional definida para campaña.

## Dirección creativa
- Aspiracional, pero sin lenguaje inmobiliario genérico.
- Narrativa centrada en territorio, criterio, oportunidad, privacidad, planeación y certeza.
- CTA orientados a conversación/booking, no a "Más información".
- Renders separados entre `day/` y `night/` para respetar la intención visual.
- Master Plan preparado para sustituir la imagen temporal sin cambiar la estructura.
- Paleta principal basada en el Brandbook: Azul/Constelación `#1D3E56`, Verde/Selva Nocturna `#434B32`, Gris/Marea Profunda `#1D1D1D`, Beige/Luz de Arena `#F1EED6`.
- Tipografía preparada para `Guaruja Neue` y `Lora`; si los archivos licenciados de Guaruja Neue se incorporan posteriormente, solo hay que cargarlos sin rediseñar la interfaz.

## Conversión
Flujo previsto:

**Meta Ads → Landing → contenido/criterio → CTA → booking del asesor → videollamada**

Los botones `.js-book` ya están preparados para abrir el enlace externo del asesor en una nueva pestaña.

### Configurar booking
En `site/js/config.js`:

```js
bookingUrl: 'PEGA_AQUI_EL_BOOKING_DEL_ASESOR'
```

También puede configurarse desde `site/admin.html` y guardarse en el navegador.

## IA
El chat opcional de primera conversación apunta al Worker:

`https://costella-ai.orion-grafico19.workers.dev/chat`

La API Key de Gemini **no está en el frontend**. Debe permanecer como Secret de Cloudflare (`GEMINI_API_KEY`).

Antes de producción, configura `ALLOWED_ORIGIN` en el Worker con el dominio real de la landing.

## Imágenes
Las imágenes diurnas fueron convertidas a WebP para reducir el peso de la landing. Las versiones nocturnas ya se mantienen como WebP.

Esto deja el paquete aproximadamente en 21 MB, frente al paquete anterior de gran tamaño por renders originales.

## Estructura
- `site/index.html` — landing pública.
- `site/admin.html` — configuración local de copy, booking, IA, tracking y rutas de imágenes.
- `site/css/style.css` — sistema visual responsive.
- `site/js/config.js` — endpoints y booking.
- `site/js/main.js` — interacciones, booking, lightbox, IA y animaciones.
- `site/assets/renders/day/` — renders diurnos.
- `site/assets/renders/night/` — renders nocturnos.
- `ai/worker/` — Worker de Cloudflare para Gemini.
- `ai/knowledge/` — conocimiento y prompt de Costella.

## Antes de publicar
1. Pegar el booking real del asesor.
2. Sustituir el Master Plan temporal por el archivo definitivo cuando esté disponible.
3. Verificar precios, disponibilidad y condiciones comerciales vigentes.
4. Configurar `ALLOWED_ORIGIN` en Cloudflare.
5. Probar todos los CTA en móvil y desktop.
6. Configurar Meta Pixel si corresponde.
