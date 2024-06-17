import { FlowState } from "./FlowState";
import { removeElementWrapper } from "../elements/render/functions";
import { removeFlowFromStorage, setFlowInStorageIfDifferent } from "./storage";
import {
  Flow,
  FlowFinishEffectType,
  FlowFinishFullScreenAnimation,
} from "../types/flow";
import * as domEventListeners from "./event-listeners";
import { showAnimation } from "./finish-animation";
import { removeFlowStepElement, renderFlowStep } from "./render-step";
import { track } from "../tracker/tracker";
import { EventType } from "../tracker/types";
import { parseBaseUrl } from "../url/processors.ts";
import { listener } from "./bootstrap.ts";

function initFlowRenderer(flow: Flow, state: FlowState) {
  setFlowInStorageIfDifferent(flow);
  domEventListeners.setOnDocumentClickEvent(state, onStepNextClick);
}

let lock: boolean = false;
export const handlePreviewFlow = async (
  flow: Flow,
  state: FlowState,
  opts: TourListenerOpts = {},
) => {
  initFlowRenderer(flow, state);
  lock = false;
  const flowPreviewInterval = setInterval(async () => {
    if (lock) {
      return;
    }

    lock = true;
    const isRunning = await tourListener(flow, state, opts);
    lock = false;

    if (!isRunning) {
      gracefulTerminatePreviewFlow();
      state.destroy();
      clearInterval(flowPreviewInterval);

      opts.afterTerminateCallbacks?.forEach((cb) => cb());
    }
  }, 500);
  return;
};

export const gracefulTerminatePreviewFlow = () => {
  FlowState.resetStateInStorage(localStorage);
  removeElementWrapper(document);

  removeFlowFromStorage();

  domEventListeners.destroyListeners();
};

const tourListener = async (
  flow: Flow,
  userStateService: FlowState,
  opts: TourListenerOpts = {},
): Promise<boolean> => {
  if (!flow.baseUrl) {
    return false;
  }

  const currentUrl = window.location.origin;
  const flowBaseUrl = parseBaseUrl(flow.baseUrl);
  if (!currentUrl.endsWith(flowBaseUrl)) {
    return false;
  }
  if (userStateService.isSkipped()) {
    return false;
  }
  if (userStateService.isFinished()) {
    onFinishFlow(flow);

    track(flow.id, EventType.FlowFinished);
    opts.onFinishCallbacks?.forEach((cb) => cb(flow));
    return false;
  }

  const currentStep = userStateService.getCurrentStep();
  if (!currentStep) {
    throw Error("No step available");
  }

  const onNextStepEvent = async () => {
    await onStepNextClick(userStateService);
  };
  const onSkip = () => {
    userStateService.switchToSkipped();
    opts.onSkipCallbacks?.forEach((cb) => cb(flow, currentStep.stepId));
    track(flow.id, EventType.FlowSkipped, {
      stepId: currentStep.stepId,
    });
  };

  const renderOpts = {
    themeColor: flow.opts.themeColor ?? "#f5f5f5",
    elementTemplate: flow.opts.elementTemplate,
    avatarId: flow.opts.avatarId,
    dataAttributes: {
      flowId: flow.id,
    },
    beforeCloseListeners: [onSkip],
    afterRenderingListeners: [
      ...(opts.onStepStartCallbacks?.map(
        (cb) => () => cb(flow, currentStep?.stepId ?? ""),
      ) ?? []),
      () => {
        track(flow.id, EventType.FlowStepStart, {
          stepId: currentStep.stepId,
        });
      },
    ],
  };
  await renderFlowStep(currentStep, renderOpts, onNextStepEvent);

  return true;
};

const onFinishFlow = (flow: Flow) => {
  if (
    flow.opts.finishEffect?.type === FlowFinishEffectType.FULL_SCREEN_ANIMATION
  ) {
    showAnimation(
      document,
      flow.opts.finishEffect.data as FlowFinishFullScreenAnimation,
    );
  }
};

const onStepNextClick = async (userStateService: FlowState) => {
  const currentStep = userStateService.getCurrentStep();
  if (!currentStep) {
    return;
  }
  removeFlowStepElement(currentStep.stepId, currentStep.data.elementType);

  userStateService.switchToNextStep();
};

export interface TourListenerOpts {
  onFinishCallbacks?: ((flow: Flow) => void)[];
  onSkipCallbacks?: ((flow: Flow, skippedStepId: string) => void)[];
  onStepStartCallbacks?: ((flow: Flow, stepId: string) => void)[];
  afterTerminateCallbacks?: (() => void)[];
}
