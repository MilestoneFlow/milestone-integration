import { MilestoneFlowElementWrapperId } from "../render/constants.ts";

export const getElementWrapper = () => {
  const el = document.getElementById(MilestoneFlowElementWrapperId);

  return el;
};
