import { Flow } from "../types/flow";
import {
  getFromLocalStorage,
  setInLocalStorage,
} from "../util/localStorageUtil";

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
};
