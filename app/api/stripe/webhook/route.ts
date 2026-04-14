import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const signature = headers().get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return new Response('Missing webhook secret/signature', { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();

  try {
    const event = stripe.webhooks.constructEvent(body, signature, secret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      if (bookingId) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            paymentStatus: 'DEPOSIT_PAID',
            stripeCheckoutId: session.id,
            stripePaymentIntent: typeof session.payment_intent === 'string' ? session.payment_intent : null
          }
        });
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      if (bookingId) {
        await prisma.booking.update({ where: { id: bookingId }, data: { paymentStatus: 'FAILED' } });
      }
    }

    return new Response('ok');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook error';
    return new Response(message, { status: 400 });
  }
}
