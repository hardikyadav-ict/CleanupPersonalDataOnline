import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enqueueRemovalSafe } from "@/lib/queue-client";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requests = await prisma.removalRequest.findMany({
    where: { userId: session.user.id },
    include: { broker: true },
    orderBy: { requestedAt: "desc" },
    take: 50,
  });

  return NextResponse.json(requests);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { brokerIds: inputBrokerIds } = body;
  const userId = session.user.id as string;

  let brokerIds: string[];

  if (!inputBrokerIds || !Array.isArray(inputBrokerIds) || inputBrokerIds.length === 0) {
    const allBrokers = await prisma.dataBroker.findMany({
      where: { isActive: true },
      select: { id: true, slug: true },
    });
    brokerIds = allBrokers.map((b) => b.id);
  } else {
    brokerIds = inputBrokerIds;
  }

  if (brokerIds.length === 0) {
    return NextResponse.json({ error: "No active brokers found" }, { status: 400 });
  }

  const brokers = await prisma.dataBroker.findMany({
    where: { id: { in: brokerIds } },
    select: { id: true, slug: true },
  });

  const requests = await Promise.all(
    brokers.map((broker) =>
      prisma.removalRequest.create({
        data: {
          userId,
          brokerId: broker.id,
          status: "PENDING",
          requestType: "MANUAL",
        },
      })
    )
  );

  await Promise.all(
    brokers.map((broker) =>
      prisma.brokerStatus.upsert({
        where: { userId_brokerId: { userId, brokerId: broker.id } },
        update: { status: "PENDING", lastChecked: new Date() },
        create: { userId, brokerId: broker.id, status: "PENDING" },
      })
    )
  );

  for (let i = 0; i < brokers.length; i++) {
    enqueueRemovalSafe({
      removalRequestId: requests[i].id,
      userId,
      brokerId: brokers[i].id,
      brokerSlug: brokers[i].slug,
    });
  }

  return NextResponse.json(requests);
}
