import { useState } from "react";
import PopupElement from "./PopupElement";
import CustomIframe from "../CustomIframe";
import { Block, ElementTemplate } from "../../types/element";

export const PopupElementWrapper = ({
  onNextClick,
  blocks,
  actionText,
  template,
  themeColor,
  avatarImageUrl,
  onCloseClick,
}: PopupElementWrapperProps) => {
  const [height, setHeight] = useState(170);

  return (
    <CustomIframe width={"425px"} height={`${height}px`}>
      <PopupElement
        onCloseClick={onCloseClick}
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
  template: ElementTemplate;
  themeColor: string | undefined;
  avatarImageUrl?: string;
  onCloseClick: () => void;
}
