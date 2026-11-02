# POKIZA — official contacts

Next.js App Router, TypeScript, Tailwind CSS and Framer Motion. Static export, no server secrets or accounts required.

## Run

`npm ci`, then `npm run dev`. Production: `npm run build`; serve `out/`.

## Content

- `components/locale.ts`: full RU / TG / EN dictionaries; Russian is the first-visit default.
- `site-config.ts`: five official contact channels.
- `public/pokiza-logo.png`: original logo supplied in the project archive.
- `public/hero.webp`: optimized illustrative stock photo, not a photograph of a POKIZA facility.

Language is stored under `pokiza-locale`; inaccessible storage safely falls back to Russian. All external social links are user-triggered and use noopener/noreferrer. Motion respects reduced-motion preferences.

No vacancy listings or application forms are simulated: the career buttons open the supplied recruitment channels.
