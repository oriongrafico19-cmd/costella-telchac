# Costella · Landing V6

Landing single-page para Costella Telchac Residencial.

## Estructura

- `index.html` — landing pública.
- `admin.html` — panel de edición local.
- `css/style.css` — identidad visual, responsive, lightbox, CTAs y componentes.
- `js/config.js` — configuración de booking, IA, leads, Meta Pixel y YouTube.
- `js/main.js` — navegación, CTAs, lightbox, IA y lectura de configuración.
- `assets/brand/` — identidad visual de Costella.
- `assets/renders/day/` — renders diurnos.
- `assets/renders/night/` — renders nocturnos.

## Dirección creativa

- Aspiracional, pero sin lenguaje inmobiliario genérico.
- Narrativa centrada en territorio, criterio, oportunidad, privacidad, planeación y certeza.
- CTAs orientados a conversación y booking, no a "Más información".
- Renders separados entre día y noche para respetar la intención visual.
- Master Plan preparado para sustituir la imagen temporal sin rediseñar la interfaz.
- Paleta principal basada en el Brandbook:
  - Azul/Constelación `#1D3E56`
  - Verde/Selva Nocturna `#434B32`
  - Gris/Marea Profunda `#1D1D1D`
  - Beige/Luz de Arena `#F1EED6`
- Tipografía preparada para Guaruja Neue y Lora. Si posteriormente se incorporan los archivos licenciados de Guaruja Neue, solo habrá que cargarlos sin rediseñar la interfaz.

## Conversión

Flujo previsto:

Meta Ads → Landing → contenido/criterio → CTA → booking del asesor → videollamada.

Los botones principales están preparados para abrir un enlace externo de booking del asesor en una nueva pestaña.

### Configurar booking

En:

`site/js/config.js`

configura:

```js
bookingUrl: 'PEGA_AQUI_EL_BOOKING_DEL_ASESOR'
