import {
  Failure,
  FailureStatus,
  FailureType,
} from "./../interfaces/failure.interface";
import { model, Schema } from "mongoose";

const failureSchema = new Schema<Failure>({
  type: { type: String, enum: Object.values(FailureType), required: true },
  status: { type: String, enum: Object.values(FailureStatus), required: true },
  openingTime: { type: Date, required: true },
  closingTime: { type: Date },
  scooterId: { type: Schema.Types.ObjectId, ref: "Scooter" },
});

const FailureModel = model<Failure>("Failure", failureSchema);

export default FailureModel;
