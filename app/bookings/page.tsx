import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { currency, formatDate } from '@/lib/utils';

export default async function BookingsPage() {
  const user = await requireUser();

  const bookings = await prisma.booking.findMany({
    where: user.role === 'BAND' ? { band: { ownerId: user.id } } : { customerId: user.id },
    include: { band: true, customer: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="container-shell py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Bookings</h1>
        <p className="mt-2 text-muted">{user.role === 'BAND' ? 'Manage inbound requests and confirm events.' : 'Track booking status and pay deposits after approval.'}</p>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="rounded-3xl border border-line bg-white p-8 text-muted shadow-sm">No bookings yet.</div>
        ) : bookings.map((booking) => (
          <div key={booking.id} className="rounded-3xl border border-line bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-lg font-semibold">{booking.band.stageName}</div>
                <div className="text-sm text-muted">{formatDate(booking.eventDate)} · {booking.startTime}–{booking.endTime} · {booking.eventType}</div>
                <div className="mt-1 text-sm text-muted">Customer: {booking.customer.name} · {booking.location} · {booking.guestCount} guests</div>
                {booking.notes ? <p className="mt-3 text-sm text-muted">Notes: {booking.notes}</p> : null}
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{currency(booking.totalPrice)}</div>
                <div className="text-sm text-muted">Status: {booking.status}</div>
                <div className="text-sm text-muted">Deposit: {currency(booking.depositAmount)} · {booking.paymentStatus}</div>
                {user.role === 'CUSTOMER' && booking.status === 'CONFIRMED' && booking.paymentStatus !== 'DEPOSIT_PAID' ? (
                  <form action="/api/stripe/checkout" method="POST" className="mt-3">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <button className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">Pay deposit</button>
                  </form>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
