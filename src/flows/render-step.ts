import {
  FlowStep,
  FlowStepElementAction,
  FlowStepElementType,
} from "../types/flow";
import { matchTargetUrl } from "../url/processors";
import {
  getOrCreateAppContainer,
  removeFromAppContainer,
  waitForElm,
} from "../elements/render/functions";
import { ElementTemplate, Placement } from "../types/element";
import {
  createPopup,
  createTooltip,
  getPopupId,
  getTooltipId,
} from "../elements/factory";
import { repositionAttachedElement } from "../elements/render/positioner";

export const renderFlowStep = async (
  currentStep: FlowStep,
  opts: RenderStepOpts,
  onNextClick: () => void,
) => {
  if (isStepRendered(currentStep)) {
    return;
  }

  if (!matchTargetUrl(window.location.pathname, currentStep.data.targetUrl)) {
    return;
  }

  if (currentStep.data.elementType === FlowStepElementType.TOOLTIP) {
    await renderStepTooltip(currentStep, opts, onNextClick);
  } else {
    renderStepPopup(currentStep, opts, onNextClick);
  }

  opts.afterRenderingListeners?.forEach((listener) => listener());
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

async function renderStepTooltip(
  currentStep: FlowStep,
  {
    themeColor,
    elementTemplate,
    dataAttributes = {},
    beforeCloseListeners = [],
  }: RenderStepOpts,
  onNextClick: () => void,
) {
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
}

function renderStepPopup(
  currentStep: FlowStep,
  {
    themeColor,
    elementTemplate,
    avatarId,
    dataAttributes = {},
    beforeCloseListeners = [],
  }: RenderStepOpts,
  onNextClick: () => void,
) {
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
    beforeClose: beforeCloseListeners,
  });
}

interface RenderStepOpts {
  themeColor: string;
  elementTemplate: ElementTemplate;
  dataAttributes?: Record<string, string>;
  avatarId?: string;
  beforeCloseListeners?: (() => void)[];
  afterRenderingListeners?: (() => void)[];
}
