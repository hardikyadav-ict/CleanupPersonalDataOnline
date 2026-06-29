let _enqueueRemoval: ((data: { removalRequestId: string; userId: string; brokerId: string; brokerSlug: string }) => Promise<void>) | null = null;
let _enqueueScan: ((data: { scanId: string; userId: string }) => Promise<void>) | null = null;

async function ensureLoaded() {
  if (_enqueueRemoval) return;
  try {
    const mod = await import("../../broker-engine/src/queue");
    _enqueueRemoval = mod.enqueueRemoval;
    _enqueueScan = mod.enqueueScan;
  } catch {
    console.warn("BullMQ queue not available, jobs will not be enqueued");
  }
}

export async function enqueueRemovalSafe(data: { removalRequestId: string; userId: string; brokerId: string; brokerSlug: string }): Promise<void> {
  await ensureLoaded();
  if (_enqueueRemoval) {
    await _enqueueRemoval(data).catch((err) => console.error("Failed to enqueue removal:", err.message));
  }
}

export async function enqueueScanSafe(data: { scanId: string; userId: string }): Promise<void> {
  await ensureLoaded();
  if (_enqueueScan) {
    await _enqueueScan(data).catch((err) => console.error("Failed to enqueue scan:", err.message));
  }
}
