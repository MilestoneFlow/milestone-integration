import {
  FlowOpts,
  FlowStep,
  FlowStepElementType,
  FlowStepPlacement,
} from "../types/flowTypes";
import {
  autoUpdate,
  computePosition,
  flip,
  Placement,
  shift,
} from "@floating-ui/dom";
import {
  MilestoneHotspotId,
  MilestoneHotspotStyleId,
} from "../components/hotspot";
import {
  createPopup,
  createTooltip,
  MilestoneFlowElementWrapperId,
} from "../components/elementsFactory";

export const removeElementWrapper = (document: Document) => {
  const elementWrapper = document.getElementById(MilestoneFlowElementWrapperId);
  elementWrapper?.remove();
  const hotspotWrapperStyle = document.getElementById(MilestoneHotspotStyleId);
  hotspotWrapperStyle?.remove();
  const hotspotWrapper = document.getElementById(MilestoneHotspotId);
  hotspotWrapper?.remove();
};

export const waitForElm = (selector: string): Promise<Element | null> => {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};

function smoothScrollTo(element: HTMLElement, duration: number) {
  const startingY = window.scrollY;
  const elementY = window.scrollY + element.getBoundingClientRect().top;
  const targetY =
    document.body.scrollHeight - elementY < window.innerHeight
      ? document.body.scrollHeight - window.innerHeight
      : elementY;
  const diff = targetY - startingY;
  let start: number;

  if (!diff) return;

  // Bootstrap our animation - it will get called right before next frame shall be rendered.
  window.requestAnimationFrame(function step(timestamp) {
    if (!start) start = timestamp;
    // Elapsed milliseconds since start of scrolling.
    const time = timestamp - start;
    // Get percent of completion in range [0, 1].
    const percent = Math.min(time / duration, 1);

    window.scrollTo(0, startingY + diff * percent);

    // Proceed with animation as long as we wanted it to.
    if (time < duration) {
      window.requestAnimationFrame(step);
    }
  });
}

export const repositionStepElement = async (
  stepElement: HTMLElement,
  elementToAttach: HTMLElement,
  domSelector: string,
  placement: FlowStepPlacement,
) => {
  // const elm = await waitForElm(domSelector)
  // if (!elm) {
  //   return
  // }

  return autoUpdate(elementToAttach, stepElement, async () => {
    const hotspot = document.getElementById(MilestoneHotspotId);
    const { x, y } = await computePosition(elementToAttach, stepElement, {
      placement: placement as Placement,
      middleware: [shift(), flip()],
    });
    if (0 === x && 0 === y) {
      removeElementWrapper(document);
      // stepElement.style.opacity = '0'
      // if (hotspot) {
      //   hotspot.style.opacity = '1'
      // }
      // await waitForElm(domSelector)
      return;
    }

    if (hotspot) {
      adjustHotspot(hotspot, placement, elementToAttach);
    }

    Object.assign(stepElement.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
    stepElement.style.opacity = "1";

    // const isInViewport = isElementInViewport(elementToAttach);
    // if (!isInViewport) {
    //   elementToAttach.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'start' })
    // }
  });
};

export const createElementForStep = async (
  document: Document,
  currentStep: FlowStep,
  flowOpts: FlowOpts,
  onNextStepEvent: undefined | (() => void),
) => {
  let domElem: HTMLDivElement;
  if (currentStep.data.elementType === FlowStepElementType.TOOLTIP) {
    domElem = await createTooltip(
      document,
      currentStep,
      flowOpts,
      onNextStepEvent,
    );
  } else {
    domElem = createPopup(document, currentStep, flowOpts, onNextStepEvent);
  }

  return domElem;
};

export const getElementWrapper = () => {
  const el = document.getElementById("milestoneFlowElementWrapper");

  return el;
};

export const getElementCoords = (element: HTMLElement) => {
  return {
    x: parseInt(element.style.left),
    y: parseInt(element.style.top),
  };
};

const isElementInViewport = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight ||
        document.documentElement.clientHeight) /* or $(window).height() */ &&
    rect.right <=
      (window.innerWidth ||
        document.documentElement.clientWidth) /* or $(window).width() */
  );
};

const computePositionWithBoundingRect = (
  elm: Element,
  position: FlowStepPlacement,
  offset: number,
) => {
  const rect = elm.getBoundingClientRect();
  let x = 0,
    y = 0; // Initialize x and y coordinates

  switch (position) {
    case "top":
      x = rect.left + rect.width / 2; // Center horizontally
      y = rect.top + offset; // Margin from the top edge of the element
      break;
    case "bottom":
      x = rect.left + rect.width / 2; // Center horizontally
      y = rect.bottom - offset; // Margin from the bottom edge of the element
      break;
    case "left":
      x = rect.left + offset; // Margin from the left edge of the element
      y = rect.top + rect.height / 2; // Center vertically
      break;
    case "right":
      x = rect.right - offset; // Margin from the right edge of the element
      y = rect.top + rect.height / 2; // Center vertically
      break;
    default:
      console.error("Invalid position specified.");
      break;
  }

  // Convert from viewport-relative coordinates to page-relative coordinates
  x += window.scrollX;
  y += window.scrollY;

  return { x, y };
};

const adjustHotspot = (
  hotspot: HTMLElement,
  position: FlowStepPlacement,
  elm: Element,
) => {
  const { x, y } = computePositionWithBoundingRect(elm, position, 10);

  hotspot.style.top = `${y}px`;
  hotspot.style.left = `${x}px`;
  hotspot.style.opacity = "1";
};
