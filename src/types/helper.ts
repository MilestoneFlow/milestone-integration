import { Block, ElementType, Placement } from "./element";

export interface Helper {
  publicId: string;
  published: boolean;
  name: string;
  data: HelperData;
  renderAction: HelperRenderAction;
  created: number;
  updated: number;
  publishedAt: number;
}

interface HelperData {
  targetUrl?: string;
  assignedCssElement?: string;
  elementType?: ElementType;
  placement?: Placement;
  blocks?: Block[];
  actionText?: string;
  iconColor?: string;
}

export enum HelperRenderAction {
  Click = "click",
  Hover = "hover",
}
