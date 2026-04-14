import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container-shell py-20 text-center">
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="mt-4 text-muted">The page you requested does not exist.</p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 font-semibold text-white">Back home</Link>
    </main>
  );
}
