import { Scooter, ScooterStatus } from "./../interfaces/scooter.interface";
import { Schema, model } from "mongoose";

const scooterSchema = new Schema<Scooter>({
  currentLocation: {
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    required: true,
  },
  model: { type: String, required: true },
  yearOfManufacture: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(ScooterStatus),
    required: true,
  },
  failures: [{ type: Schema.Types.ObjectId, ref: "Failure" }],
  failureHistory: [{ type: Schema.Types.ObjectId, ref: "Failure" }],
});

const ScooterModel = model<Scooter>("Scooter", scooterSchema);

export default ScooterModel;
