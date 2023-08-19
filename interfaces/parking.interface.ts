import { ObjectId } from "mongodb";
import { Address, Geolocation } from "./common.interface";

export interface Parking {
  _id: ObjectId;
  address: Address;
  numberOfScooters: number;
  location: Geolocation;
}

export type CreatedParking = Omit<Parking, "_id">;
