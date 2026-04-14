import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <main className="container-shell py-16">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-line bg-white p-10 shadow-sm text-center">
        <h1 className="text-3xl font-semibold">Deposit payment received</h1>
        <p className="mt-4 text-muted">Your Stripe checkout completed successfully. The booking record will update after the webhook is received.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/bookings" className="rounded-full bg-brand px-5 py-3 font-semibold text-white">Back to bookings</Link>
          <Link href="/messages" className="rounded-full border border-line px-5 py-3 font-semibold">Open messages</Link>
        </div>
      </div>
    </main>
  );
}
