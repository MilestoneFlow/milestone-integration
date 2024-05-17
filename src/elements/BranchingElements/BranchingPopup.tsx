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
import { getTextBlockContent } from "../../service/FlowStepService";

const BranchingPopup = ({
  width,
  onVariantClick,
  variants,
  content,
  setHeight,
  themeColor,
  template,
}: BranchingPopupProps) => {
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
        <CardContent>
          <Stack spacing={1} sx={{ alignItems: "center" }}>
            <img
              src={
                "https://img1.picmix.com/output/stamp/normal/6/0/9/7/2557906_1cdf0.gif"
              }
              alt="quiz"
              height={150}
            />
            <Typography
              variant="h5"
              component="div"
              fontWeight={700}
              sx={{
                textAlign: "center", // This will center the text
                display: "block", // Use flexbox to center the content
                width: "100%", // Take up all available width
              }}
            >
              {content}
            </Typography>
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
            {variants.map((variant) => (
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
                onClick={() => onVariantClick(variant)}
              >
                {variant.name}
              </Button>
            ))}
          </Stack>
        </CardActions>
      </Card>
    </div>
  );
};

export default BranchingPopup;

interface BranchingPopupProps {
  width: string;
  content: string;
  variants: any[];
  setHeight: any;
  themeColor: string | undefined;
  template: FlowStepElementTemplate;
  onVariantClick: (variant: any) => void;
}
