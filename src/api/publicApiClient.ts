import { EnrolledUser } from "../types/user.ts";
import { PublicApiBaseUrl } from "./constants.ts";
import { Helper } from "../types/helper.ts";
import { Flow } from "../types/flow.ts";
import { ElementDataEnvelope } from "../tracker/types.ts";

class PublicApiClient {
  private readonly token: string;

  public constructor(token: string) {
    this.token = token;
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
