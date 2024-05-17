import { useState } from "react";
import TooltipElement from "./TooltipElement";
import { FlowStep, FlowStepElementTemplate } from "../types/flowTypes";
import CustomIframe from "./CustomIframe.tsx";

export const TooltipElementWrapper = ({
  onStepNextClick,
  step,
  template,
  themeColor,
  avatarImageUrl,
}: TooltipElementWrapperProps) => {
  const [height, setHeight] = useState(170);

  return (
    <CustomIframe width={"300px"} height={`${height}px`}>
      <TooltipElement
        onStepNextClick={onStepNextClick}
        step={step}
        setHeight={setHeight}
        template={template}
        themeColor={themeColor}
        avatarImageUrl={undefined}
      />
    </CustomIframe>
  );
};

interface TooltipElementWrapperProps {
  onStepNextClick: (() => void) | undefined;
  step: FlowStep;
  template: FlowStepElementTemplate;
  themeColor: string | undefined;
  avatarImageUrl?: string;
}
