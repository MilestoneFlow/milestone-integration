import {
  getEnrolledUserId,
  getFlowFromStorage,
  hasJustFinished,
  removeFlowFromStorage,
  setEnrolledUserId,
  setFlowInStorageIfDifferent,
  setIntervalIdStorage,
  setJustFinished,
} from "./service/FlowStorage";
import { initFlow, matchTargetUrl } from "./service/FlowService";
import {
  Flow,
  FlowFinishEffectType,
  FlowStepElementAction,
  FlowStepElementTemplate,
  FlowStepElementType,
  FlowStepPlacement,
} from "./types/flowTypes";
import {
  createBranchingPopup,
  createEndingPopup,
} from "./components/elementsFactory";
import {
  createElementForStep,
  getElementWrapper,
  removeElementWrapper,
  repositionStepElement,
  waitForElm,
} from "./service/PreviewService";
import { showAnimation } from "./service/AnimationService.ts";
import { parseBaseUrl } from "./service/urlHelper";
import {
  FlowUserState,
  FlowUserStateService,
} from "./service/FlowUserStateService";
import { ApiFlow } from "./api/ApiFlow.ts";
import { TokenStore } from "./service/TokenStore.ts";

const previewBranching = async (branching: any) => {
  removeElementWrapper(document);

  const branchingElem = createBranchingPopup(
    branching,
    FlowStepElementTemplate.DARK,
    "#f5f5f5",
  );
  document.body.appendChild(branchingElem);
};

const onStepNextClick = async (userStateService: FlowUserStateService) => {
  userStateService.endTimer();
  removeElementWrapper(document);

  userStateService.switchToNextStep();

  if (!userStateService.getCurrentStep()) {
    await userStateService.destroy();
    setJustFinished();
  }
};

const renderFlowStep = async (
  flow: Flow,
  userStateService: FlowUserStateService,
) => {
  const currentStep = userStateService.getCurrentStep();

  if (!currentStep) {
    await userStateService.destroy();
    removeFlowFromStorage();

    return;
  }

  if (!matchTargetUrl(window.location.pathname, currentStep.data.targetUrl)) {
    return;
  }

  const currentElement = getElementWrapper();
  if (currentElement) {
    return;
  }

  const onNextStepEvent = async () => {
    await onStepNextClick(userStateService);
  };

  if (currentStep.data.elementType === FlowStepElementType.TOOLTIP) {
    const elm = (await waitForElm(
      currentStep.data.assignedCssElement ?? "",
    )) as HTMLElement;
    if (!elm) {
      return;
    }

    const domElem = await createElementForStep(
      document,
      currentStep,
      flow.opts,
      onNextStepEvent,
    );
    if (!domElem) {
      return;
    }

    const cleanAutoUpdate = await repositionStepElement(
      domElem,
      elm,
      currentStep.data.assignedCssElement ?? "",
      currentStep.data.placement ?? FlowStepPlacement.BOTTOM,
    );
  } else {
    await createElementForStep(
      document,
      currentStep,
      flow.opts,
      onNextStepEvent,
    );
  }
  userStateService.startTimer();
};

const tourListener = async (
  flow: Flow,
  userStateService: FlowUserStateService,
) => {
  if (userStateService.getCurrentStep()) {
    await renderFlowStep(flow, userStateService);
  } else {
    await finishFlow();
  }
};

const onFinishFlow = (flow: Flow) => {
  if (hasJustFinished()) {
    if (flow.opts.finishEffect?.type === FlowFinishEffectType.FINISH_POPUP) {
      const endingPopup = createEndingPopup(flow.opts);
      document.body.appendChild(endingPopup);
    }
    showAnimation(document);
  }
};

const clickEventsListener = async (
  e: Event,
  userStateService: FlowUserStateService,
  currentPathUrl: string,
) => {
  const currentStep = userStateService.getCurrentStep();
  if (!currentStep) {
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

  if (currentStep.data.actionType === FlowStepElementAction.NO_ACTION) {
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
  }
};

let onDocumentClick: any = null;
const setOnDocumentClickEvent = (userStateService: FlowUserStateService) => {
  if (onDocumentClick) {
    document.removeEventListener("click", onDocumentClick, true);
  }
  onDocumentClick = async (e: Event) => {
    await clickEventsListener(e, userStateService, window.location.pathname);
  };
  document.addEventListener("click", onDocumentClick, true);
};

const redirectIfPreviewStarted = async (
  flow: Flow,
  userState: FlowUserState,
) => {
  const { sourceNode } = await initFlow(flow);

  if (
    userState.currentStepId === sourceNode.stepId &&
    !matchTargetUrl(window.location.pathname, sourceNode.data.targetUrl)
  ) {
    window.location.pathname = sourceNode.data.targetUrl;
  }
};

const finishFlow = async () => {
  FlowUserStateService.resetStateInStorage(localStorage);
  removeElementWrapper(document);

  const flow = getFlowFromStorage();
  if (flow) {
    onFinishFlow(flow);
  }
  removeFlowFromStorage();

  if (!onDocumentClick) {
    return;
  }
  document.removeEventListener("click", onDocumentClick, true);
  onDocumentClick = null;
};

const previewFlow = async (flow: Flow) => {
  const currentUrl = window.location.origin;
  let flowBaseUrl = flow.baseUrl;
  if (flowBaseUrl && flowBaseUrl.endsWith("/")) {
    flowBaseUrl = flowBaseUrl.slice(0, -1);
  }

  if (flowBaseUrl && !currentUrl.endsWith(flowBaseUrl)) {
    return;
  }

  setFlowInStorageIfDifferent(flow);
  const userStateService = new FlowUserStateService(
    localStorage,
    flow,
    getEnrolledUserId(),
  );

  await redirectIfPreviewStarted(flow, userStateService.getUserState());
  setOnDocumentClickEvent(userStateService);

  removeElementWrapper(document);
  const flowPreviewInterval = setInterval(async () => {
    await tourListener(flow, userStateService);
  }, 500);
  setIntervalIdStorage(flowPreviewInterval);
  return;
};

export const listenFlow = async (
  token: string,
  userId: string,
  flowId: string,
) => {
  setEnrolledUserId(userId);
  let currentFlow = getFlowFromStorage();

  if (!currentFlow) {
    currentFlow = await ApiFlow.fetchById(token, flowId);
    setFlowInStorageIfDifferent(currentFlow);
  }

  await previewFlow(currentFlow);
};
