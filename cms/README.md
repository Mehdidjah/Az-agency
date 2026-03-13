# Agency Travel CMS (Payload)

The CMS is powered by [Payload](https://payloadcms.com/) v3 and runs as a separate Next.js app inside the `cms/` folder.

## Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally or on Atlas

## Quick Start

```bash
# 1. Install dependencies
cd cms
pnpm install        # or npm install

# 2. Create .env (copy from .env.example and adjust)
cp .env.example .env

# 3. Start the CMS in dev mode (runs on port 3001)
pnpm dev

# 4. Seed the database with the existing static data
pnpm seed

# 5. Open the admin panel
#    http://localhost:3001/admin
#    Login: admin@agencytravel.com / admin123
```

## Collections

| Collection      | Description                                   |
| --------------- | --------------------------------------------- |
| `users`         | Admin & editor accounts                       |
| `media`         | Uploaded images & videos                      |
| `offers`        | Travel offers (listing + detail page data)    |
| `destinations`  | Destination cards (homepage section)          |
| `hotels`        | Hotels linked to offers                       |
| `testimonials`  | Customer testimonials (text & video)          |
| `faqs`          | Frequently asked questions                    |
| `features`      | Feature pills (booking section marquee)       |
| `booking-steps` | Step cards (booking process section)          |

## Frontend Integration

The React frontend fetches data through the Payload REST API:

```
GET http://localhost:3001/api/offers         → list all offers
GET http://localhost:3001/api/offers/{id}     → single offer (with depth=2 for hotels)
GET http://localhost:3001/api/destinations    → list destinations
GET http://localhost:3001/api/testimonials    → list testimonials
GET http://localhost:3001/api/faqs            → list FAQs
GET http://localhost:3001/api/features        → list features
GET http://localhost:3001/api/booking-steps   → list steps
```

The frontend uses `VITE_CMS_URL` (in the root `.env`) to locate the CMS.

## Architecture

```
agency-travel/
├── client/          ← React SPA (Vite)
│   ├── hooks/       ← useOffers, useOffer, useDestinations, useFAQs, …
│   └── lib/payload.ts ← generic CMS fetch helpers
├── cms/             ← Payload CMS (this folder)
│   ├── src/
│   │   ├── collections/   ← Payload collection configs
│   │   ├── payload.config.ts
│   │   └── seed.ts        ← populates DB from old static data
│   └── package.json
├── server/          ← Express API (unchanged)
└── shared/          ← Shared types
```

## Notes

- Each frontend component keeps a **static fallback** array: if the CMS is unreachable the UI still renders with demo data.
- Image fields support both **Payload uploads** (via `media` collection) and plain **URL strings** (`imageUrl` / `mainImageUrl`) for backward compatibility with the `public/assets/figma/` images.
- The seed script creates an admin user, all offers, destinations, hotels, testimonials, FAQs, features and booking steps in one go.
