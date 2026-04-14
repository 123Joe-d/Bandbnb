import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <main className="container-shell py-16">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-line bg-white p-10 shadow-sm text-center">
        <h1 className="text-3xl font-semibold">Deposit payment cancelled</h1>
        <p className="mt-4 text-muted">No charge was completed. You can return to your bookings page and try again when you are ready.</p>
        <Link href="/bookings" className="mt-8 inline-flex rounded-full bg-brand px-5 py-3 font-semibold text-white">Back to bookings</Link>
      </div>
    </main>
  );
}
