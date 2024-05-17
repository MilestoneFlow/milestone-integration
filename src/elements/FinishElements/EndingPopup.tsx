import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import { FlowStepElementTemplate } from "../../types/flowTypes";
import { buttonThemeColoring } from "../../service/borderingHelper";
import { useEffect, useRef } from "react";
import anime from "animejs";

const EndingPopup = ({
  width,
  onFinish,
  content,
  setHeight,
  themeColor,
  template,
}: EndingPopupProps) => {
  const ref = useRef(null);
  useEffect(() => {
    anime({
      targets: ref.current,
      opacity: [0, 1],
      duration: 300,
      easing: "easeInOutQuad",
    });
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const resizeObserver = new ResizeObserver(() => {
      // @ts-ignore
      setHeight(ref.current?.clientHeight + 20);
      // setHeight(ref.current?.clientHeight + 20)
    });
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={ref}>
      <Card
        sx={{
          maxWidth: width,
          pl: 8,
          pr: 8,
          pt: 0,
          pb: 3,
          borderRadius: "20px",
          color:
            template === FlowStepElementTemplate.DARK ? "#f5f5f5" : "#32363E",
          backgroundColor:
            template === FlowStepElementTemplate.DARK ? "#32363E" : "#f5f5f5",
          ...(template === FlowStepElementTemplate.DARK
            ? {
                borderColor: "#f5f5f5",
                borderWidth: 2,
                borderStyle: "solid",
              }
            : {}),
        }}
      >
        <CardContent sx={{ pt: 0 }}>
          <Stack spacing={1} sx={{ alignItems: "center" }}>
            <img
              src={
                "https://milestone-uploaded-flows-media.s3.amazonaws.com/assets/icegif-253.gif"
              }
              alt="confetti"
              height={150}
            />
            <Typography
              variant="body1"
              component="div"
              dangerouslySetInnerHTML={{ __html: content }}
              sx={{
                textAlign: "center", // This will center the text
                display: "block", // Use flexbox to center the content
                width: "100%", // Take up all available width
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
              onClick={onFinish}
            >
              Cool, thanks!
            </Button>
          </Stack>
        </CardActions>
      </Card>
    </div>
  );
};

export default EndingPopup;

interface EndingPopupProps {
  width: string;
  content: string;
  setHeight: any;
  themeColor: string | undefined;
  template: FlowStepElementTemplate;
  onFinish: () => void;
}
