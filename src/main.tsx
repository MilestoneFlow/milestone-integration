import { createPublicApiClient } from "./api/publicApiClient";
import { EnrolledUser, InputUserData } from "./types/user";
import { toEnrolledUser } from "./user/enroll";
import { createListener as createHelpersListener } from "./helpers/render";
import * as tracker from "./tracker/tracker";
import * as flowsBootstrap from "./flows/bootstrap";
import { listenUrlChange } from "./url/listener.ts";
import { removeAppContainer } from "./elements/render/functions.ts";

const bootstrap = async (token: string, user: EnrolledUser) => {
  const publicApiClient = createPublicApiClient(token);
  await publicApiClient.validate();

  await publicApiClient.enroll(user);

  const helpersListener = await createHelpersListener(publicApiClient);

  const unsubscribeFromUrlChanges = listenUrlChange([helpersListener]);
  tracker.start(publicApiClient, user.externalId);

  await flowsBootstrap.listener(publicApiClient, user);

  return () => {
    unsubscribeFromUrlChanges();
    flowsBootstrap.stop();
    tracker.stop();
    removeAppContainer(document);
  };
};

const init = async (token: string, userData: InputUserData) => {
  try {
    console.log("Initializing Milestone Flow Client");
    (window as any).milestoneFlowClient.stop = await bootstrap(
      token,
      toEnrolledUser(userData),
    );
    window.dispatchEvent(new Event("MilestoneFlowClientReady"));
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
  (window as any).milestoneFlowClient.stop = undefined;
}

window.addEventListener("MilestoneForceStopEvent", () => {
  if ((window as any).milestoneFlowClient.stop) {
    (window as any).milestoneFlowClient.stop();
  }
});
