import * as React from "react";
import { useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Avatar, Stack } from "@mui/material";
import {
  FlowStep,
  FlowStepBlockType,
  FlowStepElementTemplate,
  StepElementProps,
} from "../types/flowTypes";
import { getMediaBlock, getTextBlockContent } from "../service/FlowStepService";
import anime from "animejs";
import { buttonThemeColoring } from "../service/borderingHelper";

const PopupMedia = ({ step }: { step: FlowStep }) => {
  const mediaBlock = getMediaBlock(step.data.blocks);
  if (!mediaBlock) {
    return "";
  }

  if (mediaBlock.type === FlowStepBlockType.Video) {
    return (
      <div
        className="video-responsive"
        style={{
          paddingTop: "5px",
        }}
      >
        <iframe
          src={mediaBlock.data}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
          style={{
            width: "100%",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="media-component"
      style={{
        paddingTop: "5px",
      }}
    >
      <img
        style={{
          width: "100%",
        }}
        src={mediaBlock.data}
        alt="popup media"
      />
    </div>
  );
};

const PopupElement = ({
  step,
  setHeight,
  template,
  onStepNextClick,
  themeColor,
  avatarImageUrl,
}: PopupElementProps) => {
  const ref = useRef<any>(null);
  useEffect(() => {
    if (!ref.current) return;
    const resizeObserver = new ResizeObserver(() => {
      setHeight(ref.current?.clientHeight + 20);
      // setHeight(ref.current?.clientHeight + 20)
    });
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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
      duration: 500,
      easing: "easeInOutQuad",
    });
  }, []);

  return (
    <div
      ref={ref}
      style={
        avatarImageUrl
          ? {
              paddingTop: "60px",
            }
          : {}
      }
    >
      {avatarImageUrl ? (
        <Avatar
          sx={{
            width: 100,
            height: "auto",
            position: "absolute",
            top: 0,
            left: 160,
          }}
          src={avatarImageUrl}
          alt="avatar image"
        />
      ) : (
        ""
      )}
      <Card
        sx={{
          maxWidth: 400,
          pl: 4,
          pr: 4,
          pt: 2,
          pb: 3,
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
          <Stack spacing={1} sx={{ alignItems: "center" }}>
            <PopupMedia step={step} />
            <Typography
              variant="body2"
              component="div"
              dangerouslySetInnerHTML={{
                __html: getTextBlockContent(step.data.blocks) ?? "",
              }}
            ></Typography>
          </Stack>
        </CardContent>
        <CardActions>
          <Stack
            spacing={3}
            direction="column"
            sx={{
              pt: 1,
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
              sx={{
                borderRadius: 4,
                p: 1,
                pl: 2,
                pr: 2,
                textTransform: "none",
                ...buttonThemeColoring(themeColor),
              }}
              onClick={onStepOut}
            >
              Next
            </Button>
          </Stack>
        </CardActions>
      </Card>
    </div>
  );
};
export default PopupElement;

interface PopupElementProps extends StepElementProps {
  step: FlowStep;
  onStepNextClick: any;
  template: FlowStepElementTemplate;
  setHeight: any;
  themeColor: string | undefined;
  avatarImageUrl: string | undefined;
}
