import Link from 'next/link';
import { Music4, Smartphone } from 'lucide-react';
import { getSessionUser } from '@/lib/auth';
import { logoutAction } from '@/lib/actions';

export async function Header() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand">
          <Music4 className="h-7 w-7" />
          <span>Bandbnb</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/">Browse</Link>
          <Link href="/messages">Messages</Link>
          <Link href="/bookings">Bookings</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/offline">App</Link>
          {user?.role === 'BAND' ? <Link href="/band/studio">Band Studio</Link> : null}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm text-muted sm:inline">{user.name}</span>
              <form action={logoutAction}>
                <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Log out</button>
              </form>
            </>
          ) : (
            <>
              <span className="hidden items-center gap-1 rounded-full border border-line px-3 py-2 text-xs font-semibold text-muted lg:inline-flex"><Smartphone className="h-4 w-4" /> Web + app ready</span>
              <Link href="/login" className="rounded-full border border-line px-4 py-2 text-sm font-semibold">Log in</Link>
              <Link href="/register" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
