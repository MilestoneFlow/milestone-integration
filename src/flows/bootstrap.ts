import {
  gracefulTerminatePreviewFlow,
  handlePreviewFlow,
  TourListenerOpts,
} from "./render";
import { PublicApiClient } from "../api/publicApiClient";
import { EnrolledUser } from "../types/user";
import { FlowState } from "./FlowState";
import { Flow } from "../types/flow.ts";

export const listener = async (
  publicApiClient: PublicApiClient,
  user: EnrolledUser,
) => {
  const flow = await publicApiClient.enrollInFlow(user.externalId);
  if (flow) {
    const state = new FlowState(localStorage, flow);
    const listenerOpts = getListenerOpts(publicApiClient, user);

    await handlePreviewFlow(flow, state, listenerOpts);
  }
};

export function stop() {
  gracefulTerminatePreviewFlow();
}

function getListenerOpts(
  publicApiClient: PublicApiClient,
  user: EnrolledUser,
): TourListenerOpts {
  const onFlowSkip = async (flow: Flow, skippedStepId: string) => {
    await publicApiClient.updateFlowState(user.externalId, {
      flowId: flow.id,
      skipped: true,
      currentStepId: skippedStepId,
    });
  };

  const onFlowFinish = async (flow: Flow) => {
    await publicApiClient.updateFlowState(user.externalId, {
      flowId: flow.id,
      finished: true,
    });
  };

  const onStepStart = async (flow: Flow, stepId: string) => {
    await publicApiClient.updateFlowState(user.externalId, {
      flowId: flow.id,
      currentStepId: stepId,
    });
  };

  const onTerminate = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await listener(publicApiClient, user);
  };

  return {
    onSkipCallbacks: [onFlowSkip],
    onFinishCallbacks: [onFlowFinish],
    onStepStartCallbacks: [onStepStart],
    afterTerminateCallbacks: [onTerminate],
  };
}
