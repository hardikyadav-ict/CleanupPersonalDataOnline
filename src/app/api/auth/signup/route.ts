import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/encryption";
import { signupSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = signupSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        profile: { create: { firstName: name.split(" ")[0], lastName: name.split(" ").slice(1).join(" ") } },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
