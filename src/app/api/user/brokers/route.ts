import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const statuses = await prisma.brokerStatus.findMany({
    where: { userId: session.user.id },
    include: { broker: true },
    orderBy: { broker: { name: "asc" } },
  });

  const brokers = await prisma.dataBroker.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const merged = brokers.map((broker) => {
    const status = statuses.find((s) => s.brokerId === broker.id);
    return {
      ...broker,
      status: status?.status || "PENDING",
      lastChecked: status?.lastChecked,
      lastRemoved: status?.lastRemoved,
      nextRemoval: status?.nextRemoval,
      notes: status?.notes,
    };
  });

  return NextResponse.json({
    brokers: merged,
    stats: {
      total: merged.length,
      removed: merged.filter((b) => b.status === "REMOVED" || b.status === "CONFIRMED").length,
      inProgress: merged.filter((b) => b.status === "IN_PROGRESS").length,
      pending: merged.filter((b) => b.status === "PENDING" || b.status === "SCANNING").length,
      failed: merged.filter((b) => b.status === "FAILED").length,
    },
  });
}
