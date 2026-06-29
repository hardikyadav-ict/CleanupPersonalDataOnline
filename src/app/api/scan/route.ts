import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enqueueScanSafe } from "@/lib/queue-client";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type } = await req.json();

    const scan = await prisma.scan.create({
      data: {
        userId: session.user.id,
        type: type || "PEOPLE_SEARCH",
        status: "QUEUED",
      },
    });

    enqueueScanSafe({ scanId: scan.id, userId: session.user.id });

    return NextResponse.json(scan);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scans = await prisma.scan.findMany({
    where: { userId: session.user.id },
    orderBy: { startedAt: "desc" },
    take: 20,
  });

  return NextResponse.json(scans);
}
