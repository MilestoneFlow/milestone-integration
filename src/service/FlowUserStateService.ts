import _ from "lodash";
import { Flow, FlowStep } from "../types/flowTypes.ts";
import { getFlowSetup } from "./FlowService.ts";
import { decode, encode } from "./localStorageHelper.ts";
import { ApiFlow } from "../api/ApiFlow.ts";
import { TokenStore } from "./TokenStore.ts";

export class FlowUserStateService {
  private static FLOW_USER_STATE_STORAGE_KEY = "milestoneUserState";
  private readonly storage: Storage;
  private readonly userState: FlowUserState;
  private readonly enrolledFlow: Flow;
  private readonly stepsAdjList: { [p: string]: FlowStep[] } = {};
  private readonly nodesMap: { [p: string]: FlowStep | undefined } = {};

  public constructor(
    storage: Storage,
    enrolledFlow: Flow,
    userId: string | undefined = undefined,
  ) {
    this.storage = storage;
    this.enrolledFlow = enrolledFlow;

    const { parentList, sourceNode } = getFlowSetup(this.enrolledFlow);
    this.stepsAdjList = parentList;

    for (const step of this.enrolledFlow.steps) {
      this.nodesMap[step.stepId] = step;
    }

    this.userState = {
      userId: userId ? userId : `mockuser_${Date.now()}`,
      currentEnrolledFlowId: enrolledFlow.id,
      currentStepId: sourceNode.stepId,
      times: [],
    };
    const encodedData = this.storage.getItem(
      FlowUserStateService.FLOW_USER_STATE_STORAGE_KEY,
    );
    if (encodedData) {
      const decodedState = decode(encodedData);
      if (decodedState.currentEnrolledFlowId === enrolledFlow.id) {
        this.userState = decodedState;
      }
    }

    this.commit();
  }

  public static resetStateInStorage(storage: Storage): void {
    storage.removeItem(FlowUserStateService.FLOW_USER_STATE_STORAGE_KEY);
  }
  public static getStateFromStorage(storage: Storage): FlowUserState | null {
    return decode(
      storage.getItem(FlowUserStateService.FLOW_USER_STATE_STORAGE_KEY),
    );
  }

  public static setStateInStorage(
    storage: Storage,
    userState: FlowUserState,
  ): void {
    storage.setItem(
      FlowUserStateService.FLOW_USER_STATE_STORAGE_KEY,
      encode(userState),
    );
  }

  public static getIntervalListenerId(storage: Storage): any {
    return decode(storage.getItem("MilestoneStateIntervalListenerId"));
  }

  public static setIntervalListenerId(storage: Storage, id: any): void {
    storage.setItem("MilestoneStateIntervalListenerId", encode(id));
  }

  public static removeIntervalListenerId(storage: Storage): void {
    const id = FlowUserStateService.getIntervalListenerId(storage);
    if (id) {
      clearInterval(id);
    }

    storage.removeItem("MilestoneStateIntervalListenerId");
  }

  public getUserState(): FlowUserState {
    return _.cloneDeep<FlowUserState>(this.userState);
  }

  public getEnrolledFlowId(): string | null {
    return this.userState.currentEnrolledFlowId;
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

    return this.stepsAdjList[this.userState.currentStepId]?.[0] ?? null;
  }

  public switchToNextStep(): void {
    if (!this.userState.currentStepId) {
      return;
    }

    this.userState.currentStepId =
      this.stepsAdjList[this.userState.currentStepId]?.[0]?.stepId ?? null;
    this.commit();
  }

  public startTimer(): void {
    if (!this.userState.currentStepId) {
      throw Error("You cannot start timer for an non-existent step");
    }

    if (
      this.userState.times.filter(
        (time) => time.stepId === this.userState.currentStepId,
      ).length > 0
    ) {
      return;
    }

    this.userState.times.push({
      stepId: this.userState.currentStepId,
      startTimestamp: Date.now(),
      endTimestamp: -1,
    });
    this.commit();
  }

  public endTimer(): void {
    if (!this.userState.currentStepId) {
      throw Error("You cannot end timer for an non-existent step");
    }

    for (let i = 0; i < this.userState.times.length; ++i) {
      if (this.userState.times[i].stepId === this.userState.currentStepId) {
        if (this.userState.times[i].endTimestamp !== -1) {
          throw Error("You cannot end a timer already closed.");
        }

        this.userState.times[i].endTimestamp = Date.now();
        this.commit();

        return;
      }
    }

    throw Error(
      `Timer for the current step ${this.userState.currentStepId} not found`,
    );
  }

  public async destroy(): Promise<void> {
    this.debugFinal();
    await ApiFlow.updateUserState(
      TokenStore.getToken(),
      this.userState.userId,
      this.userState,
    );

    FlowUserStateService.resetStateInStorage(this.storage);
    this.userState.currentStepId = null;
  }

  private commit(): void {
    this.userState.timestamp = Date.now();
    this.storage.setItem(
      FlowUserStateService.FLOW_USER_STATE_STORAGE_KEY,
      encode(this.userState),
    );
  }

  private debugFinal(): void {
    const userStateFinal = _.cloneDeep(this.userState);
    const log = {
      log: "User State Final Log",
      state: userStateFinal,
      analytics: [] as string[],
    };

    for (const timeObj of userStateFinal.times) {
      log.analytics.push(
        `user spent ${(timeObj.endTimestamp - timeObj.startTimestamp) / 1000} seconds on step ${
          timeObj.stepId
        }`,
      );
    }
  }
}

export interface FlowUserState {
  userId: string;
  currentEnrolledFlowId: string;
  currentStepId: string | null;
  times: FlowStepTime[];
  timestamp?: number;
}

export interface FlowStepTime {
  stepId: string;
  startTimestamp: number;
  endTimestamp: number;
}
