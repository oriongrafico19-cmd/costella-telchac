# Costella · Landing V2

Landing single-page para Costella Telchac Residencial.

## Estructura
- `index.html` — landing pública.
- `admin.html` — panel de edición V2 (prototipo local).
- `css/style.css` — identidad visual, responsive, lightbox, CTAs y componentes.
- `js/config.js` — configuración de Calendar, WhatsApp, leads, Meta Pixel y YouTube.
- `js/main.js` — navegación, modal de leads, lightbox, YouTube, WhatsApp y lectura de configuración.
- `assets/brochure/` — visuales derivados del brochure proporcionado.

## V2 incluye
- CTAs grandes distribuidos después de las secciones.
- Sin CTA de agenda en el header.
- Botón flotante de WhatsApp.
- Lightbox: las imágenes de contenido se pueden abrir a pantalla completa.
- Video mediante URL de YouTube; no se suben archivos MP4.
- Panel `admin.html` para editar contenido/datos y exportar JSON.

## Importante sobre el administrador
Esta versión guarda la configuración en `localStorage` para probar la experiencia de edición sin backend. Para producción, el siguiente paso es conectar el panel a un backend seguro con Cloudflare D1/R2 y proteger `admin.html` con autenticación/Cloudflare Access. Así los cambios serán globales para todos los visitantes.

## Deploy
El proyecto es estático. Si se publica como Worker con Wrangler, sirve el `index.html` desde la raíz. Si se usa Cloudflare Pages, el directorio raíz es `/` y no requiere comando de build.
