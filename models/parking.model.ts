import { Parking } from "./../interfaces/parking.interface";
import { model, Schema } from "mongoose";

const parkingSchema = new Schema<Parking>({
  address: {
    street: {
      name: { type: String, required: true },
      number: { type: Number },
    },
    city: { type: String, required: true },
  },
  numberOfScooters: { type: Number, required: true },
  location: {
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    required: true,
  },
});

const ParkingModel = model<Parking>("Parking", parkingSchema);

export default ParkingModel;
