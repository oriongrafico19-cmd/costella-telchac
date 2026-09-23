# Costella AI — paquete inicial

Este paquete prepara el asistente virtual de Costella para ejecutarse detrás de un Cloudflare Worker y utilizar Gemini sin exponer la API key en el navegador.

## Qué contiene

- `knowledge/costella-knowledge.md` — base de conocimiento y reglas de comportamiento.
- `knowledge/costella-faq.json` — preguntas frecuentes estructuradas.
- `worker/index.js` — endpoint inicial del Worker.
- `worker/wrangler.toml` — configuración de Cloudflare Worker.
- `worker/.dev.vars.example` — ejemplo para desarrollo local; no contiene una clave real.

## Seguridad de la API key

NO pongas la clave de Gemini dentro de `index.html`, `js/main.js`, `js/config.js`, GitHub ni `wrangler.toml`.

Cloudflare recomienda utilizar Secrets para valores sensibles como API keys. El Worker los recibe mediante `env`. Para producción:

```bash
cd ai/worker
npx wrangler secret put GEMINI_API_KEY
```

Wrangler solicitará la clave de forma interactiva.

Para desarrollo local:

1. Copia `.dev.vars.example` como `.dev.vars`.
2. Pon tu clave real en `.dev.vars`.
3. No subas `.dev.vars` a GitHub.

## Modelo

El Worker usa `gemini-3.8-flash` como valor inicial. El modelo puede cambiarse en `index.js` sin tocar la landing.

## Siguiente integración

La landing debe llamar al Worker mediante una URL como:

`https://costella-ai.<tu-subdominio>.workers.dev/chat`

Después se puede conectar:

1. chat UI de Costella;
2. captura de lead;
3. herramienta `agendar_cita`;
4. Google Calendar / Meet;
5. Cloudflare D1 para conversaciones y leads;
6. panel de administración para actualizar conocimiento y condiciones.
