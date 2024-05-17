import { Flow } from "../types/flowTypes";
import { UserData } from "../main.tsx";
import {
  FlowStepTime,
  FlowUserState,
} from "../service/FlowUserStateService.ts";

export class ApiFlow {
  // private static ApiBaseUrl = "http://localhost:3333"; // LOCAL
  private static ApiBaseUrl = "https://core.milestoneflow.io"; // PROD

  public static async fetchById(token: string, flowId: string): Promise<Flow> {
    const url = `${ApiFlow.ApiBaseUrl}/public/${flowId}`;
    const flow = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
    return flow;
  }

  public static async enrollUser(
    token: string,
    userData: UserData,
  ): Promise<Flow> {
    const url = `${ApiFlow.ApiBaseUrl}/public/enroll`;
    const flow = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        externalId: userData.userId,
        name: userData.name,
        email: userData.email,
        signUpTimestamp: userData.created,
        segment: userData.segment,
      }),
    }).then((res) => res.json());
    return flow;
  }

  public static async getUserState(
    token: string,
    userId: string,
  ): Promise<FlowUserState | null> {
    const url = `${ApiFlow.ApiBaseUrl}/public/${userId}/state`;
    const userState = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
    return userState;
  }

  public static async updateUserState(
    token: string,
    userId: string,
    userState: FlowUserState,
  ): Promise<void> {
    const url = `${ApiFlow.ApiBaseUrl}/public/${userId}/state`;
    await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentEnrolledFlowId: userState.currentEnrolledFlowId,
        currentStepId: userState.currentStepId,
        times: userState.times,
      }),
    }).then((res) => res.json());
  }
}

interface InputEnrolledUser {
  externalId: string;
  name?: string;
  email?: string;
  signUpTimestamp?: number;
  segment?: string;
}
