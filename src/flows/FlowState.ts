import _ from "lodash";
import { Flow, FlowStep } from "../types/flow.ts";
import {
  getFromLocalStorage,
  setInLocalStorage,
} from "../util/localStorageUtil.ts";
import { track } from "../tracker/tracker.ts";
import { EventType } from "../tracker/types.ts";

export class FlowState {
  private static FLOW_USER_STATE_STORAGE_KEY = "milestoneUserState";
  private readonly storage: Storage;
  private readonly userState: State;
  private readonly enrolledFlow: Flow;
  private readonly stepChildrenMap: { [p: string]: string | undefined };
  private readonly nodesMap: { [p: string]: FlowStep | undefined } = {};
  private finishEffectsInProgress: boolean = false;

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
    };

    const encodedData = getFromLocalStorage<State>(
      FlowState.FLOW_USER_STATE_STORAGE_KEY,
    );
    if (encodedData && encodedData.currentEnrolledFlowId === enrolledFlow.id) {
      this.userState = encodedData;
    }

    this.commit();
  }

  public static resetStateInStorage(storage: Storage): void {
    storage.removeItem(FlowState.FLOW_USER_STATE_STORAGE_KEY);
  }

  public getUserState(): State {
    return _.cloneDeep<State>(this.userState);
  }

  public getEnrolledFlowId(): string | null {
    return this.userState.currentEnrolledFlowId;
  }

  public isFinished(): boolean {
    return (
      this.userState.currentStepId === null &&
      this.userState.finishedSteps.length === this.enrolledFlow.steps.length
    );
  }

  public handleFinish(): void {
    if (!this.isFinished()) {
      throw Error("You cannot finish a flow that is not finished");
    }

    this.finishEffectsInProgress = true;
  }

  public isFinishEffectsInProgress(): boolean {
    return this.finishEffectsInProgress;
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

  public destroy(): void {
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
}
