# Luca Pagano Portfolio

Portfolio personale statico costruito con React, TypeScript e Vite.

## Stack

- React + TypeScript + Vite
- Motion per microinterazioni UI
- GSAP + ScrollTrigger per scroll reveal
- React Three Fiber / Three.js per una hero 3D leggera e lazy-loaded
- CSS custom responsive, dark premium, prefers-reduced-motion aware

## Comandi

```bash
npm install
npm run dev
npm run build
npm run lint
```

## GitHub Pages

Il progetto usa `base: './'` in `vite.config.ts`, quindi la build funziona anche sotto il path di un repository GitHub Pages.

Per deploy manuale:

1. Esegui `npm run build`.
2. Pubblica il contenuto di `dist/` su GitHub Pages.

Per deploy con GitHub Actions, crea un workflow Pages nel repository che esegua `npm ci`, `npm run build` e carichi `dist/` come artifact statico.
