import { useState } from "react";
import TooltipElement from "./TooltipElement";
import { VisualElementTemplate } from "../model/VisualElement";
import CustomIframe from "../CustomIframe.tsx";
import { Block, Placement } from "../../types/element.ts";

const noop = () => {};

export const TooltipElementWrapper = ({
  onStepNextClick,
  template,
  themeColor,
  blocks,
  placement,
  actionable,
  actionText,
  onCloseClick,
}: TooltipElementWrapperProps) => {
  const [height, setHeight] = useState(20);

  return (
    <CustomIframe width={"300px"} height={`${height}px`}>
      <TooltipElement
        onStepNextClick={onStepNextClick}
        setHeight={setHeight}
        template={template}
        themeColor={themeColor}
        blocks={blocks}
        placement={placement}
        actionable={actionable}
        actionText={actionText}
        onCloseClick={onCloseClick ?? noop}
      />
    </CustomIframe>
  );
};

interface TooltipElementWrapperProps {
  onStepNextClick: (() => void) | undefined;
  template: VisualElementTemplate;
  themeColor: string | undefined;
  blocks: Block[];
  placement: Placement;
  actionable: boolean;
  actionText?: string;
  onCloseClick: () => void;
}
