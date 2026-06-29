import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const phones = await prisma.phoneNumber.findMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json(phones);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const phone = await prisma.phoneNumber.create({
    data: {
      userId: session.user.id,
      number: body.number,
      type: body.type,
    },
  });

  return NextResponse.json(phone);
}
