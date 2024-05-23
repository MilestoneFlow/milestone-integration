export interface EnrolledUser {
  externalId: string;
  email?: string;
  name?: string;
  signUpTimestamp?: number;
  segment?: string;
  sessionId?: string;
}

export interface InputUserData {
  userId: string;
  name?: string;
  email?: string;
  signUpTimestamp?: number;
  segment?: string;
  sessionId?: string;
}
