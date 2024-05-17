import { useState } from "react";
import CustomIframe from "./CustomIframe.tsx";
import PopupElement from "./PopupElement.tsx";
import { FlowStep, FlowStepElementTemplate } from "../types/flowTypes.ts";

export const PopupElementWrapper = ({
  onStepNextClick,
  step,
  template,
  themeColor,
  avatarImageUrl,
}: PopupElementWrapperProps) => {
  const [height, setHeight] = useState(170);

  return (
    <CustomIframe width={"425px"} height={`${height}px`}>
      <PopupElement
        onStepNextClick={onStepNextClick}
        step={step}
        setHeight={setHeight}
        template={template}
        themeColor={themeColor}
        avatarImageUrl={avatarImageUrl}
      />
    </CustomIframe>
  );
};

interface PopupElementWrapperProps {
  onStepNextClick: any;
  step: FlowStep;
  template: FlowStepElementTemplate;
  themeColor: string | undefined;
  avatarImageUrl?: string;
}
