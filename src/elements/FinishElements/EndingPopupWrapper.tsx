import { useState } from "react";
import EndingPopup from "./EndingPopup";
import { FlowStepElementTemplate } from "../../types/flowTypes";
import CustomIframe from "../CustomIframe.tsx";

export const EndingPopupWrapper = ({
  content,
  onFinish,
  template,
  themeColor,
}: EndingPopupWrapperProps) => {
  const [height, setHeight] = useState(170);
  const width = "500px";

  return (
    <CustomIframe width={width} height={`${height}px`}>
      <EndingPopup
        width={width}
        onFinish={onFinish}
        setHeight={setHeight}
        template={template}
        themeColor={themeColor}
        content={content}
      />
    </CustomIframe>
  );
};

interface EndingPopupWrapperProps {
  content: string;
  themeColor: string | undefined;
  template: FlowStepElementTemplate;
  onFinish: () => void;
}
