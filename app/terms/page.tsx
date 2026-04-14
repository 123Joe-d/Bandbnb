export default function TermsPage() {
  return (
    <main className="container-shell py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="mt-4 text-muted">
          These starter terms govern use of the Bandbnb marketplace by customers and bands. Replace this template with your final
          legal copy before public launch.
        </p>
        <div className="mt-8 space-y-5 text-sm leading-7 text-slate-700">
          <p>Users are responsible for the accuracy of their listings, profile information, booking requests, and communication.</p>
          <p>Bandbnb may suspend accounts for fraud, abuse, policy violations, or payment disputes.</p>
          <p>Bookings may be subject to deposits, cancellation policies, and additional event-specific contract terms between the parties.</p>
          <p>Before launch, add dispute handling, governing law, age requirements, limitation of liability, and platform fee language.</p>
        </div>
      </div>
    </main>
  );
}
