import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { currency, formatDate } from '@/lib/utils';
import { updateBookingStatusAction } from '@/lib/actions';

export default async function DashboardPage() {
  const user = await requireUser();

  if (user.role === 'BAND') {
    const band = await prisma.band.findUnique({
      where: { ownerId: user.id },
      include: {
        bookings: { include: { customer: true }, orderBy: { createdAt: 'desc' } },
        conversations: { include: { customer: true, messages: { orderBy: { createdAt: 'asc' } } }, orderBy: { updatedAt: 'desc' } },
        availabilityBlocks: true
      }
    });

    if (!band) {
      return (
        <main className="container-shell py-12">
          <div className="rounded-3xl border border-line bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-semibold">Finish onboarding</h1>
            <p className="mt-2 text-muted">Your account exists, but your band is not published yet.</p>
            <Link href="/band/onboarding" className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 font-semibold text-white">Create your listing</Link>
          </div>
        </main>
      );
    }

    return (
      <main className="container-shell space-y-8 py-10">
        <section className="rounded-3xl border border-line bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Band dashboard</h1>
              <p className="mt-2 text-muted">Manage inquiries, customer chats, payout readiness, and listing health.</p>
            </div>
            <Link href="/band/studio" className="rounded-full bg-brand px-5 py-3 font-semibold text-white">Open band studio</Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl bg-soft p-4"><div className="text-sm text-muted">Listing</div><div className="mt-2 text-xl font-semibold">{band.stageName}</div></div>
            <div className="rounded-2xl bg-soft p-4"><div className="text-sm text-muted">Inquiries</div><div className="mt-2 text-xl font-semibold">{band.bookings.length}</div></div>
            <div className="rounded-2xl bg-soft p-4"><div className="text-sm text-muted">Conversations</div><div className="mt-2 text-xl font-semibold">{band.conversations.length}</div></div>
            <div className="rounded-2xl bg-soft p-4"><div className="text-sm text-muted">Blocked dates</div><div className="mt-2 text-xl font-semibold">{band.availabilityBlocks.length}</div></div>
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Booking requests</h2>
            <Link href="/bookings" className="text-sm font-semibold text-brand">Open full bookings page</Link>
          </div>
          <div className="space-y-4">
            {band.bookings.length === 0 ? <p className="text-muted">No inquiries yet.</p> : band.bookings.map((booking) => (
              <div key={booking.id} className="rounded-2xl border border-line p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="font-semibold">{booking.customer.name} · {booking.eventType}</div>
                    <div className="text-sm text-muted">{formatDate(booking.eventDate)} · {booking.startTime}–{booking.endTime} · {booking.location}</div>
                    <div className="mt-1 text-sm text-muted">{booking.guestCount} guests · {currency(booking.totalPrice)} · {booking.status} · deposit {currency(booking.depositAmount)} ({booking.paymentStatus})</div>
                  </div>
                  <div className="flex gap-2">
                    <form action={updateBookingStatusAction}><input type="hidden" name="bookingId" value={booking.id} /><input type="hidden" name="status" value="CONFIRMED" /><button className="rounded-full bg-success px-4 py-2 text-sm font-semibold text-white">Confirm</button></form>
                    <form action={updateBookingStatusAction}><input type="hidden" name="bookingId" value={booking.id} /><input type="hidden" name="status" value="DECLINED" /><button className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold">Decline</button></form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  const bookings = await prisma.booking.findMany({ where: { customerId: user.id }, include: { band: true }, orderBy: { createdAt: 'desc' } });

  return (
    <main className="container-shell space-y-8 py-10">
      <section className="rounded-3xl border border-line bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold">Customer dashboard</h1>
        <p className="mt-2 text-muted">Browse, message bands, submit requests, and pay deposits after approval.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-soft p-4"><div className="text-sm text-muted">Bookings</div><div className="mt-2 text-xl font-semibold">{bookings.length}</div></div>
          <div className="rounded-2xl bg-soft p-4"><div className="text-sm text-muted">Approved</div><div className="mt-2 text-xl font-semibold">{bookings.filter((b) => b.status === 'CONFIRMED').length}</div></div>
          <div className="rounded-2xl bg-soft p-4"><div className="text-sm text-muted">Paid deposits</div><div className="mt-2 text-xl font-semibold">{bookings.filter((b) => b.paymentStatus === 'DEPOSIT_PAID').length}</div></div>
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent bookings</h2>
          <Link href="/bookings" className="text-sm font-semibold text-brand">Open bookings page</Link>
        </div>
        <div className="space-y-4">
          {bookings.length === 0 ? <p className="text-muted">No bookings yet. Start by browsing bands.</p> : bookings.map((booking) => (
            <div key={booking.id} className="rounded-2xl border border-line p-4">
              <div className="font-semibold">{booking.band.stageName}</div>
              <div className="text-sm text-muted">{formatDate(booking.eventDate)} · {booking.eventType} · {booking.status}</div>
              <div className="mt-1 text-sm text-muted">{currency(booking.totalPrice)} · deposit {currency(booking.depositAmount)} · {booking.paymentStatus}</div>
              {booking.status === 'CONFIRMED' && booking.paymentStatus !== 'DEPOSIT_PAID' ? (
                <form action="/api/stripe/checkout" method="POST" className="mt-3"><input type="hidden" name="bookingId" value={booking.id} /><button className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">Pay deposit</button></form>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
