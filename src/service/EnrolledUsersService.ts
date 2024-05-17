import { UserData } from "../main.tsx";
import { decode, encode } from "./localStorageHelper.ts";

export const MilestoneEnrolledUserId = "MilestoneEnrolledUserId";

export const storeEnrolledUserInStorage = (userData: UserData) => {
  localStorage.setItem(MilestoneEnrolledUserId, encode(userData));
};

export const getEnrolledUserInStorage = (): UserData | null => {
  return decode(localStorage.getItem(MilestoneEnrolledUserId));
};
