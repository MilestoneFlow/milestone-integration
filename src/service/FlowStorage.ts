import { Flow, FlowStep } from "../types/flowTypes.ts";
import { decode, encode } from "./localStorageHelper.ts";

export const setFlowInStorage = (flow: Flow) => {
  localStorage.setItem("milestoneFlow", encode(flow));
};

export const getFlowFromStorage = (): Flow | null => {
  return decode(localStorage.getItem("milestoneFlow"));
};

export const setFlowInStorageIfDifferent = (flow: Flow) => {
  const currentStoredFlow = getFlowFromStorage();
  if (currentStoredFlow?.id === flow.id) {
    return;
  }

  setFlowInStorage(flow);
};

export const setCurrentStepInStorage = (step: FlowStep) => {
  localStorage.setItem("milestoneFlowCurrentStep", encode(step));
};

export const getCurrentStepFromStorage = (): FlowStep | null => {
  return decode(localStorage.getItem("milestoneFlowCurrentStep"));
};

export const removeFlowFromStorage = () => {
  localStorage.removeItem("milestoneFlow");
  localStorage.removeItem("milestoneFlowCurrentStep");
  clearInterval(getIntervalIdStorage());
  localStorage.removeItem("milestonePreviewIntervalId");
};

export const setIntervalIdStorage = (intervalId: number) => {
  localStorage.setItem("milestonePreviewIntervalId", encode(intervalId));
};

export const getIntervalIdStorage = () => {
  return decode(localStorage.getItem("milestonePreviewIntervalId"));
};

export const hasJustFinished = () => {
  const finished = decode(localStorage.getItem("milestonePreviewFinish"));
  localStorage.removeItem("milestonePreviewFinish");

  return finished;
};

export const setJustFinished = () => {
  localStorage.setItem("milestonePreviewFinish", encode(true));
};

export const setEnrolledUserId = (userId: string) => {
  localStorage.setItem("milestoneEnrolledUserId", encode(userId));
};

export const getEnrolledUserId = () => {
  return decode(localStorage.getItem("milestoneEnrolledUserId"));
};
