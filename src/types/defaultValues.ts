import {
  Flow,
  FlowStep,
  FlowStepElementAction,
  FlowStepElementTemplate,
  FlowStepElementType,
  FlowStepPlacement,
} from './flowTypes'

export const emptyFlow: Flow = {
  id: '',
  name: '',
  steps: [],
  segments: [],
  opts: {
    elementTemplate: FlowStepElementTemplate.LIGHT,
    segmentation: false,
    trigger: {},
    targeting: {},
  },
}

export const emptyStep: FlowStep = {
  data: {
    assignedCssElement: '',
    targetUrl: '',
    blocks: [],
    placement: FlowStepPlacement.BOTTOM,
    elementType: FlowStepElementType.TOOLTIP,
    actionType: FlowStepElementAction.ACTION,
  },
  opts: {},
  parentNodeId: '',
  stepId: '',
}
