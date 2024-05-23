import { VisualElementTemplate } from "./VisualElement";
import { Placement } from "../../types/element.ts";

export interface CardProps {
  template: VisualElementTemplate;
  arrowPlacement: Placement;
}

export interface ActionButtonProps {
  themeColor: string;
}

export interface CloseButtonProps {
  template: VisualElementTemplate;
}
