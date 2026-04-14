# Bandbnb deployment and launch checklist

This file is the shortest path from local code to a public production launch.

## 1) Local preflight
- Copy `.env.example` to `.env.local`
- Run `npm install`
- Run `npm run db:push`
- Run `npm run db:seed`
- Run `npm run lint:types`
- Run `npm run build`
- Confirm these pages work locally: `/`, `/login`, `/register`, `/dashboard`, `/messages`, `/bookings`, `/band/studio`, `/privacy`, `/terms`, `/refunds`
- Confirm uploads work against your Supabase bucket
- Confirm Stripe checkout opens and webhook marks payment as paid

## 2) Supabase production setup
- Create a production Supabase project
- Copy the Postgres transaction connection string into `DATABASE_URL`
- Copy the direct connection string into `DIRECT_URL`
- Create a public Storage bucket named `band-media` or match `SUPABASE_STORAGE_BUCKET`
- Add a storage policy that allows read access for public assets and authenticated write access through your server flow
- In SQL editor, verify your tables exist after migration or `db push`
- Rotate and safely store the service role key

## 3) Stripe production setup
- Create a Stripe product environment
- Replace test keys with live keys when you are ready
- Add a webhook endpoint pointing to `https://YOUR_DOMAIN/api/stripe/webhook`
- Subscribe at minimum to:
  - `checkout.session.completed`
  - `checkout.session.expired`
- Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`
- Run a real end-to-end deposit payment test before launch

## 4) Vercel deployment
- Push this repo to GitHub
- In Vercel, import the GitHub repo
- Framework preset should auto-detect as Next.js
- Add all environment variables from `.env.example`
- Set `NEXT_PUBLIC_APP_URL` to your final public domain, for example `https://app.bandbnb.com`
- Deploy
- After deploy, open `/api/health` and confirm it returns `{ ok: true }`
- Open the site and re-test auth, uploads, bookings, and payments

## 5) DNS and domain
- Connect your custom domain in Vercel
- Wait for SSL to become active
- Update Stripe allowed return URLs if needed
- Update `NEXT_PUBLIC_APP_URL` in Vercel to the custom domain and redeploy

## 6) PWA release readiness
- Test install prompt in Chrome on Android and desktop
- Test Add to Home Screen in Safari on iPhone
- Confirm offline page appears when the network is disabled
- Replace placeholder icons and screenshots with branded final assets

## 7) Native app packaging with Capacitor
- Set `NEXT_PUBLIC_APP_URL` to the live deployed domain
- Run `npm install`
- Run `npx cap add ios`
- Run `npx cap add android`
- Run `npm run cap:sync`
- Run `npm run cap:open:ios`
- Run `npm run cap:open:android`
- In Xcode and Android Studio, set:
  - bundle / application IDs
  - version numbers
  - app icons
  - launch screens
  - privacy usage descriptions

## 8) App Store submission readiness
- Apple Developer account active
- App Privacy answers completed
- Screenshots exported for all required device sizes
- Support URL and privacy policy URL live
- Terms URL and refund policy URL live
- TestFlight build installed and verified
- Sign in, upload image, booking request, message flow, and Stripe handoff tested on device

## 9) Google Play submission readiness
- Play Console account active
- Data safety form completed
- Content rating completed
- Privacy policy URL live
- Closed testing track created
- Internal testers confirm auth, upload, booking, and payment flow

## 10) Launch-day minimum checks
- Production database backup enabled
- Stripe live mode confirmed
- Domain and SSL active
- Terms / Privacy / Refund pages linked in footer
- Monitoring in place for deployment errors
- A support email address exists
- A manual admin process exists for disputes, refunds, and moderation

## 11) First-post-launch upgrades to prioritize
- Email verification and password reset
- Reviews and ratings
- Admin moderation dashboard
- Band payouts / Connect onboarding
- Refund tooling
- Analytics, event tracking, and SEO landing pages
- Rate limiting and abuse prevention
