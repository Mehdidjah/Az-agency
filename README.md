# Az Agency Monorepo

This repository contains:

- `agency-travel/`: the Vite frontend that should be deployed to Vercel
- `cms/`: the Payload CMS that serves content to the frontend

## Deploy the frontend to Vercel

When importing this repository into Vercel, set the project Root Directory to `agency-travel`.

Use these settings:

- Framework Preset: `Vite`
- Build Command: `npm run build:client`
- Output Directory: `dist/spa`

Environment variables for the Vercel frontend:

- `VITE_CMS_URL`: public URL of the deployed CMS API
- `CMS_URL`: server-side CMS URL used by `/api/reservation`
- `RESEND_API_KEY`: optional, enables `/api/custom-trip` email sending
- `RESEND_FROM_EMAIL`: optional sender address for trip emails
- `TRIP_RECIPIENT_EMAIL`: optional recipient address for trip emails
- `PING_MESSAGE`: optional `/api/ping` response message
- `VITE_API_URL`: leave empty on Vercel so the frontend uses the same-domain `/api/*` functions

## CMS CORS

The CMS must allow the Vercel frontend origin. Set one of these env vars on the CMS deployment:

- `FRONTEND_URL=https://your-vercel-domain.vercel.app`
- `CORS_ORIGINS=https://your-vercel-domain.vercel.app,https://www.your-domain.com`

## Local development

Frontend:

```bash
cd agency-travel
npm install
npm run dev
```

CMS:

```bash
cd cms
npm install
cp .env.example .env
npm run dev
```
