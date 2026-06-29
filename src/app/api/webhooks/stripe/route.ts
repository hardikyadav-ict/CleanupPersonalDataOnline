import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event;
  try {
    event = getStripeClient().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session: any = event.data.object;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (userId && planId) {
          await prisma.subscription.upsert({
            where: { userId },
            update: {
              planId: planId as any,
              status: "ACTIVE",
              stripeSubscriptionId: session.subscription,
              stripeCustomerId: session.customer,
              currentPeriodStart: new Date(session.current_period_start * 1000),
              currentPeriodEnd: new Date(session.current_period_end * 1000),
            },
            create: {
              userId,
              planId: planId as any,
              status: "ACTIVE",
              stripeSubscriptionId: session.subscription,
              stripeCustomerId: session.customer,
              currentPeriodStart: new Date(session.current_period_start * 1000),
              currentPeriodEnd: new Date(session.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription: any = event.data.object;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status === "active" ? "ACTIVE" :
                    subscription.status === "past_due" ? "PAST_DUE" :
                    subscription.status === "canceled" ? "CANCELED" : "EXPIRED",
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const deleted: any = event.data.object;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: deleted.id },
          data: { status: "EXPIRED" },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice: any = event.data.object;
        const subId = invoice.subscription;
        if (subId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subId },
            data: { status: "PAST_DUE" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
