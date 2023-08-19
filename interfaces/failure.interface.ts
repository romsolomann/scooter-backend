import { ObjectId } from "mongodb";

export enum FailureType {
  ROUTINE_CARE = "routine care",
  BRAKE_REPLACEMENT = "brake replacement",
  WHEEL_REPLACEMENT = "wheel replacement",
}

export enum FailureStatus {
  OPEN = "open",
  CARE = "care",
  CLOSED = "closed",
}

export interface Failure {
  _id: ObjectId;
  type: FailureType;
  status: FailureStatus;
  openingTime: Date;
  closingTime: Date;
  scooterId: ObjectId;
}

export type CreatedFailure = Omit<Failure, "_id">;
