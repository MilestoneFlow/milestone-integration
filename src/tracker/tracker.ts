import * as q from "./queue.ts";
import { EventType } from "./types.ts";
import { PublicApiClient } from "../api/publicApiClient.ts";

let intervalId: number | null = null;

export function track(
  entityId: string,
  eventType: EventType,
  metadata: Record<string, any> = {},
) {
  q.add({ entityId, eventType, timestamp: Date.now(), metadata });
}

export function start(apiClient: PublicApiClient, externalUserId: string) {
  intervalId = setInterval(async () => {
    if (q.isEmpty()) {
      return;
    }

    const chunk = q.pullChunk(128);
    await apiClient.sendTrackingData(externalUserId, chunk);
  }, 3000);
}

export function stop() {
  if (intervalId) {
    clearInterval(intervalId);
  }
}
