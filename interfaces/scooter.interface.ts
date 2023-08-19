import { ObjectId } from "mongodb";
import { Geolocation, Polygon } from "./common.interface";

export interface Scooter {
  _id: ObjectId;
  currentLocation: Geolocation;
  model: string;
  yearOfManufacture: number;
  status: ScooterStatus;
  failures: ObjectId[];
  failureHistory: ObjectId[];
}

export enum ScooterStatus {
  ACTIVE = "active",
  BROKEN = "broken",
  HANDLED = "handled",
  CHARGED = "charged",
}

export type CreatedScooter = Omit<Scooter, "_id">;

export interface ScooterFilter {
  polygon: Polygon;
  status: ScooterStatus;
}
