import { Placement } from "../../types/element";
import { autoUpdate, computePosition, flip, shift } from "@floating-ui/dom";
import { removeElementWrapper } from "./functions";

export const repositionAttachedElement = async (
  stepElement: HTMLElement,
  elementToAttach: HTMLElement,
  domSelector: string,
  elementPlacement: Placement,
) => {
  const updateElement = async () => {
    const { x, y, placement } = await computePosition(
      elementToAttach,
      stepElement,
      {
        placement: elementPlacement as Placement,
        middleware: [shift(), flip()],
      },
    );
    if (x <= 0 && y <= 0) {
      removeElementWrapper(document);
      return;
    }

    Object.assign(stepElement.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
    if (placement !== elementPlacement) {
      window.dispatchEvent(
        new CustomEvent("MilestoneTooltipPositionUpdate", {
          detail: { position: placement },
        }),
      );
    }

    stepElement.style.opacity = "1";
  };

  return autoUpdate(elementToAttach, stepElement, updateElement, {
    ancestorScroll: false,
    layoutShift: false,
  });
};
