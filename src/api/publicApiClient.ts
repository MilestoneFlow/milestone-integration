import { EnrolledUser, UserState } from "../types/user";
import { PublicApiBaseUrl } from "./constants";
import { Helper } from "../types/helper";
import { Flow } from "../types/flow";
import { ElementDataEnvelope } from "../tracker/types";

class PublicApiClient {
  private readonly token: string;

  public constructor(token: string) {
    this.token = token;
  }

  public async validate(): Promise<void> {
    const res = await fetch(this.getURL("/validate"), {
      method: "GET",
      headers: await this.getHeaders(),
    });
    if (res.status !== 200) {
      throw new Error("Invalid token");
    }
  }

  public async enroll(user: EnrolledUser): Promise<void> {
    await fetch(this.getURL("/enroll"), {
      method: "POST",
      headers: await this.getHeaders(),
      body: JSON.stringify(user),
    });
  }

  public async fetchHelpers(): Promise<Helper[]> {
    const res = await fetch(this.getURL("/helpers"), {
      method: "GET",
      headers: await this.getHeaders(),
    }).then((res) => res.json());

    return res;
  }

  public async fetchFlowById(flowId: string): Promise<Flow> {
    const res = await fetch(this.getURL(`/flows/${flowId}`), {
      method: "GET",
      headers: await this.getHeaders(),
    }).then((res) => res.json());

    return res;
  }

  public async enrollInFlow(externalUserId: string): Promise<Flow | null> {
    const res = await fetch(this.getURL(`/${externalUserId}/flows/enroll`), {
      method: "POST",
      headers: await this.getHeaders(),
    }).then((res) => res.json());

    return res;
  }

  public async sendTrackingData(
    externalUserId: string,
    data: ElementDataEnvelope[],
  ): Promise<void> {
    await fetch(this.getURL("/track"), {
      method: "POST",
      headers: await this.getHeaders(),
      body: JSON.stringify({ externalUserId, data }),
    });
  }

  public async updateFlowState(
    externalUserId: string,
    data: Partial<FlowStateUpdateRequest>,
  ): Promise<void> {
    await fetch(this.getURL(`/${externalUserId}/flows/state`), {
      method: "POST",
      headers: await this.getHeaders(),
      body: JSON.stringify({ ...data }),
    });
  }

  private async getHeaders(): Promise<Record<string, string>> {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  private getURL(path: string) {
    return `${PublicApiBaseUrl}/public${path}`;
  }
}

export const createPublicApiClient = (token: string) =>
  new PublicApiClient(token);

export type { PublicApiClient };

export interface FlowStateUpdateRequest {
  flowId: string;
  currentStepId: string;
  finished: boolean;
  skipped: boolean;
}
