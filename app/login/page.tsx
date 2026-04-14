import Link from 'next/link';
import { loginAction } from '@/lib/actions';

export default function LoginPage() {
  return (
    <main className="container-shell max-w-md py-16">
      <div className="rounded-[32px] border border-line bg-white p-8 shadow-card">
        <h1 className="text-3xl font-semibold">Log in</h1>
        <p className="mt-2 text-muted">Use a real session-based login instead of localStorage.</p>

        <form action={loginAction} className="mt-8 space-y-4">
          <label className="block">
            <div className="mb-2 font-semibold">Email</div>
            <input name="email" type="email" defaultValue="customer@bandbnb.com" className="w-full rounded-2xl border border-line px-4 py-3" />
          </label>
          <label className="block">
            <div className="mb-2 font-semibold">Password</div>
            <input name="password" type="password" defaultValue="demo12345" className="w-full rounded-2xl border border-line px-4 py-3" />
          </label>
          <button type="submit" className="w-full rounded-2xl bg-brand px-4 py-4 font-semibold text-white">Log in</button>
        </form>

        <div className="mt-6 rounded-2xl bg-soft p-4 text-sm text-muted">
          Demo customer: customer@bandbnb.com / demo12345<br />
          Demo band: band@bandbnb.com / demo12345
        </div>

        <p className="mt-6 text-sm text-muted">Need an account? <Link href="/register" className="font-semibold text-brand">Create one</Link></p>
      </div>
    </main>
  );
}
