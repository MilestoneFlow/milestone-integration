import { MilestoneFlowElementWrapperId } from "./render/constants";

export const getElementWrapper = () => {
  const el = document.getElementById(MilestoneFlowElementWrapperId);

  return el;
};
