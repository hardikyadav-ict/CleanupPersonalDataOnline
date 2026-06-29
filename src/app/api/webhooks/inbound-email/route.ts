import { NextResponse } from "next/server";
import { confirmationHandler } from "../../../../../email-worker/src/confirmation-handler";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Verify SPF/DKIM signature in production
    // await verifyEmailAuthenticity(payload);

    await confirmationHandler.processInboundEmail(payload);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Inbound email processing error:", error);
    return NextResponse.json(
      { error: error.message || "Processing failed" },
      { status: 500 }
    );
  }
}
