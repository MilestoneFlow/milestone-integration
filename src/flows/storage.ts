import { Flow } from "../types/flow.ts";
import {
  getFromLocalStorage,
  setInLocalStorage,
} from "../util/localStorageUtil.ts";

export const setFlowInStorage = (flow: Flow) => {
  setInLocalStorage<Flow>("milestoneFlow", flow);
};

export const getFlowFromStorage = (): Flow | null => {
  return getFromLocalStorage<Flow>("milestoneFlow");
};

export const setFlowInStorageIfDifferent = (flow: Flow) => {
  const currentStoredFlow = getFlowFromStorage();
  if (currentStoredFlow?.id === flow.id) {
    return;
  }

  setFlowInStorage(flow);
};

export const removeFlowFromStorage = () => {
  localStorage.removeItem("milestoneFlow");
  localStorage.removeItem("milestoneFlowCurrentStep");
  clearInterval(getIntervalIdStorage());
  localStorage.removeItem("milestonePreviewIntervalId");
};

export const setIntervalIdStorage = (intervalId: number) => {
  setInLocalStorage<number>("milestonePreviewIntervalId", intervalId);
};

export const getIntervalIdStorage = () => {
  return getFromLocalStorage<number>("milestonePreviewIntervalId") ?? undefined;
};
