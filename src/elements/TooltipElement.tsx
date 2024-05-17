import * as React from "react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Stack, Button, Avatar } from "@mui/material";
import {
  FlowStep,
  FlowStepElementAction,
  FlowStepElementTemplate,
  StepElementProps,
} from "../types/flowTypes";
import CardActions from "@mui/material/CardActions";
import anime from "animejs";
import {
  getTextBlockContent,
  getVideoBlockContent,
} from "../service/FlowStepService";
import chroma from "chroma-js";
import { buttonThemeColoring } from "../service/borderingHelper";

const TooltipArrow = ({ arrowStyle, color }: any) => {
  return (
    <div>
      <svg
        id="milestoneArrowEl"
        fill={color}
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        style={arrowStyle as CSSProperties}
      >
        <path stroke="none" d="M0,0 H14 L7,7 Q7,7 7,7 Z"></path>
        <clipPath id=":r1:">
          <rect x="0" y="0" width="14" height="14"></rect>
        </clipPath>
      </svg>
    </div>
  );
};

const TooltipMedia = ({ step }: { step: FlowStep }) => {
  const videoBlockLink = getVideoBlockContent(step.data.blocks);

  return videoBlockLink ? (
    <div className="video-responsive">
      <iframe
        src={videoBlockLink}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
        style={{
          width: "100%",
        }}
      />
    </div>
  ) : (
    ""
  );
};

const TooltipActions = ({
  step,
  onNextClick,
  themeColor,
}: {
  step: FlowStep;
  onNextClick: () => void;
  themeColor: string | undefined;
}) => {
  const themeColoring = chroma(themeColor ?? "#f5f5f5");

  if (step.data.actionType !== FlowStepElementAction.ACTION) {
    return "";
  }

  return (
    <CardActions sx={{ p: 0 }}>
      <Stack
        spacing={3}
        direction="column"
        sx={{
          pt: 0,
          pb: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "auto",
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          sx={{
            borderRadius: 4,
            p: 1,
            pl: 2,
            pr: 2,
            textTransform: "none",
            ...buttonThemeColoring(themeColor),
          }}
          onClick={onNextClick}
          // startIcon={<ArrowRight />}
        >
          Next
        </Button>
      </Stack>
    </CardActions>
  );
};

const TooltipElement = ({
  step,
  setHeight,
  template,
  onStepNextClick,
  themeColor,
  avatarImageUrl,
}: TooltipElementProps) => {
  const [positioned, setPositioned] = useState(false);

  const ref = useRef<any>(null);

  const [arrowStyle, setArrowStyle] = useState({
    position: "relative",
    pointerEvents: "none",
    left: -13,
    transform: "rotate(90deg)",
    top: 50,
  });

  useEffect(() => {
    if (!ref.current) return;
    const resizeObserver = new ResizeObserver(() => {
      let heightOffset = 20;
      setHeight(ref.current?.clientHeight + heightOffset);
      setPositioned(true);
    });
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    let currentHeight = 62;
    let heightOffset = 20;
    if (ref?.current) {
      setHeight(ref?.current?.clientHeight + heightOffset);
      currentHeight = ref?.current?.clientHeight;
    }

    const placement = step.data.placement;
    let placementHeightBase = avatarImageUrl
      ? currentHeight - 20
      : currentHeight;

    if (placement === "bottom") {
      setArrowStyle({
        position: "relative",
        pointerEvents: "none",
        left: 137,
        transform: "rotate(180deg)",
        top: 0,
      });
    }
    if (placement === "left") {
      setArrowStyle({
        position: "relative",
        pointerEvents: "none",
        left: 283,
        transform: "rotate(270deg)",
        top: placementHeightBase / 2 + 5,
      });
    }
    if (placement === "top") {
      setArrowStyle({
        position: "relative",
        pointerEvents: "none",
        left: 137,
        transform: "rotate(0deg)",
        top: 0,
      });
    }
    if (placement === "right") {
      setArrowStyle({
        position: "relative",
        pointerEvents: "none",
        left: -13,
        transform: "rotate(90deg)",
        top: placementHeightBase / 2 + 5,
      });
    }
  }, []);

  const shakeElement = (ref: any) => {
    anime({
      targets: ref.current,
      translateX: [
        { value: -3, duration: 300, easing: "easeInOutSine" },
        { value: 3, duration: 300, easing: "easeInOutSine" },
        { value: 0, duration: 500, easing: "easeInOutSine" },
      ],
      delay: 3000, // Delay before the shake animation starts
      endDelay: 2000, // Delay after each shake cycle completes, before the next cycle starts
      loop: true, // Loop the shake animation indefinitely
    });
  };

  const onStepOut = () => {
    if (onStepNextClick) {
      anime({
        targets: ref.current,
        opacity: [1, 0],
        duration: 250,
        easing: "easeInOutQuad",
        complete: () => {
          onStepNextClick();
        },
      });
    }
  };

  useEffect(() => {
    anime({
      targets: ref.current,
      opacity: [0, 1],
      duration: 300,
      easing: "easeInOutQuad",
      complete: () => {
        shakeElement(ref);
      },
    });
  }, []);

  return (
    <div ref={ref}>
      {step.data.placement !== "top" ? (
        <TooltipArrow
          arrowStyle={arrowStyle}
          color={template === "dark" ? "#26282E" : "#f5f5f5"}
        />
      ) : (
        ""
      )}
      <Card
        sx={{
          maxWidth: "275px",
          p: 1,
          borderRadius: "20px",
          color: template === "dark" ? "#f5f5f5" : "#32363E",
          backgroundColor: template === "dark" ? "#32363E" : "#f5f5f5",
          ...(template === "dark"
            ? {
                borderColor: "#f5f5f5",
                borderWidth: 2,
                borderStyle: "solid",
              }
            : {}),
        }}
      >
        <CardContent>
          <Stack spacing={1}>
            <TooltipMedia step={step} />
            <Typography
              variant="body2"
              component="div"
              sx={{ color: template === "dark" ? "#f5f5f5" : "#32363E" }}
              dangerouslySetInnerHTML={{
                __html: getTextBlockContent(step.data.blocks) ?? "",
              }}
            ></Typography>
          </Stack>
        </CardContent>
        <TooltipActions
          step={step}
          onNextClick={onStepOut}
          themeColor={themeColor}
        />
      </Card>
      {step.data.placement === "top" ? (
        <TooltipArrow
          arrowStyle={arrowStyle}
          color={template === "dark" ? "#26282E" : "#f5f5f5"}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default TooltipElement;

interface TooltipElementProps {
  step: FlowStep;
  onStepNextClick: (() => void) | undefined;
  template: FlowStepElementTemplate;
  setHeight: any;
  themeColor: string | undefined;
  avatarImageUrl: string | undefined;
}
