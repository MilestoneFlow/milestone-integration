import {
  FlowStep,
  FlowStepElementAction,
  FlowStepElementType,
} from "../types/flow.ts";
import { matchTargetUrl } from "../url/processors.ts";
import {
  getOrCreateAppContainer,
  removeFromAppContainer,
  waitForElm,
} from "../render/functions.ts";
import { Placement } from "../types/element.ts";
import {
  createPopup,
  createTooltip,
  getPopupId,
  getTooltipId,
} from "../elements/factory.tsx";
import { VisualElementTemplate } from "../elements/model/VisualElement.ts";
import { repositionAttachedElement } from "../render/positioner.ts";

export const renderFlowStep = async (
  currentStep: FlowStep | null,
  {
    themeColor,
    elementTemplate,
    avatarId,
    dataAttributes = {},
    beforeCloseListeners = [],
    afterRenderingListeners = [],
  }: RenderStepOpts,
  onNextClick: () => void,
) => {
  if (!currentStep) {
    return;
  }

  if (!matchTargetUrl(window.location.pathname, currentStep.data.targetUrl)) {
    return;
  }

  if (isStepRendered(currentStep)) {
    return;
  }

  if (currentStep.data.elementType === FlowStepElementType.TOOLTIP) {
    const elm = (await waitForElm(
      currentStep.data.assignedCssElement ?? "",
    )) as HTMLElement;
    if (!elm) {
      return;
    }

    const domElem = await createTooltip(document, {
      id: currentStep.stepId,
      onNextClick: onNextClick,
      blocks: currentStep.data.blocks,
      placement: currentStep.data.placement,
      elementTemplate: elementTemplate,
      themeColor: themeColor,
      actionable: currentStep.data.actionType === FlowStepElementAction.ACTION,
      actionText: currentStep.data.actionText,
      dataAttributes: dataAttributes,
      beforeClose: beforeCloseListeners,
    });
    if (!domElem) {
      return;
    }

    const cleanAutoUpdate = await repositionAttachedElement(
      domElem,
      elm,
      currentStep.data.assignedCssElement ?? "",
      currentStep.data.placement ?? Placement.Bottom,
    );
  } else {
    createPopup(document, {
      blocks: currentStep.data.blocks,
      actionText: currentStep.data.actionText ?? "Next",
      onNextClick: onNextClick,
      id: currentStep.stepId,
      elementTemplate: elementTemplate,
      themeColor: themeColor,
      placement: Placement.Bottom,
      dataAttributes: dataAttributes,
      avatarId: avatarId,
    });
  }

  afterRenderingListeners.forEach((listener) => listener());
};

export function removeFlowStepElement(
  stepId: string,
  type: FlowStepElementType,
) {
  let id = getTooltipId(stepId);
  if (type === FlowStepElementType.POPUP) {
    id = getPopupId(stepId);
  }
  removeFromAppContainer(document, id);
}

function isStepRendered(step: FlowStep) {
  let id = getTooltipId(step.stepId);
  if (step.data.elementType === FlowStepElementType.POPUP) {
    id = getPopupId(step.stepId);
  }
  const appContainer = getOrCreateAppContainer(document);

  return appContainer.querySelector(`#${id}`) !== null;
}

interface RenderStepOpts {
  themeColor: string;
  elementTemplate: VisualElementTemplate;
  dataAttributes?: Record<string, string>;
  avatarId?: string;
  beforeCloseListeners?: (() => void)[];
  afterRenderingListeners?: (() => void)[];
}
