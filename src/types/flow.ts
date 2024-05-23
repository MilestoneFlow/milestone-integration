import { Block, Placement } from "./element.ts";

export interface StepElementProps {
  onStepNextClick: (step: any, noEnd?: boolean) => void;
}

export interface Flow {
  id: string;
  name: string;
  baseUrl?: string;
  segments: FlowSegment[];
  steps: FlowStep[];
  opts: FlowOpts;
}

export interface FlowOpts {
  segmentation?: boolean;
  targeting: FlowTargeting;
  trigger: FlowTrigger;
  avatarId?: string;
  themeColor?: string;
  elementTemplate: FlowStepElementTemplate;
  finishEffect?: FlowFinishEffect;
}

export interface FlowFinishEffect {
  type: FlowFinishEffectType;
  data: FlowFinishFullScreenAnimation | FlowFinishPopup;
}

export interface FlowFinishFullScreenAnimation {
  url: string;
  durationS: number;
  name: FullScreenAnimationNames;
  position: FinishFullScreenPosition;
}

export enum FinishFullScreenPosition {
  MiddleScreen = "middleScreen",
  BottomMiddle = "bottomMiddle",
}

export enum FullScreenAnimationNames {
  Confetti1 = "confetti_1",
  Fireworks1 = "fireworks_1",
  Congratulations1 = "congratulations_1",
}

export interface FlowFinishPopup {
  content: string;
}

export interface FlowTrigger {
  triggerId?: string;
  rules?: FlowRule[];
}

export interface FlowTargeting {
  targetingId?: string;
  rules?: FlowRule[];
}

export interface FlowRule {
  condition: string;
  value: string;
}

export interface FlowSegment {
  segmentId: string;
  name: string;
  iconUrl?: string;
}

export interface FlowStep {
  stepId: string;
  parentNodeId?: string;
  data: FlowStepData;
  opts: {
    segmentId?: string;
    isSource?: boolean;
    isFinal?: boolean;
  };
}

export interface FlowStepData {
  targetUrl: string;
  assignedCssElement: string;
  actionType: FlowStepElementAction;
  actionText: string;
  elementType: FlowStepElementType;
  placement: Placement;
  blocks: Block[];
}

export interface FlowStepOpts {
  isSource: boolean;
  isFinal: boolean;
  segmentId?: string;
}

export enum FlowStepElementType {
  TOOLTIP = "tooltip",
  POPUP = "popup",
}

export enum FlowStepElementTemplate {
  LIGHT = "light",
  DARK = "dark",
}

export enum FlowStepElementAction {
  NO_ACTION = "no_action",
  ACTION = "action",
  INPUT = "input",
}

export enum FlowTargetingRuleConditions {
  USER_SEGMENT = "user_segment",
  USER_ELAPSED_TIME_FROM_ENROLLMENT = "user_elapsed_time_from_enrollment",
}

export enum FlowTriggerRuleConditions {
  USER_ACTION = "user_action",
  TARGET_PAGE = "target_page_url",
}

export enum FlowFinishEffectType {
  FINISH_POPUP = "finish_popup",
  FULL_SCREEN_ANIMATION = "full_screen_animation",
}
