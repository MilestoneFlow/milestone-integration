import {
  MilestoneFlowElementWrapperId,
  MilestoneHotspotId,
  MilestoneHotspotStyleId,
} from "./constants.ts";

export const waitForElm = (selector: string): Promise<Element | null> => {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};

export const removeElementWrapper = (document: Document) => {
  const elementWrapper = document.getElementById(MilestoneFlowElementWrapperId);
  const hotspotWrapperStyle = document.getElementById(MilestoneHotspotStyleId);
  const hotspotWrapper = document.getElementById(MilestoneHotspotId);

  elementWrapper?.remove();
  hotspotWrapper?.remove();
  hotspotWrapperStyle?.remove();
};

const AppContainerElementId = "milestone-app-container";
const createAppContainer = (document: Document): HTMLElement => {
  const appContainer = document.createElement("div");
  appContainer.id = AppContainerElementId;
  document.body.appendChild(appContainer);

  return appContainer;
};

const getAppContainer = (document: Document): HTMLElement | null => {
  return document.getElementById(AppContainerElementId);
};

export const getOrCreateAppContainer = (document: Document): HTMLElement => {
  let appContainer = getAppContainer(document);
  if (!appContainer) {
    appContainer = createAppContainer(document);
  }

  return appContainer;
};

export const removeAppContainer = (document: Document) => {
  const appContainer = document.getElementById(AppContainerElementId);
  appContainer?.remove();
};

export const removeFromAppContainer = (
  document: Document,
  elementId: string,
) => {
  const appContainer = getAppContainer(document);
  if (!appContainer) {
    return;
  }

  appContainer.querySelector(`#${elementId}`)?.remove();
};
