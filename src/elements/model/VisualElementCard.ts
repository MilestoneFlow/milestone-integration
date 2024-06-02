import { ElementTemplate, Placement } from "../../types/element";

export interface CardProps {
  template: ElementTemplate;
  arrowPlacement: Placement;
}

export interface ActionButtonProps {
  themeColor: string;
}

export interface CloseButtonProps {
  template: ElementTemplate;
}
