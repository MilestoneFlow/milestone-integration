import {
  gracefulTerminatePreviewFlow,
  handlePreviewFlow,
  TourListenerOpts,
} from "./render";
import { EnrolledUser } from "../types/user";
import { FlowState } from "./FlowState";
import { Flow, FlowOpts, FlowStep } from "../types/flow.ts";
import { flowsCacheKey } from "../main.tsx";
import { demoFlowsData } from "../mock/flowsData.ts";

export const listener = async (user: EnrolledUser) => {
  const flow = getNextFlow();
  if (flow) {
    const state = new FlowState(localStorage, flow);
    const listenerOpts = getListenerOpts(user);

    await handlePreviewFlow(flow, state, listenerOpts);
  }
};

export function stop() {
  gracefulTerminatePreviewFlow();
}

function getNextFlow(): Flow | null {
  let finishedFlows: string[] = [];
  const cachedIds = localStorage.getItem(flowsCacheKey);
  if (cachedIds) {
    finishedFlows = JSON.parse(cachedIds);
  }

  const flowsData = [...demoFlowsData];
  console.log({
    cachedIds,
    flowsData,
  });

  for (let i = 0; i < flowsData.length; i++) {
    const flow = flowsData[i];
    if (!finishedFlows.includes(flow._id.$oid)) {
      return {
        id: flow._id.$oid,
        name: flow.name,
        segments: [],
        baseUrl: flow.baseUrl,
        steps: flow.steps as FlowStep[],
        opts: flow.opts as FlowOpts,
      };
    }
  }

  return null;
}

function getListenerOpts(user: EnrolledUser): TourListenerOpts {
  const onFlowSkip = async (flow: Flow, skippedStepId: string) => {
    const cachedIds = localStorage.getItem(flowsCacheKey);
    let finishedFlows: string[] = [];
    if (cachedIds) {
      finishedFlows = JSON.parse(cachedIds);
    }
    finishedFlows.push(flow.id);
    localStorage.setItem(flowsCacheKey, JSON.stringify(finishedFlows));
  };

  const onFlowFinish = async (flow: Flow) => {
    const cachedIds = localStorage.getItem(flowsCacheKey);
    let finishedFlows: string[] = [];
    if (cachedIds) {
      finishedFlows = JSON.parse(cachedIds);
    }
    finishedFlows.push(flow.id);
    localStorage.setItem(flowsCacheKey, JSON.stringify(finishedFlows));
  };

  const onTerminate = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await listener(user);
  };

  return {
    onSkipCallbacks: [onFlowSkip],
    onFinishCallbacks: [onFlowFinish],
    afterTerminateCallbacks: [onTerminate],
  };
}
