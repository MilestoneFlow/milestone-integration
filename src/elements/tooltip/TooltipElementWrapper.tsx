import { useState } from "react";
import TooltipElement from "./TooltipElement";
import CustomIframe from "../CustomIframe";
import { Block, ElementTemplate, Placement } from "../../types/element";

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
  template: ElementTemplate;
  themeColor: string | undefined;
  blocks: Block[];
  placement: Placement;
  actionable: boolean;
  actionText?: string;
  onCloseClick: () => void;
}
