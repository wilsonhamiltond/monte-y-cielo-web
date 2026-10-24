# Home Alquiler

Rental website for 2 apartments and 1 house, with WhatsApp booking, in Spanish, English and French, plus an admin panel to upload and manage the photos.

Built with Next.js 16 (App Router, React Server Components, server-side rendering) and TypeScript.

## Features

- **Public site** at `/es`, `/en`, `/fr`. Visiting `/` redirects to the visitor's saved language, then their browser language, then Spanish.
- Property cards, a detail view with a photo gallery (arrows, thumbnails, keyboard, swipe) and **"Reservar aquí"** buttons that open WhatsApp with a message in the visitor's language.
- **Admin panel** at `/admin`, protected by a password:
  - upload several photos at once (click or drag and drop), JPG / PNG / WebP up to 15 MB each
  - reorder photos, choose the cover (the first photo), delete photos
  - photos are auto-rotated, resized (max 2000 px, plus a 600 px thumbnail), converted to WebP and stripped of metadata (including GPS)
- Pages are cached and refreshed the moment photos change in the admin.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

| Variable | Description |
| --- | --- |
| `ADMIN_PASSWORD` | Password for `/admin`. |
| `SESSION_SECRET` | 32+ random characters used to sign the admin session. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`. |
| `WHATSAPP_NUMBER` | Country code + number, digits only (e.g. `573001234567`). |
| `STORAGE_DIR` | Folder for uploaded photos (`./storage` by default). |

## Editing content

- Property texts in the three languages, guests, bedrooms, bathrooms, prices and amenities live in `src/content/properties.ts`.
- Interface texts live in `src/i18n/dictionaries.ts`.
- Brand name and location live in `src/content/site.ts`.

## Project structure

```
src/
  proxy.ts                    language redirect (Next 16 "proxy", formerly middleware)
  app/[lang]/                 public site (one root layout per language)
  app/admin/                  admin panel, login and server actions
  app/api/admin/photos/       photo upload endpoint (one file per request)
  app/uploads/[...path]/      serves uploaded photos
  components/                 gallery and admin client components
  lib/photos.ts               photo storage on disk (index + WebP files)
  lib/auth.ts                 password check and signed session cookie
```

## Deployment

Production runs at **www.monteycieloapartments.com**. Every push to `main` deploys through GitHub Actions (`.github/workflows/deploy.yml`) to a server running `next start` behind nginx. Server setup, secrets and rollback are in [`deploy/README.md`](deploy/README.md).

Uploaded photos are stored **on the server's disk**, so the app needs a Node.js host with a **persistent disk**:

- a VPS (Hostinger VPS, DigitalOcean, Lightsail…) with `npm run build && npm start` behind Nginx or Caddy, or
- Railway / Render / Fly.io with a persistent volume mounted at `STORAGE_DIR`.

Serverless hosts (Vercel, Netlify) and static hosting don't keep uploaded files between deployments. Using them would mean moving photo storage to S3, Cloudflare R2 or Vercel Blob (only `src/lib/photos.ts` would change).

Back up `STORAGE_DIR`: it holds every uploaded photo and their order (`photos.json`). Run a single app instance, because writes to `photos.json` are serialized in memory.
