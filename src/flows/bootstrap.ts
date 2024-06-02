import { gracefulTerminatePreviewFlow, handlePreviewFlow } from "./render";
import { PublicApiClient } from "../api/publicApiClient";
import { EnrolledUser } from "../types/user";
import { FlowState } from "./FlowState";

let intervalId: number | null = null;

export const listener = async (
  publicApiClient: PublicApiClient,
  user: EnrolledUser,
) => {
  intervalId = setTimeout(async () => {
    console.log("Checking for flows");
    if (FlowState.existsInStorage(localStorage)) {
      return;
    }

    const flow = await publicApiClient.enrollInFlow(user.externalId);
    if (flow) {
      const state = new FlowState(localStorage, flow);
      await handlePreviewFlow(flow, state);
    }
  }, 3000);
};

export function stop() {
  gracefulTerminatePreviewFlow();
  if (intervalId) {
    clearInterval(intervalId);
  }
}
