import { Flow, FlowStep } from "../types/flowTypes.ts";
import { setFlowInStorage } from "./FlowStorage.ts";

export const getFlowSetup = (flow: Flow) => {
  const parentList: { [key: string]: FlowStep[] } = {};
  const finalNodesIds: string[] = [];
  let sourceNode = flow.steps[0];

  for (const step of flow.steps) {
    if (!step.parentNodeId) {
      sourceNode = step;
      continue;
    }

    if (!parentList[step.parentNodeId]) {
      parentList[step.parentNodeId] = [];
    }
    parentList[step.parentNodeId].push(step);
  }

  for (const step of flow.steps) {
    if (!parentList[step.stepId]) {
      finalNodesIds.push(step.stepId);
    }
  }

  return { parentList, sourceNode, finalNodesIds };
};

export const initFlow = async (inputFlow: Flow) => {
  const flow = inputFlow;
  setFlowInStorage(inputFlow);

  if (!flow) {
    throw Error("Flow undefined");
  }

  const { parentList, sourceNode, finalNodesIds } = getFlowSetup(flow);

  return { flow, parentList, sourceNode, finalNodesIds };
};

export const matchTargetUrl = (
  currentPath: string,
  targetUrl: string,
): boolean => {
  if (!targetUrl?.length) {
    return false;
  }

  const decodedTargetUrl = targetUrl.replace("{{any}}", "[^/]+");
  const regex = new RegExp(decodedTargetUrl);

  return regex.test(currentPath);
};
