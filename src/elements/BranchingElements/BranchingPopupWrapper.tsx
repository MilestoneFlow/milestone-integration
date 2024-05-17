import { useState } from "react";
import { FlowStepElementTemplate } from "../../types/flowTypes";
import CustomIframe from "../CustomIframe";
import BranchingPopup from "./BranchingPopup";

export const BranchingPopupWrapper = ({
  branching,
  template,
  themeColor,
  onVariantClick,
}: BranchingPopupWrapperProps) => {
  const [height, setHeight] = useState(170);
  const width = "500px";

  return (
    <CustomIframe width={width} height={`${height}px`}>
      <BranchingPopup
        width={width}
        onVariantClick={onVariantClick}
        variants={branching.variants}
        setHeight={setHeight}
        template={template}
        themeColor={themeColor}
        content={branching.content}
      />
    </CustomIframe>
  );
};

interface BranchingPopupWrapperProps {
  themeColor: string | undefined;
  template: FlowStepElementTemplate;
  branching: any;
  onVariantClick: (variant: any) => void;
}
