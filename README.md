# Everyday FODMAP 🌿

Figure out your stomach triggers. Find food you can eat.

A mobile-first web app for people with IBS and sensitive stomachs, built around
the low-FODMAP diet — the best-evidenced dietary treatment for IBS (symptom
relief in 50–86% of people, per Monash University research).

## Features

- **🧪 Symptom Triage** — a 3-step questionnaire that matches your symptoms and
  trigger foods against the five FODMAP subgroups (Lactose, Fructans, GOS,
  Fructose, Polyols) and sets personalized scanner filters. Red-flag symptoms
  (weight loss, blood, fever…) short-circuit to a "see a doctor" recommendation.
- **📱 Smart Scanner** — scan a product barcode with your camera (or type it) and
  the app looks it up in the **Open Food Facts** database, auto-fills the
  ingredient list, and gives an instant green / yellow / red verdict against
  your personal FODMAP profile. Manual ingredient entry also works.
- **🔄 Smart Swaps** — every flagged ingredient comes with 2–4 low-FODMAP
  alternatives (with brand suggestions and DIY tips) from a curated swap
  database covering ~28 common trigger ingredients.
- **🕘 Scan History** — past scans persist in the browser (localStorage), with
  expandable verdict details. Profile and triage results survive reloads too.
- **👨‍⚕️ Find a Pro** — links to official dietitian directories (Monash FODMAP,
  Academy of Nutrition & Dietetics, Dietitians Australia/UK/Canada, ZocDoc)
  plus well-known telehealth FODMAP specialists.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · wouter · @zxing/browser
(barcode scanning) · sonner (toasts) · lucide-react (icons)

No backend required — the app is fully static. Product lookups call the free
Open Food Facts API directly from the browser. All user data stays in the
user's own browser via localStorage.

## Development

```bash
npm install
npm run dev        # dev server (Vite)
npm run typecheck  # tsc --noEmit
npm run build      # production build → dist/
```

## Deployment

Build output is plain static files — host anywhere (Hostinger, Netlify, GitHub
Pages, S3…). For Apache hosts, add an `.htaccess` SPA rewrite so client-side
routes like `/scanner` don't 404 on refresh:

```apache
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^ index.html [L]
```

Note: the camera barcode scanner requires **HTTPS** (browser security
requirement for camera access).

## Disclaimer

This is an educational tool, not medical advice. The ingredient database is
curated but not the Monash-certified dataset, and FODMAP tolerance is
dose-dependent — this app does not do portion math. Always confirm with a
registered dietitian or doctor.
