import {
  FlowOpts,
  FlowStep,
  FlowStepElementTemplate,
} from "../types/flowTypes";
import { createHotspot, existsHotspotStyleInHead } from "./hotspot.ts";
import { createRoot } from "react-dom/client";
import { BranchingPopupWrapper } from "../elements/BranchingElements/BranchingPopupWrapper.tsx";
import { PopupElementWrapper } from "../elements/PopupElementWrapper.tsx";
import { TooltipElementWrapper } from "../elements/TooltipElementWrapper.tsx";
import { EndingPopupWrapper } from "../elements/FinishElements/EndingPopupWrapper.tsx";

export const MilestoneFlowElementWrapperId = "milestoneFlowElementWrapper";

export const createTooltip = async (
  document: Document,
  step: FlowStep,
  flowOpts: FlowOpts,
  onStepNextClick: (() => void) | undefined,
) => {
  const appContainer = document.createElement("div");
  if (!appContainer) {
    throw new Error("Failed init");
  }

  appContainer.id = MilestoneFlowElementWrapperId;
  appContainer.role = "tooltip";
  appContainer.style.position = "absolute";
  appContainer.style.top = "0";
  appContainer.style.left = "0";
  appContainer.style.width = "max-content";
  appContainer.style.zIndex = `${Number.MAX_SAFE_INTEGER}`;
  appContainer.style.opacity = "0";

  const { hotspot, hotspotStyle } = createHotspot(flowOpts);

  await new Promise((r) => setTimeout(r, 200));

  if (!existsHotspotStyleInHead()) {
    document.head.appendChild(hotspotStyle);
  }
  document.body.appendChild(hotspot);
  document.body.appendChild(appContainer);
  const root = createRoot(appContainer);

  root.render(
    <TooltipElementWrapper
      onStepNextClick={onStepNextClick}
      step={step}
      template={flowOpts.elementTemplate ?? FlowStepElementTemplate.LIGHT}
      themeColor={flowOpts.themeColor}
      avatarImageUrl={getAvatarImageUrl(flowOpts.avatarId)}
    />,
  );

  return appContainer;
};

export const createEndingPopup = (flowOpts: FlowOpts) => {
  const modalContainer = createDivForPopup(document);

  const root = createRoot(modalContainer);
  root.render(
    <EndingPopupWrapper
      onFinish={() => {
        document.getElementById("milestoneFlowElementWrapper")?.remove();
      }}
      content={flowOpts.finishEffect?.data ?? ""}
      template={flowOpts.elementTemplate}
      themeColor={flowOpts.themeColor}
    />,
  );

  return modalContainer;
};

export const createPopup = (
  document: Document,
  step: FlowStep,
  flowOpts: FlowOpts,
  onStepNextClick: (() => void) | undefined,
) => {
  const modalContainer = createDivForPopup(document);

  const root = createRoot(modalContainer);
  root.render(
    <PopupElementWrapper
      onStepNextClick={onStepNextClick}
      step={step}
      template={flowOpts.elementTemplate ?? FlowStepElementTemplate.LIGHT}
      themeColor={flowOpts.themeColor}
      avatarImageUrl={getAvatarImageUrl(flowOpts.avatarId)}
    />,
  );

  document.body.appendChild(modalContainer);

  return modalContainer;
};

export const createBranchingPopup = (
  template: FlowStepElementTemplate,
  themeColor: string,
  branching: any,
) => {
  const modalContainer = createDivForPopup(document);

  const onVariantClick = async (variant: any) => {};

  const root = createRoot(modalContainer);
  root.render(
    <BranchingPopupWrapper
      onVariantClick={onVariantClick}
      branching={branching}
      template={template}
      themeColor={themeColor}
    />,
  );

  return modalContainer;
};

export const createDivForPopup = (document: Document) => {
  const modalContainer = document.createElement("div");
  if (!modalContainer) {
    throw new Error("Failed init");
  }

  modalContainer.id = "milestoneFlowElementWrapper";
  modalContainer.role = "modal";
  modalContainer.style.position = "fixed";
  modalContainer.style.top = "50%";
  modalContainer.style.left = "50%";
  modalContainer.style.transform = "translate(-50%, -50%)";
  modalContainer.style.zIndex = `${Number.MAX_SAFE_INTEGER}`;

  return modalContainer;
};

export const getAvatarImageUrl = (
  avatarId: string | undefined,
): string | undefined => {
  if (!avatarId || "avatar_0" === avatarId) {
    return undefined;
  }

  return `https://milestone-uploaded-flows-media.s3.us-east-1.amazonaws.com/avatars/${avatarId}.png`;
};
