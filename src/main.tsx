import { listenFlow } from "./flowPreview.tsx";
import { ApiFlow } from "./api/ApiFlow.ts";
import {
  getEnrolledUserInStorage,
  storeEnrolledUserInStorage,
} from "./service/EnrolledUsersService.ts";
import { TokenStore } from "./service/TokenStore.ts";
import { FlowUserStateService } from "./service/FlowUserStateService.ts";

const showFlow = async (
  token: string,
  externalUserId: string,
  flowId: string,
) => {
  await listenFlow(token, externalUserId, flowId);
};

const listen = async (token: string, externalUserId: string) => {
  let userState = FlowUserStateService.getStateFromStorage(localStorage);
  if (!userState?.currentEnrolledFlowId) {
    userState = await ApiFlow.getUserState(token, externalUserId);
  }
  if (null === userState) {
    return;
  }

  FlowUserStateService.setStateInStorage(localStorage, userState);
  if (FlowUserStateService.getIntervalListenerId(localStorage)) {
    clearInterval(FlowUserStateService.getIntervalListenerId(localStorage));
    FlowUserStateService.removeIntervalListenerId(localStorage);
  }
  const intervalListenerId = setInterval(() => {
    const updatedState = FlowUserStateService.getStateFromStorage(localStorage);
    if (updatedState) {
      ApiFlow.updateUserState(token, externalUserId, updatedState);
    }
  }, 10000);
  FlowUserStateService.setIntervalListenerId(localStorage, intervalListenerId);

  await showFlow(token, externalUserId, userState.currentEnrolledFlowId);
};

const bootstrap = async (
  token: string,
  userData: UserData,
  opts: Partial<FlowClientOpts>,
) => {
  const currentEnrolled = getEnrolledUserInStorage();
  if (currentEnrolled?.userId !== userData.userId) {
    await ApiFlow.enrollUser(token, userData);
    storeEnrolledUserInStorage(userData);
  }

  TokenStore.setToken(token);

  await listen(token, userData.userId);
};

const init = async (
  token: string,
  userData: UserData,
  opts: Partial<FlowClientOpts> = {},
) => {
  try {
    await bootstrap(token, userData, opts);
  } catch (err) {
    console.error("Unexpected error. Check the API Token.");
    FlowUserStateService.removeIntervalListenerId(localStorage);
  }
};

// @ts-expect-error window obj
window.milestoneFlowClient = {
  init,
};

export interface UserData {
  userId: string;
  name?: string;
  email?: string;
  created?: number;
  segment?: string;
}

interface FlowClientOpts {}
