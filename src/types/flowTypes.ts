export interface StepElementProps {
  onStepNextClick: (step: any, noEnd?: boolean) => void
}

export interface Flow {
  id: string
  name: string
  baseUrl?: string
  segments: FlowSegment[]
  steps: FlowStep[]
  opts: FlowOpts
}

export interface FlowOpts {
  segmentation?: boolean
  targeting: FlowTargeting
  trigger: FlowTrigger
  avatarId?: string
  themeColor?: string
  elementTemplate: FlowStepElementTemplate
  finishEffect?: FlowFinishEffect
}

export interface FlowFinishEffect {
  type: FlowFinishEffectType
  data: string
}

export interface FlowTrigger {
  triggerId?: string
  rules?: FlowRule[]
}

export interface FlowTargeting {
  targetingId?: string
  rules?: FlowRule[]
}

export interface FlowRule {
  condition: string
  value: string
}

export interface FlowSegment {
  segmentId: string
  name: string
  iconUrl?: string
}

export interface FlowStep {
  stepId: string
  parentNodeId?: string
  data: FlowStepData
  opts: {
    segmentId?: string
    isSource?: boolean
    isFinal?: boolean
  }
}

export interface FlowStepData {
  targetUrl: string
  assignedCssElement: string
  actionType: FlowStepElementAction
  elementType: FlowStepElementType
  placement: FlowStepPlacement
  blocks: FlowStepBlock[]
}

export interface FlowStepBlock {
  blockId: string
  type: FlowStepBlockType
  data: string
  order: number
}

export enum FlowStepBlockType {
  None = '',
  Text = 'text',
  Image = 'image',
  Gif = 'gif',
  Video = 'video',
}

export interface FlowStepOpts {
  isSource: boolean
  isFinal: boolean
  segmentId?: string
}

export enum FlowStepPlacement {
  BOTTOM = 'bottom',
  TOP = 'top',
  LEFT = 'left',
  RIGHT = 'right',
}

export enum FlowStepElementType {
  TOOLTIP = 'tooltip',
  POPUP = 'popup',
}

export enum FlowStepElementTemplate {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum FlowStepElementAction {
  NO_ACTION = 'no_action',
  ACTION = 'action',
}

export enum FlowTargetingRuleConditions {
  USER_SEGMENT = 'user_segment',
  USER_ELAPSED_TIME_FROM_ENROLLMENT = 'user_elapsed_time_from_enrollment',
}

export enum FlowTriggerRuleConditions {
  USER_ACTION = 'user_action',
  TARGET_PAGE = 'target_page_url',
}

export enum FlowFinishEffectType {
  FINISH_POPUP = 'finish_popup',
  FULL_SCREEN_ANIMATION = 'full_screen_animation',
}
