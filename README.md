# Costella Telchac Residencial · V16

Landing editorial/coastal para Costella Telchac Residencial.

## Dirección visual

- Editorial arquitectónica inspirada en la referencia de Vértice, sin copiarla.
- Costa + noche: azul profundo, arena, verde selva y luz cálida.
- Retícula de contenido controlada, tipografía serif para titulares y sans para interfaz.
- Imágenes de día para territorio/planeación y noche para experiencia/Club Stella.
- Master Plan y Top Master Plan integrados como piezas visuales principales.

## Conversión

Todos los CTA principales abren el formulario de evaluación. La landing no muestra el formulario de forma permanente.

Flujo:

Landing → 5 preguntas → clasificación → booking/webinar o captura de alternativa.

## Configuración

Editar `js/config.js` para añadir:

- bookingUrl
- webinarUrl
- leadEndpoint
- Meta Pixel
- cupo de webinar

`admin.html` permite preparar estas variables y descargar un `config.js` listo para reemplazo.

## Cloudflare

Workers Static Assets:

```text
Root directory: /
Build command: [vacío]
Deploy command: npx wrangler deploy
Branch: main
```

No existe `site/` y no existe `ai/` en esta versión.

## Datos comerciales incorporados

- 19 hectáreas
- 533 lotes
- 200–350 m²
- 5 etapas
- Apartado $5,000 MXN
- Enganche mínimo 12%
- Financiamiento 12–180 meses
- Mensualidades desde $3,300 MXN
- Más de 50 amenidades en Capella Core, Tau Core, Club Stella y Ara Wellness Center
- Entregas por etapa: 2029, 2030, 2031 y etapas 4/5 próximamente, sujetas a comercialización
