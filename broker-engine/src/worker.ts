import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { PrismaClient } from "@prisma/client";
import { BrokerExecutor } from "./executor";
import { RemovalJobData, ScanJobData } from "./queue";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
}) as any;

const prisma = new PrismaClient();
const executor = new BrokerExecutor();

async function processRemoval(job: Job<RemovalJobData>): Promise<void> {
  const { removalRequestId, userId, brokerId, brokerSlug } = job.data;

  await prisma.removalRequest.update({
    where: { id: removalRequestId },
    data: { status: "IN_PROGRESS" },
  });

  await prisma.brokerStatus.upsert({
    where: { userId_brokerId: { userId, brokerId } },
    update: { status: "IN_PROGRESS", lastChecked: new Date() },
    create: { userId, brokerId, status: "IN_PROGRESS" },
  });

  try {
    const [user, profile, phones, addresses] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.profile.findUnique({ where: { userId } }),
      prisma.phoneNumber.findMany({ where: { userId } }),
      prisma.address.findMany({ where: { userId } }),
    ]);

    if (!user) throw new Error("User not found");

    const userData = {
      email: user.email,
      firstName: profile?.firstName || user.name?.split(" ")[0] || "",
      lastName: profile?.lastName || user.name?.split(" ").slice(1).join(" ") || "",
      phones: phones.map((p) => ({ number: p.number })),
      addresses: addresses.map((a) => ({
        street: a.street,
        city: a.city,
        state: a.state,
        zipCode: a.zipCode,
      })),
    };

    const result = await executor.execute(brokerSlug, userData);

    if (result.success) {
      const now = new Date();
      const nextRemoval = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

      await prisma.removalRequest.update({
        where: { id: removalRequestId },
        data: {
          status: "CONFIRMED",
          completedAt: now,
          responseData: JSON.stringify({ screenshotPaths: result.screenshotPaths, fallbackUsed: result.fallbackUsed }),
        },
      });

      await prisma.brokerStatus.update({
        where: { userId_brokerId: { userId, brokerId } },
        data: {
          status: "CONFIRMED",
          lastRemoved: now,
          nextRemoval,
          notes: result.fallbackUsed ? "Completed with vision fallback" : "Completed",
        },
      });
    } else {
      await prisma.removalRequest.update({
        where: { id: removalRequestId },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          responseData: JSON.stringify({ error: result.errorMessage }),
        },
      });

      await prisma.brokerStatus.update({
        where: { userId_brokerId: { userId, brokerId } },
        data: {
          status: "FAILED",
          notes: result.errorMessage || "Execution failed",
        },
      });
    }
  } catch (error: any) {
    await prisma.removalRequest.update({
      where: { id: removalRequestId },
      data: {
        status: "FAILED",
        completedAt: new Date(),
        responseData: JSON.stringify({ error: error.message }),
      },
    });

    await prisma.brokerStatus.update({
      where: { userId_brokerId: { userId, brokerId } },
      data: { status: "FAILED", notes: error.message },
    });

    throw error;
  }
}

async function processScan(job: Job<ScanJobData>): Promise<void> {
  const { scanId, userId } = job.data;

  await prisma.scan.update({
    where: { id: scanId },
    data: { status: "RUNNING", startedAt: new Date() },
  });

  try {
    const brokers = await prisma.dataBroker.findMany({
      where: { isActive: true },
    });

    const now = new Date();

    const requests = await Promise.all(
      brokers.map((broker) =>
        prisma.removalRequest.create({
          data: {
            userId,
            brokerId: broker.id,
            status: "PENDING",
            requestType: "AUTOMATED",
          },
        })
      )
    );

    await Promise.all(
      brokers.map((broker) =>
        prisma.brokerStatus.upsert({
          where: { userId_brokerId: { userId, brokerId: broker.id } },
          update: { status: "PENDING" },
          create: { userId, brokerId: broker.id, status: "PENDING" },
        })
      )
    );

    const { removalQueue } = await import("./queue");
    for (let i = 0; i < brokers.length; i++) {
      await removalQueue.add(
        "execute_removal",
        {
          removalRequestId: requests[i].id,
          userId,
          brokerId: brokers[i].id,
          brokerSlug: brokers[i].slug,
        },
        {
          delay: i * 30000,
          attempts: 3,
          backoff: { type: "exponential", delay: 60000 },
        }
      );
    }

    const results = brokers.map((b) => ({ brokerId: b.id, brokerName: b.name }));

    await prisma.scan.update({
      where: { id: scanId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        results: JSON.stringify(results),
      },
    });
  } catch (error: any) {
    await prisma.scan.update({
      where: { id: scanId },
      data: {
        status: "FAILED",
        completedAt: new Date(),
      },
    });
    throw error;
  }
}

const removalWorker = new Worker<RemovalJobData>("removal", processRemoval, {
  connection,
  concurrency: 2,
  limiter: {
    max: 10,
    duration: 60_000,
  },
});

const scanWorker = new Worker<ScanJobData>("scan", processScan, {
  connection,
  concurrency: 1,
});

removalWorker.on("completed", (job) => {
  console.log(`Removal job ${job.id} completed for broker ${job.data.brokerSlug}`);
});

removalWorker.on("failed", (job, err) => {
  console.error(`Removal job ${job?.id} failed for broker ${job?.data.brokerSlug}:`, err.message);
});

scanWorker.on("completed", (job) => {
  console.log(`Scan job ${job.id} completed`);
});

scanWorker.on("failed", (job, err) => {
  console.error(`Scan job ${job?.id} failed:`, err.message);
});

console.log("Broker worker started. Waiting for jobs...");

process.on("SIGTERM", async () => {
  await removalWorker.close();
  await scanWorker.close();
  await prisma.$disconnect();
  await connection.quit();
  process.exit(0);
});
