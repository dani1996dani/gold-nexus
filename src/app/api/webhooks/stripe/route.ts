import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Webhook signature or secret missing' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);

      // Update the order in our database
      try {
        await prisma.order.update({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { status: 'PAID' },
        });
        console.log(`Order updated to PAID for PI: ${paymentIntent.id}`);
      } catch (dbError) {
        console.error('Failed to update order status after successful payment:', dbError);
        // We return a 200 here because Stripe will keep retrying if we return an error,
        // and we might have already processed this or the order might not exist.
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(
        `PaymentIntent for ${paymentIntent.amount} failed: ${paymentIntent.last_payment_error?.message}`
      );

      try {
        await prisma.order.update({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { status: 'FAILED' },
        });
      } catch (dbError) {
        console.error('Failed to update order status to FAILED:', dbError);
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
