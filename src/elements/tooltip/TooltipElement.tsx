import React, { CSSProperties, useEffect, useRef, useState } from "react";
import {
  ActionButton,
  Card,
  CardContainer,
  CloseButton,
} from "../card/CardComponent";
import anime from "animejs";
import { Block, ElementTemplate, Placement } from "../../types/element";
import { getTextBlockContent } from "../../util/BlockService";

export default function TooltipElement({
  template,
  actionable,
  actionText,
  themeColor,
  blocks,
  setHeight,
  onStepNextClick,
  placement,
  onCloseClick,
}: TooltipElementProps) {
  const [positioned, setPositioned] = useState(false);
  const [currentPlacement, setCurrentPlacement] =
    useState<Placement>(placement);

  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const resizeObserver = new ResizeObserver(() => {
      const heightOffset = 20;
      // @ts-expect-error - TS doesn't know about clientHeight
      setHeight(ref.current?.clientHeight + heightOffset);
      setPositioned(true);
    });
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const cardContentStyle: CSSProperties = {
    padding: "0px 8px 8px 8px",
  };

  const stackStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const typographyStyle: CSSProperties = {
    color: template === "dark" ? "#f5f5f5" : "#32363E",
    fontSize: "14px",
    fontFamily: "Roboto, sans-serif", // Default font for MUI
    textAlign: "left", // Ensure text alignment is consistent
    lineHeight: "1em",
  };

  const onStepOut = () => {
    if (onStepNextClick) {
      onStepNextClick();
    }
  };

  useEffect(() => {
    anime({
      targets: ref.current,
      opacity: [0, 1],
      duration: 300,
      easing: "easeInOutQuad",
    });
  }, []);

  useEffect(() => {
    const handleDataChange = (event: Event) => {
      const { detail } = event as CustomEvent;
      if (detail.position === currentPlacement) {
        return;
      }

      setCurrentPlacement(detail.position);
    };

    window.addEventListener("MilestoneTooltipPositionUpdate", handleDataChange);
    return () => {
      window.removeEventListener(
        "MilestoneTooltipPositionUpdate",
        handleDataChange,
      );
    };
  }, []);

  return (
    <CardContainer ref={ref}>
      <Card template={template} arrowPlacement={currentPlacement}>
        <CloseButton template={template} onClick={onCloseClick}>
          &times;
        </CloseButton>
        <div style={cardContentStyle}>
          <div style={stackStyle}>
            <div
              style={typographyStyle}
              dangerouslySetInnerHTML={{
                __html: getTextBlockContent(blocks) ?? "",
              }}
            />
          </div>
        </div>
        {actionable && actionText && (
          <TooltipActions
            actionText={actionText}
            onNextClick={onStepOut}
            themeColor={themeColor ?? "#f5f5f5"}
          />
        )}
      </Card>
    </CardContainer>
  );
}

function TooltipActions({
  actionText,
  onNextClick,
  themeColor,
}: {
  actionText: string;
  onNextClick: () => void;
  themeColor: string;
}) {
  const cardActionsStyle = {
    padding: "8px",
    paddingTop: "0px",
  };

  const stackStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    alignItems: "flex-start",
    width: "100%",
  };

  return (
    <div style={cardActionsStyle}>
      <div style={stackStyle}>
        <ActionButton themeColor={themeColor} onClick={onNextClick}>
          {actionText}
        </ActionButton>
      </div>
    </div>
  );
}

interface TooltipElementProps {
  blocks: Block[];
  placement: Placement;
  onStepNextClick: (() => void) | undefined;
  template: ElementTemplate;
  setHeight: any;
  themeColor: string | undefined;
  actionable?: boolean;
  actionText?: string;
  onCloseClick: () => void;
}
