// /**
//  * @type {Array} ElementDataEnvelope
//  * @description Data envelope for element data
//  * @property {string} 0 - Entity ID
//  * @property {EventType} 1 - Event type
//  * @property {number} 2 - Timestamp
//  * @property {Record<string, any>} 3 - Metadata
//  */
// export type ElementDataEnvelope = [
//   string,
//   EventType,
//   number,
//   Record<string, any>,
// ];

export interface ElementDataEnvelope {
  entityId: string;
  eventType: EventType;
  timestamp: number;
  metadata: Record<string, any>;
}

export enum EventType {
  HelperClick = "helper_click",
  HelperHover = "helper_hover",
  HelperClose = "helper_close",
  FlowStepStart = "flow_step_start",
  FlowStepFinished = "flow_step_finished",
  FlowSkipped = "flow_skipped",
  FlowFinished = "flow_finished",
}
