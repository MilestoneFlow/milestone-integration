import { PublicApiClient } from "../api/publicApiClient";
import { Helper, HelperRenderAction } from "../types/helper";
import { matchTargetUrl } from "../url/processors";
import {
  createHotspot,
  getHotspotDomElement,
} from "../elements/HotspotElement";
import {
  getOrCreateAppContainer,
  removeAppContainer,
  removeElementWrapper,
  waitForElm,
} from "../elements/render/functions";
import { autoUpdate, computePosition, offset, shift } from "@floating-ui/dom";
import { ElementTemplate, Placement } from "../types/element";
import {
  createTooltip,
  getTooltipId,
  removeTooltip,
} from "../elements/factory";
import { track } from "../tracker/tracker";
import { EventType } from "../tracker/types";
import { repositionAttachedElement } from "../elements/render/positioner";

export async function createListener(apiClient: PublicApiClient) {
  const helpers = await apiClient.fetchHelpers();

  return (url: string) => {
    removeAppContainer(document);

    const pathname = new URL(url).pathname;
    const helpersToRender = [];
    for (const helper of helpers) {
      if (helper.data.targetUrl && pathname === helper.data.targetUrl) {
        helpersToRender.push(helper);
      }
    }

    const appContainer = getOrCreateAppContainer(document);
    for (const helper of helpersToRender) {
      renderElement(helper, appContainer);
    }
  };
}

export async function renderElement(
  element: Helper,
  appContainer: HTMLElement,
) {
  if (!element.data.targetUrl || !element.data.assignedCssElement) {
    return;
  }

  if (!matchTargetUrl(window.location.pathname, element.data.targetUrl)) {
    return;
  }

  const hotspotDOM = createHotspot(document, appContainer, {
    id: element.publicId,
    color: element.data.iconColor ?? "#1f7d5e",
    animationDurationS: 2,
    sizePx: 13,
    actionsHandlers: getElementActions(element),
  });
  if (!hotspotDOM) {
    return;
  }

  const assignedDOM = (await waitForElm(
    element.data.assignedCssElement,
  )) as HTMLElement;
  if (!assignedDOM) {
    hotspotDOM.remove();
    return;
  }

  autoUpdate(
    assignedDOM,
    hotspotDOM,
    () => {
      updateElement(assignedDOM, hotspotDOM, element);
    },
    {
      ancestorScroll: false,
      layoutShift: false,
    },
  );
}

async function updateElement(
  assignedDOM: HTMLElement,
  hotspotDOM: HTMLElement,
  element: Helper,
) {
  const { x, y } = await computePosition(assignedDOM, hotspotDOM, {
    placement: element.data.placement as Placement,
    middleware: [shift(), offset(-20)],
  });
  if (x <= 0 && y <= 0) {
    removeElementWrapper(document);
    return;
  }

  Object.assign(hotspotDOM.style, {
    left: `${x}px`,
    top: `${y}px`,
  });
  hotspotDOM.style.opacity = "1";
}

function getElementActions(element: Helper) {
  const onHover = () => onHoverFn(element);
  const onClick = () => onClickFn(element);

  return {
    onHover,
    onClick,
  };
}

async function onHoverFn(element: Helper) {
  track(element.publicId, EventType.HelperHover);

  if (element.renderAction !== HelperRenderAction.Hover) {
    return;
  }
  if (getElementRendered(element)) {
    return;
  }
  await displayTooltip(element);
}

async function onClickFn(element: Helper) {
  track(element.publicId, EventType.HelperClick);

  if (element.renderAction !== HelperRenderAction.Click) {
    return;
  }
  const dom = getElementRendered(element);
  if (dom) {
    dom.remove();
    return;
  }
  await displayTooltip(element);
}

async function displayTooltip(element: Helper) {
  if (
    !element.data.assignedCssElement ||
    !element.data.targetUrl ||
    !matchTargetUrl(window.location.pathname, element.data.targetUrl)
  ) {
    return;
  }

  const helperDomId = getElementId(element.publicId);

  removeTooltip(document, helperDomId);
  const onActionClick = () => {};

  const assignedDOM = (await waitForElm(
    element.data.assignedCssElement,
  )) as HTMLElement;
  if (!assignedDOM) {
    return;
  }

  const domElem = await createTooltip(document, {
    onNextClick: onActionClick,
    blocks: element.data.blocks ?? [],
    placement: element.data.placement ?? Placement.Bottom,
    elementTemplate: ElementTemplate.DARK,
    themeColor: element.data.iconColor ?? "#f5f5f5",
    actionable: true,
    actionText: element.data.actionText,
    id: getElementId(element.publicId),
    skipHotspot: true,
    beforeClose: [() => track(element.publicId, EventType.HelperClose)],
  });

  const hotspotDom = getHotspotDomElement(element.publicId) ?? assignedDOM;

  const cleanAutoUpdate = await repositionAttachedElement(
    domElem,
    hotspotDom,
    element.data.assignedCssElement ?? "",
    element.data.placement ?? Placement.Bottom,
  );
}

function getElementRendered(helper: Helper) {
  const domElement = document.getElementById(
    getTooltipId(getElementId(helper.publicId)),
  );
  return domElement;
}

function getElementId(publicId: string) {
  return `helper-${publicId}`;
}
