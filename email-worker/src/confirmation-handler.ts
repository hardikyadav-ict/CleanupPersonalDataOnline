import { prisma } from "../../src/lib/prisma";
import { emailParser } from "./inbound-parser";
import { llmExtractor } from "./llm-extractor";

export class ConfirmationHandler {
  async processInboundEmail(payload: any): Promise<void> {
    // Detect provider format (SendGrid, Mailgun, etc.)
    const email = payload.from
      ? emailParser.parseSendGridPayload(payload)
      : emailParser.parseMailgunPayload(payload);

    // Extract user and broker from recipient address
    const extracted = emailParser.extractUserIdAndBroker(email.to);
    if (!extracted) {
      console.warn("Could not extract userId/brokerId from:", email.to);
      return;
    }

    const { userId, brokerId } = extracted;

    // Try LLM extraction first, fall back to regex
    let result = await llmExtractor.extractConfirmation(email.textBody || email.htmlBody);
    if (!result || result.confidence < 0.5) {
      const regexResult = await llmExtractor.extractUsingRegex(email.textBody || email.htmlBody);
      if (regexResult) result = regexResult;
    }

    // Find the associated removal request
    const removalRequest = await prisma.removalRequest.findFirst({
      where: {
        userId,
        brokerId,
        status: { in: ["IN_PROGRESS", "PENDING"] },
      },
      orderBy: { requestedAt: "desc" },
    });

    if (!removalRequest) {
      console.warn(`No pending removal request found for user ${userId}, broker ${brokerId}`);
      return;
    }

    // If we found a confirmation URL, we'd push a job to click it
    if (result?.confirmationUrl) {
      // In production: enqueue job to click confirmation link
      // await removalQueue.add('click_confirmation', {
      //   removalRequestId: removalRequest.id,
      //   confirmationUrl: result.confirmationUrl,
      // });
      console.log(`Confirmation URL found for ${brokerId}: ${result.confirmationUrl}`);
    }

    // Update the removal request status
    await prisma.removalRequest.update({
      where: { id: removalRequest.id },
      data: {
        status: result?.confirmationUrl || result?.confirmationCode ? "CONFIRMED" : "UNCONFIRMED",
        confirmedAt: new Date(),
        responseData: result as any,
      },
    });

    // Update broker status
    if (result?.confirmationUrl || result?.confirmationCode) {
      await prisma.brokerStatus.update({
        where: { userId_brokerId: { userId, brokerId } },
        data: {
          status: "CONFIRMED",
          lastRemoved: new Date(),
          nextRemoval: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        },
      });
    }
  }
}

export const confirmationHandler = new ConfirmationHandler();
