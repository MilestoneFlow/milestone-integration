import { FlowUserStateService } from "./FlowUserStateService.ts";
import { removeElementWrapper } from "../render/functions.ts";
import {
  removeFlowFromStorage,
  setFlowInStorageIfDifferent,
  setIntervalIdStorage,
} from "./storage.ts";
import {
  Flow,
  FlowFinishEffectType,
  FlowFinishFullScreenAnimation,
} from "../types/flow.ts";
import * as domEventListeners from "./event-listeners.ts";
import { showAnimation } from "./finish-animation.ts";
import { removeFlowStepElement, renderFlowStep } from "./render-step.ts";
import { track } from "../tracker/tracker.ts";
import { EventType } from "../tracker/types.ts";

function initFlowRenderer(flow: Flow): FlowUserStateService {
  setFlowInStorageIfDifferent(flow);
  const userStateService = new FlowUserStateService(localStorage, flow);
  domEventListeners.setOnDocumentClickEvent(userStateService, onStepNextClick);

  return userStateService;
}

export const handlePreviewFlow = async (flow: Flow) => {
  const userStateService = initFlowRenderer(flow);
  const flowPreviewInterval = setInterval(async () => {
    const isRunning = await tourListener(flow, userStateService);
    if (!isRunning) {
      gracefulTerminatePreviewFlow();
      clearInterval(flowPreviewInterval);
    }
  }, 500);
  setIntervalIdStorage(flowPreviewInterval);
  return;
};

export const gracefulTerminatePreviewFlow = () => {
  FlowUserStateService.resetStateInStorage(localStorage);
  removeElementWrapper(document);

  removeFlowFromStorage();

  domEventListeners.destroyListeners();
};

const tourListener = async (
  flow: Flow,
  userStateService: FlowUserStateService,
): Promise<boolean> => {
  const currentUrl = window.location.origin;
  if (flow.baseUrl && !currentUrl.endsWith(flow.baseUrl)) {
    return false;
  }

  const currentStep = userStateService.getCurrentStep();
  if (currentStep) {
    const onNextStepEvent = async () => {
      await onStepNextClick(userStateService);
    };

    const onSkip = () => {
      gracefulTerminatePreviewFlow();
      track(flow.id, EventType.FlowSkipped, {
        stepId: currentStep.stepId,
      });
    };

    await renderFlowStep(
      currentStep,
      {
        themeColor: flow.opts.themeColor ?? "#f5f5f5",
        elementTemplate: flow.opts.elementTemplate,
        avatarId: flow.opts.avatarId,
        dataAttributes: {
          flowId: flow.id,
        },
        beforeCloseListeners: [onSkip],
        afterRenderingListeners: [
          () => {
            track(flow.id, EventType.FlowStepStart, {
              stepId: currentStep.stepId,
            });
          },
        ],
      },
      onNextStepEvent,
    );

    return true;
  } else {
    if (userStateService.isFinished()) {
      if (!userStateService.isFinishEffectsInProgress()) {
        userStateService.handleFinish();
        onFinishFlow(flow);
      } else {
        userStateService.destroy();
      }

      return false;
    } else {
      throw Error("No step available");
    }
  }
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

const onStepNextClick = async (userStateService: FlowUserStateService) => {
  const currentStep = userStateService.getCurrentStep();
  if (!currentStep) {
    return;
  }
  removeFlowStepElement(currentStep.stepId, currentStep.data.elementType);

  userStateService.switchToNextStep();
};
