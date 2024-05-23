import {
  getFromLocalStorage,
  setInLocalStorage,
} from "../util/localStorageUtil.ts";
import { EnrolledUser, InputUserData } from "../types/user.ts";

const EnrolledUserKey = "milestoneEnrolledUser";

export function getEnrolledUserInStorage(): EnrolledUser | null {
  return getFromLocalStorage<EnrolledUser>(EnrolledUserKey);
}

export function storeEnrolledUserInStorage(user: EnrolledUser) {
  setInLocalStorage<EnrolledUser>(EnrolledUserKey, user);
}

export function toEnrolledUser(input: InputUserData): EnrolledUser {
  return {
    externalId: input.userId,
    email: input.email,
    name: input.name,
    signUpTimestamp: input.signUpTimestamp,
    segment: input.segment,
    sessionId: input.sessionId,
  };
}
