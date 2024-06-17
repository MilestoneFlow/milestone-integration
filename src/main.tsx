import { createPublicApiClient } from "./api/publicApiClient";
import { EnrolledUser, InputUserData } from "./types/user";
import { toEnrolledUser } from "./user/enroll";
import { createListener as createHelpersListener } from "./helpers/render";
import * as tracker from "./tracker/tracker";
import * as flowsBootstrap from "./flows/bootstrap";
import { listenUrlChange } from "./url/listener.ts";
import { removeAppContainer } from "./elements/render/functions.ts";

export const flowsCacheKey = "demoFlowsState";

const bootstrap = async (token: string, user: EnrolledUser) => {
  localStorage.removeItem(flowsCacheKey);
  await flowsBootstrap.listener(user);

  return () => {
    flowsBootstrap.stop();
    tracker.stop();
    removeAppContainer(document);
  };
};

const init = async (token: string, userData: InputUserData) => {
  try {
    console.log("Initializing Milestone Flow Client");
    await bootstrap(token, toEnrolledUser(userData));
  } catch (err) {
    console.error(err);
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
