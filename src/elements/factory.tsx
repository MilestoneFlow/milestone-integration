import { MilestoneFlowElementWrapperId } from "./render/constants";
import { Block, ElementTemplate, Placement } from "../types/element";
import { createRoot } from "react-dom/client";
import { TooltipElementWrapper } from "./tooltip/TooltipElementWrapper";
import { getOrCreateAppContainer } from "./render/functions";
import { PopupElementWrapper } from "./popup/PopupElementWrapper";

export function getPopupId(id: string) {
  return `milestone-popup-${id}`;
}

const createDivForPopup = (document: Document, id: string) => {
  const modalContainer = document.createElement("div");
  if (!modalContainer) {
    throw new Error("Failed init");
  }

  modalContainer.id = id;
  modalContainer.role = "modal";
  modalContainer.style.position = "fixed";
  modalContainer.style.top = "50%";
  modalContainer.style.left = "50%";
  modalContainer.style.transform = "translate(-50%, -50%)";
  modalContainer.style.zIndex = `${Number.MAX_SAFE_INTEGER}`;

  return modalContainer;
};

function createTooltipContainer(
  document: Document,
  containerId: string,
  dataAttr: Record<string, string> = {},
) {
  const tooltipContainer = document.createElement("div");
  if (!tooltipContainer) {
    throw new Error("Failed init");
  }

  tooltipContainer.id = containerId;
  tooltipContainer.role = "tooltip";
  tooltipContainer.style.position = "absolute";
  tooltipContainer.style.top = "0";
  tooltipContainer.style.left = "0";
  tooltipContainer.style.width = "max-content";
  tooltipContainer.style.zIndex = `${Number.MAX_SAFE_INTEGER}`;
  tooltipContainer.style.opacity = "0";

  if (Object.keys(dataAttr).length) {
    for (const key in dataAttr) {
      tooltipContainer.setAttribute(`data-${key}`, dataAttr[key]);
    }
  }

  return tooltipContainer;
}

export const createPopup = (document: Document, opts: PopupOpts) => {
  const popupId = opts.id ? getPopupId(opts.id) : MilestoneFlowElementWrapperId;
  const modalContainer = createDivForPopup(document, popupId);

  if (opts.dataAttributes) {
    for (const key in opts.dataAttributes) {
      modalContainer.setAttribute(`data-${key}`, opts.dataAttributes[key]);
    }
  }

  const onCloseClick = () => {
    opts.beforeClose?.forEach((fn) => fn());
    modalContainer.remove();
  };

  const root = createRoot(modalContainer);
  root.render(
    <PopupElementWrapper
      onCloseClick={onCloseClick}
      onNextClick={opts.onNextClick}
      blocks={opts.blocks}
      actionText={opts.actionText}
      template={opts.elementTemplate}
      themeColor={opts.themeColor}
      avatarImageUrl={getAvatarImageUrl(opts.avatarId)}
    />,
  );

  const appContainer = getOrCreateAppContainer(document);
  appContainer.appendChild(modalContainer);

  return modalContainer;
};

export function getTooltipId(id: string) {
  return `milestone-tooltip-${id}`;
}

export const createTooltip = async (document: Document, opts: TooltipOpts) => {
  const tooltipId = opts.id
    ? getTooltipId(opts.id)
    : MilestoneFlowElementWrapperId;
  const tooltipContainer = createTooltipContainer(
    document,
    tooltipId,
    opts.dataAttributes ?? {},
  );

  const appContainer = getOrCreateAppContainer(document);
  appContainer.appendChild(tooltipContainer);

  const root = createRoot(tooltipContainer);

  const onCloseClick = () => {
    opts.beforeClose?.forEach((fn) => fn());
    tooltipContainer.remove();
  };

  root.render(
    <TooltipElementWrapper
      onStepNextClick={opts.onNextClick}
      template={opts.elementTemplate}
      themeColor={opts.themeColor}
      blocks={opts.blocks}
      placement={opts.placement}
      actionable={opts.actionable ?? false}
      actionText={opts.actionText}
      onCloseClick={onCloseClick}
    />,
  );

  return tooltipContainer;
};

export function removeTooltip(document: Document, id: string) {
  const tooltipId = getTooltipId(id);
  const tooltipContainer = document.getElementById(tooltipId);
  if (tooltipContainer) {
    tooltipContainer.remove();
  }
}

const getAvatarImageUrl = (
  avatarId: string | undefined,
): string | undefined => {
  if (!avatarId || "avatar_0" === avatarId) {
    return undefined;
  }

  return `https://milestone-uploaded-flows-media.s3.us-east-1.amazonaws.com/avatars/${avatarId}.png`;
};

interface VisualElementOpts {
  id: string;
  skipHotspot?: boolean;
  elementTemplate: ElementTemplate;
  blocks: Block[];
  themeColor: string;
  placement: Placement;
  onNextClick?: () => void;
  actionable?: boolean;
  actionText?: string;
  beforeClose?: (() => void)[];
  dataAttributes?: Record<string, string>;
}

interface TooltipOpts extends VisualElementOpts {}

interface PopupOpts extends VisualElementOpts {
  avatarId?: string;
  onNextClick: () => void;
  actionText: string;
}
