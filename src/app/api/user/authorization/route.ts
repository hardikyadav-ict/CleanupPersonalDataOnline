import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({
    signed: profile?.authFormSigned || false,
    signedAt: profile?.authFormSignedAt,
    hasSignature: !!profile?.signatureEnc,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { signature } = await req.json();
  if (!signature) {
    return NextResponse.json({ error: "Signature is required" }, { status: 400 });
  }

  const signatureEnc = encrypt(signature);

  await prisma.profile.update({
    where: { userId: session.user.id },
    data: {
      signatureEnc,
      authFormSigned: true,
      authFormSignedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true, signedAt: new Date() });
}
