import { FlowState } from "./FlowState";
import { FlowStepElementAction } from "../types/flow";
import { waitForElm } from "../elements/render/functions";
import { matchTargetUrl } from "../url/processors";

let onDocumentClick: any = null;
let onDocumentInput: any = null;
export function setOnDocumentClickEvent(
  userStateService: FlowState,
  onStepNextClick: (userStateService: FlowState) => void,
) {
  if (onDocumentClick) {
    document.removeEventListener("click", onDocumentClick, true);
  }
  if (onDocumentInput) {
    document.removeEventListener("input", onDocumentInput, true);
  }
  onDocumentClick = async (e: Event) => {
    await clickEventsListener(
      e,
      userStateService,
      window.location.pathname,
      onStepNextClick,
    );
  };
  onDocumentInput = async (e: Event) => {
    await inputEventsListener(
      e,
      userStateService,
      window.location.pathname,
      onStepNextClick,
    );
  };
  document.addEventListener("click", onDocumentClick, true);
  document.addEventListener("input", onDocumentInput, true);
}

export function destroyListeners() {
  if (onDocumentClick) {
    document.removeEventListener("click", onDocumentClick, true);
  }
  if (onDocumentInput) {
    document.removeEventListener("input", onDocumentInput, true);
  }
}

const clickEventsListener = async (
  e: Event,
  userStateService: FlowState,
  currentPathUrl: string,
  onStepNextClick: (userStateService: FlowState) => void,
) => {
  const currentStep = userStateService.getCurrentStep();
  if (!currentStep) {
    return;
  }

  if (currentStep.data.actionType !== FlowStepElementAction.NO_ACTION) {
    return;
  }

  const targetElement = await waitForElm(currentStep.data.assignedCssElement);
  if (!targetElement) {
    return;
  }

  const nextStep = userStateService.getNextStep();

  const clickedElement = e.target as HTMLElement;
  const clickedDirectParent =
    targetElement.parentNode === clickedElement ||
    clickedElement.parentNode === targetElement;

  const matchUrls =
    [currentStep.data.targetUrl, nextStep?.data?.targetUrl ?? "///"].filter(
      (url) => matchTargetUrl(currentPathUrl, url),
    ).length > 0 || undefined === nextStep;

  const matchTargetElement =
    targetElement === clickedElement ||
    targetElement.contains(clickedElement) ||
    clickedDirectParent;

  if (matchTargetElement && matchUrls) {
    onStepNextClick(userStateService);
  }
};

const inputEventsListener = async (
  e: Event,
  userStateService: FlowState,
  currentPathUrl: string,
  onStepNextClick: (userStateService: FlowState) => void,
) => {
  const currentStep = userStateService.getCurrentStep();
  if (!currentStep) {
    return;
  }

  if (currentStep.data.actionType !== FlowStepElementAction.INPUT) {
    return;
  }

  const targetElement = await waitForElm(currentStep.data.assignedCssElement);
  if (!targetElement) {
    return;
  }

  const nextStep = userStateService.getNextStep();

  const clickedElement = e.target as HTMLElement;
  const clickedDirectParent =
    targetElement.parentNode === clickedElement ||
    clickedElement.parentNode === targetElement;

  const matchUrls =
    [currentStep.data.targetUrl, nextStep?.data?.targetUrl ?? "///"].filter(
      (url) => matchTargetUrl(currentPathUrl, url),
    ).length > 0 || undefined === nextStep;

  const matchTargetElement =
    targetElement === clickedElement ||
    targetElement.contains(clickedElement) ||
    clickedDirectParent;

  if (matchTargetElement && matchUrls) {
    await onStepNextClick(userStateService);
  }
};
