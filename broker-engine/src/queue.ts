import { Queue, Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
}) as any;

export const removalQueue = new Queue("removal", { connection });
export const scanQueue = new Queue("scan", { connection });

export const removalQueueEvents = new QueueEvents("removal", { connection });
export const scanQueueEvents = new QueueEvents("scan", { connection });

export type RemovalJobData = {
  removalRequestId: string;
  userId: string;
  brokerId: string;
  brokerSlug: string;
};

export type ScanJobData = {
  scanId: string;
  userId: string;
};

export async function enqueueRemoval(data: RemovalJobData): Promise<void> {
  await removalQueue.add("execute_removal", data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 60000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  });
}

export async function enqueueScan(data: ScanJobData): Promise<void> {
  await scanQueue.add("run_scan", data, {
    attempts: 2,
    backoff: { type: "fixed", delay: 300000 },
    removeOnComplete: 50,
    removeOnFail: 20,
  });
}

export async function closeQueues(): Promise<void> {
  await removalQueue.close();
  await scanQueue.close();
  await connection.quit();
}
