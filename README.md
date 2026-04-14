# Bandbnb 4.1

Bandbnb is a two-sided live music marketplace built with Next.js. This repo now covers three delivery modes from one codebase:
- production website
- installable browser app (PWA)
- native iOS / Android wrapper path through Capacitor

## Included in this version
- Supabase Postgres-ready Prisma schema
- Session authentication with `CUSTOMER`, `BAND`, and `ADMIN` roles
- Supabase Storage upload path for band media
- Band Studio for editing listing content and availability
- Booking requests with conflict checks
- Real messages and conversation threads
- Stripe deposit checkout plus webhook updates
- PWA manifest, service worker, offline page, install experience
- Capacitor config for iOS and Android packaging
- Vercel-ready repo structure and deployment checklist

## Recommended stack in production
- Frontend and server routes: Vercel
- Database and storage: Supabase
- Payments: Stripe
- Native packaging: Capacitor + Xcode / Android Studio

## Quick start
```bash
cp .env.example .env.local
npm install
npm run db:push
npm run db:seed
npm run dev
```

Demo accounts after seeding:
- Customer: `customer@bandbnb.com` / `demo12345`
- Band: `band@bandbnb.com` / `demo12345`

## Environment variables
Copy `.env.example` to `.env.local` for local development.

Required values:
- `DATABASE_URL`
- `DIRECT_URL`
- `SESSION_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Commands
```bash
npm run dev
npm run build
npm run start
npm run db:push
npm run db:seed
npm run db:generate
npm run db:migrate:deploy
npm run db:studio
npm run lint:types
npm run cap:sync
npm run cap:open:ios
npm run cap:open:android
```

## Deploy to Vercel
1. Push this repo to GitHub
2. Import it into Vercel as a Next.js project
3. Add all environment variables from `.env.example`
4. Set `NEXT_PUBLIC_APP_URL` to the deployed public URL
5. Deploy and verify `/api/health`

A longer production checklist is in [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md).

## Supabase setup
1. Create a Supabase project
2. Copy the Postgres connection string into `DATABASE_URL`
3. Copy the direct connection string into `DIRECT_URL`
4. Create a public storage bucket such as `band-media`
5. Add your Supabase URL, anon key, and service role key to env vars

## Stripe setup
1. Create a Stripe account
2. Add `STRIPE_SECRET_KEY`
3. Point a webhook to `/api/stripe/webhook`
4. Add the webhook signing secret as `STRIPE_WEBHOOK_SECRET`

Example local forwarding:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## PWA notes
Included now:
- app manifest
- service worker
- offline page
- install prompt support
- Apple web app metadata

Before launch, replace placeholder icons and screenshots with your final branded assets.

## Native iOS / Android notes
This repo uses a remote hosted app strategy with Capacitor. The native shell points to your deployed site URL through `NEXT_PUBLIC_APP_URL`.

Basic flow:
```bash
npx cap add ios
npx cap add android
npm run cap:sync
npm run cap:open:ios
npm run cap:open:android
```

Detailed submission preparation steps are in [`mobile/README.md`](./mobile/README.md).

## What still exists outside code
This repo now gives you a strong launch-ready MVP foundation, but successful public release still requires operational work:
- branded assets
- legal review of terms and privacy text
- production environment setup
- device QA
- Apple / Google developer accounts
- store listing assets and forms

## Suggested next priorities after launch
- email verification and reset password
- reviews and ratings
- admin moderation panel
- payouts to bands via Stripe Connect
- refunds tooling
- analytics and SEO
- rate limiting and abuse protection
# Bandbnb
