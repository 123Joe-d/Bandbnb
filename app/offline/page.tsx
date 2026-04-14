import Link from 'next/link';

export default function OfflinePage() {
  return (
    <main className="container-shell py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Offline mode</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Bandbnb keeps your recent pages available, even without a signal.</h1>
        <p className="mt-4 text-muted">
          Browsing cached listings, dashboards, and messages works offline. Actions that need the server, including login,
          uploads, live messaging, and Stripe checkout, resume when your connection returns.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-brand px-5 py-3 font-semibold text-white">Return home</Link>
          <Link href="/dashboard" className="rounded-full border border-line px-5 py-3 font-semibold">Open dashboard</Link>
        </div>
      </div>
    </main>
  );
}
