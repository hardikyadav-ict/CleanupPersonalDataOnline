import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reports = await prisma.removalReport.findMany({
    where: { userId: session.user.id },
    orderBy: { periodEnd: "desc" },
    take: 12,
  });

  return NextResponse.json(reports);
}
