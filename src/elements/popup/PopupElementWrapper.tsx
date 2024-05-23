import { useState } from "react";
import { FlowStep, FlowStepElementTemplate } from "../../types/flow";
import PopupElement from "./PopupElement";
import CustomIframe from "../CustomIframe.tsx";
import { Block } from "../../types/element.ts";

export const PopupElementWrapper = ({
  onNextClick,
  blocks,
  actionText,
  template,
  themeColor,
  avatarImageUrl,
}: PopupElementWrapperProps) => {
  const [height, setHeight] = useState(170);

  return (
    <CustomIframe width={"425px"} height={`${height}px`}>
      <PopupElement
        onNextClick={onNextClick}
        blocks={blocks}
        actionText={actionText}
        setHeight={setHeight}
        template={template}
        themeColor={themeColor}
        avatarImageUrl={avatarImageUrl}
      />
    </CustomIframe>
  );
};

interface PopupElementWrapperProps {
  blocks: Block[];
  actionText: string;
  onNextClick: () => void;
  template: FlowStepElementTemplate;
  themeColor: string | undefined;
  avatarImageUrl?: string;
}
