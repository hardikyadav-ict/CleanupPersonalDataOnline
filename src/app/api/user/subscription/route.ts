import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const freePlan = {
    id: "free",
    userId: session.user.id,
    planId: "FREE",
    status: "ACTIVE",
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    cancelAtPeriodEnd: false,
    stripeSubscriptionId: null,
    stripeCustomerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return NextResponse.json(subscription || freePlan);
}
