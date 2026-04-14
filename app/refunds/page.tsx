export default function RefundsPage() {
  return (
    <main className="container-shell py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold tracking-tight">Refund & Cancellation Policy</h1>
        <p className="mt-4 text-muted">
          This starter page explains how deposits and cancellations should be handled. Review and finalize this policy before you
          accept live payments.
        </p>
        <div className="mt-8 space-y-5 text-sm leading-7 text-slate-700">
          <p>Deposits are typically collected when a band confirms a booking and may be non-refundable depending on the band’s cancellation policy.</p>
          <p>If an event is cancelled by the band, the customer should generally be eligible for a refund unless a separate signed contract states otherwise.</p>
          <p>If an event is cancelled by the customer, refund eligibility should depend on the notice period and the band’s published policy.</p>
          <p>Before launch, map this page to your Stripe refund process and operational support workflow.</p>
        </div>
      </div>
    </main>
  );
}
