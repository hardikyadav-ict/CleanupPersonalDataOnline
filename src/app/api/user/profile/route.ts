import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: {
        select: { email: true, name: true },
      },
    },
  });

  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const profile = await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: {
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
    },
    create: {
      userId: session.user.id,
      firstName: body.firstName,
      lastName: body.lastName,
    },
  });

  if (body.name) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: body.name },
    });
  }

  return NextResponse.json(profile);
}
