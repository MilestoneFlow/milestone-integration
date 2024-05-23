import { createPublicApiClient } from "./api/publicApiClient.ts";
import { EnrolledUser, InputUserData } from "./types/user.ts";
import { toEnrolledUser } from "./user/enroll.ts";
import listener from "./url/listener.ts";
import { createListener as createHelpersListener } from "./helpers/render.ts";
import * as tracker from "./tracker/tracker.ts";
import { handlePreviewFlow } from "./flows/render.ts";

const bootstrap = async (token: string, user: EnrolledUser) => {
  const publicApiClient = createPublicApiClient(token);

  await publicApiClient.enroll(user);

  const helpersListener = await createHelpersListener(publicApiClient);

  listener([helpersListener]);
  tracker.start(publicApiClient, user.externalId);

  const flow = await publicApiClient.fetchFlowById("6637ff7f9d68d5be54d5ab56");
  await handlePreviewFlow(flow);
};

const init = async (token: string, userData: InputUserData) => {
  try {
    console.log("Initializing Milestone Flow Client");
    await bootstrap(token, toEnrolledUser(userData));
  } catch (err) {
    console.error("Unexpected error. Check the API Token.");
  }
};

if (typeof window !== "undefined") {
  if (
    (window as any).milestoneFlowClient === undefined ||
    (window as any).milestoneFlowClient === null
  ) {
    (window as any).milestoneFlowClient = {};
  }
  (window as any).milestoneFlowClient.init = init;
}
