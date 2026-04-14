import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-shell flex flex-col gap-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>© 2026 Bandbnb. Live music bookings for bands and customers.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/refunds">Refunds</Link>
          <Link href="/offline">App</Link>
        </div>
      </div>
    </footer>
  );
}
