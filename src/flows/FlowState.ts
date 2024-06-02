import _ from "lodash";
import { Flow, FlowStep } from "../types/flow";
import {
  getFromLocalStorage,
  setInLocalStorage,
} from "../util/localStorageUtil";
import { track } from "../tracker/tracker";
import { EventType } from "../tracker/types";

export class FlowState {
  private static FLOW_USER_STATE_STORAGE_KEY = "milestoneUserState";
  private readonly storage: Storage;
  private readonly userState: State;
  private readonly enrolledFlow: Flow;
  private readonly stepChildrenMap: { [p: string]: string | undefined };
  private readonly nodesMap: { [p: string]: FlowStep | undefined } = {};

  public constructor(storage: Storage, enrolledFlow: Flow) {
    this.storage = storage;
    this.enrolledFlow = enrolledFlow;

    let sourceNode = enrolledFlow.steps[0];
    this.stepChildrenMap = {};
    for (const step of enrolledFlow.steps) {
      this.nodesMap[step.stepId] = step;

      if (!step.parentNodeId?.length) {
        sourceNode = step;
        continue;
      }
      this.stepChildrenMap[step.parentNodeId] = step.stepId;
    }

    this.userState = {
      currentEnrolledFlowId: enrolledFlow.id,
      currentStepId: sourceNode.stepId,
      finishedSteps: [],
      skipped: false,
    };

    const encodedData = getFromLocalStorage<State>(
      FlowState.FLOW_USER_STATE_STORAGE_KEY,
    );
    if (encodedData && encodedData.currentEnrolledFlowId === enrolledFlow.id) {
      this.userState = encodedData;
    }

    this.commit();
  }

  public static existsInStorage(storage: Storage): boolean {
    return !!storage.getItem(FlowState.FLOW_USER_STATE_STORAGE_KEY);
  }

  public static resetStateInStorage(storage: Storage): void {
    storage.removeItem(FlowState.FLOW_USER_STATE_STORAGE_KEY);
  }

  public isFinished(): boolean {
    return (
      this.userState.currentStepId === null &&
      this.userState.finishedSteps.length === this.enrolledFlow.steps.length
    );
  }

  public getCurrentStep(): FlowStep | null {
    if (!this.userState.currentStepId) {
      return null;
    }

    return this.nodesMap[this.userState.currentStepId] ?? null;
  }

  public getNextStep(): FlowStep | null {
    if (!this.userState.currentStepId) {
      return null;
    }

    const nextStepId = this.stepChildrenMap[this.userState.currentStepId];
    if (!nextStepId) {
      return null;
    }

    return this.nodesMap[nextStepId] ?? null;
  }

  public switchToNextStep(): void {
    if (!this.userState.currentStepId) {
      return;
    }

    track(this.enrolledFlow.id, EventType.FlowStepFinished, {
      stepId: this.userState.currentStepId,
    });
    this.userState.finishedSteps.push([
      this.userState.currentStepId,
      Date.now(),
    ]);

    this.userState.currentStepId = this.getNextStep()?.stepId ?? null;
    this.commit();
  }

  public switchToSkipped() {
    this.userState.currentStepId = null;
    this.userState.skipped = true;
    this.commit();
  }

  public isSkipped(): boolean {
    return this.userState.skipped;
  }

  public destroy(): void {
    console.log("Destroying flow state");
    FlowState.resetStateInStorage(this.storage);
    this.userState.currentStepId = null;
  }

  private commit(): void {
    setInLocalStorage<State>(
      FlowState.FLOW_USER_STATE_STORAGE_KEY,
      this.userState,
    );
  }
}

interface State {
  currentEnrolledFlowId: string;
  currentStepId: string | null;
  finishedSteps: [string, number][];
  skipped: boolean;
}
