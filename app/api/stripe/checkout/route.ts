import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { getStripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== 'CUSTOMER') {
    return NextResponse.redirect(new URL('/login', request.url), 303);
  }

  const formData = await request.formData();
  const bookingId = String(formData.get('bookingId') || '');
  if (!bookingId) {
    return NextResponse.redirect(new URL('/bookings', request.url), 303);
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { band: true }
  });

  if (!booking || booking.customerId !== user.id) {
    return NextResponse.redirect(new URL('/bookings', request.url), 303);
  }

  if (booking.status !== 'CONFIRMED') {
    return NextResponse.redirect(new URL('/bookings', request.url), 303);
  }

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: user.email,
    success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/payment/cancel?bookingId=${booking.id}`,
    metadata: {
      bookingId: booking.id,
      bandId: booking.bandId,
      customerId: user.id
    },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${booking.band.stageName} deposit`,
            description: `Deposit for ${booking.eventType} on ${booking.eventDate.toISOString().slice(0, 10)}`
          },
          unit_amount: booking.depositAmount * 100
        },
        quantity: 1
      }
    ]
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      stripeCheckoutId: session.id,
      paymentStatus: 'DEPOSIT_PENDING'
    }
  });

  return NextResponse.redirect(session.url || `${appUrl}/bookings`, 303);
}