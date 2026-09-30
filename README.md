# Costella Telchac Residencial · V10 Static

Pure static landing for Cloudflare Workers Static Assets.

## Repository root

Upload the contents of this folder directly to the GitHub repository root:

```text
assets/
css/
js/
index.html
wrangler.toml
README.md
```

There is intentionally no `site/` folder and no `worker.js`.

## Cloudflare Workers

Use Workers Static Assets (recommended by Cloudflare for new static sites).

Configuration:

```text
Root directory: /
Build command:   [empty]
Deploy command:  npx wrangler deploy
Branch:          main
```

The `wrangler.toml` points `assets.directory` to the repository root.

Do not add `GEMINI_API_KEY` or any other runtime secret for this static Worker.

## Booking / webinar

Edit `js/config.js`:

```js
const COSTELLA_CONFIG = {
  bookingUrl: '',
  leadEndpoint: '',
  webinarUrl: '',
  webinarSlots: 10,
  showWebinarScarcity: false,
  metaPixelId: '',
  qualificationReferenceDownPayment: 80000
};
```

## Qualification funnel

Every main CTA opens the five-question qualification modal.

The result determines the next step:

- Compatible profile → booking and/or webinar.
- Alternative profile → short data-capture form for another project.

The qualification itself is an initial commercial filter, not a contractual or financial approval.

## Video

YouTube:
https://youtu.be/GN3wHvDtAbM
