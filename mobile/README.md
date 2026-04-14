# Mobile release guide

This project uses Capacitor as a native wrapper around the deployed Bandbnb website.

## 1) Set the production URL
Make sure `NEXT_PUBLIC_APP_URL` points to your live deployed site, such as:

```bash
NEXT_PUBLIC_APP_URL=https://app.bandbnb.com
```

Then run:

```bash
npm install
npx cap add ios
npx cap add android
npm run cap:sync
```

## 2) Open native projects
```bash
npm run cap:open:ios
npm run cap:open:android
```

## 3) iOS checklist
- Open the project in Xcode
- Set the bundle identifier
- Set the version and build number
- Add final app icons and launch screen assets
- Add any required privacy usage descriptions
- Create a TestFlight build
- Test login, uploads, booking flow, messages, and Stripe redirect behavior

## 4) Android checklist
- Open the project in Android Studio
- Set the application ID
- Set version code and version name
- Replace icons and splash assets
- Generate a signed AAB
- Test login, uploads, booking flow, messages, and Stripe redirect behavior

## 5) Store submission materials
Prepare these before submission:
- app name
- subtitle / short description
- long description
- support URL
- privacy policy URL
- terms URL
- refund policy URL
- screenshots for required device sizes
- app icon 1024x1024

## 6) Operational warning
Capacitor wrapping does not remove your need for a stable hosted backend. If the website is down, the mobile app experience will also break. Keep Vercel, Supabase, and Stripe production environments healthy before store submission.
