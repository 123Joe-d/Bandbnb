export default function PrivacyPage() {
  return (
    <main className="container-shell py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-muted">
          Bandbnb stores account, booking, and messaging data needed to operate a live music marketplace. Payment card data is
          handled by Stripe. Uploaded media is stored in Supabase Storage. This page is a starter policy and should be reviewed
          by counsel before public launch.
        </p>
        <div className="mt-8 space-y-5 text-sm leading-7 text-slate-700">
          <p>We collect account details, booking details, messages, uploaded media, and device/session metadata needed for security and product operations.</p>
          <p>We use this data to operate the marketplace, support bookings, prevent abuse, and improve the service.</p>
          <p>We do not store full payment card numbers on our servers. Stripe processes payment details on hosted checkout pages.</p>
          <p>Before launch, replace this starter copy with your final legal policy, data retention periods, and contact details.</p>
        </div>
      </div>
    </main>
  );
}
