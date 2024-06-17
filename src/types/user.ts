export interface EnrolledUser {
  externalId: string;
  email?: string;
  name?: string;
  signUpTimestamp?: number;
  segment?: string;
  sessionId?: string;
}

export interface InputUserData {
  userId: string;
  name?: string;
  email?: string;
  signUpTimestamp?: number;
  segment?: string;
  sessionId?: string;
}

export interface UserState {
  workspaceId: string;
  userId: string;
  flowsData: FlowsData;
  metadata: Record<string, string>;
  updatedTimestamp: number;
}

export interface FlowsData {
  completedFlowsIds: string[];
  skippedFlowsIds: string[];
  currentFlowId: string;
  currentStepId: string;
  lastSubmittedFlowId: string;
  lastSubmittedFlowTimestamp: number;
}
