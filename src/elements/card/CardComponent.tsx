import {
  ActionButtonProps,
  CardProps,
  CloseButtonProps,
} from "../model/VisualElementCard";
import styled from "@emotion/styled";
import { buttonThemeColoring } from "../../util/borderingHelper";
import { getArrowCSS } from "../tooltip/ArrowPositioning";

export const CardContainer = styled.div`
  position: relative;
  display: inline-block;
  min-width: 270px;
`;

export const Card = styled.div<CardProps>`
  max-width: 275px;
  padding: 8px 16px;
  border-radius: 15px;
  color: ${(props: any) => (props.template === "dark" ? "#f5f5f5" : "#32363E")};
  background-color: ${(props: any) =>
    props.template === "dark" ? "#32363E" : "#f5f5f5"};
  height: fit-content;
  font-family: Roboto, sans-serif;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    ${(props) => {
      const arrowCSS = getArrowCSS(props);
      return `${arrowCSS.positionStyles}
              border-width: ${arrowCSS.borderWidth};`;
    }}
  }
`;

export const ActionButton = styled.button<ActionButtonProps>`
  border-radius: 10px;
  padding: 8px 16px;
  font-family: Roboto, sans-serif;
  border: 1px solid;
  text-transform: none;
  cursor: pointer;
  transition-duration: 0.4s;
  ${({ themeColor }: ActionButtonProps) => buttonThemeColoring(themeColor)};
`;

export const CloseButton = styled.button<CloseButtonProps>`
  position: absolute;
  top: 5px; // Adjust the position to better fit your design
  right: 5px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) =>
    props.template === "dark"
      ? "#f5f5f5"
      : "#32363E"}; // Adjust color based on theme
  font-size: 16px; // Size of the close button
`;

export const CloseButtonPopup = styled.button<CloseButtonProps>`
  position: relative;
  top: 0;
  left: 100%;
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => (props.template === "dark" ? "#f5f5f5" : "#32363E")};
  font-size: 16px;
`;
