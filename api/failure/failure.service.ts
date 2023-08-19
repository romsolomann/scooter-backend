import {
  CreatedFailure,
  Failure,
  FailureStatus,
} from "../../interfaces/failure.interface";
import { logger } from "../../services/logger.service";
import FailureModel from "../../models/failure.model";
import { scooterService } from "../scooter/scooter.service";
import { ObjectId } from "mongodb";

async function query(): Promise<Failure[]> {
  try {
    const failures = await FailureModel.find();
    return failures;
  } catch (err) {
    console.log("err", err);
    logger.error("Cannot find failures", err);
    throw err;
  }
}

async function getById(failureId: ObjectId): Promise<Failure> {
  try {
    const failure = await FailureModel.findById(failureId);
    if (!failure) {
      throw new Error(`Failure with ID ${failureId} not found.`);
    }
    return failure;
  } catch (err) {
    logger.error(`Error finding failure ${failureId}`, err);
    throw err;
  }
}

async function remove(failureId: string): Promise<void> {
  try {
    await FailureModel.findByIdAndDelete(failureId);
  } catch (err) {
    logger.error(`Cannot remove failure ${failureId}`, err);
    throw err;
  }
}

async function update(failure: Failure) {
  try {
    const updatedFailure = await FailureModel.findByIdAndUpdate(
      failure._id,
      failure,
      { new: true }
    );
    if (!updatedFailure) {
      throw new Error(`Failure with ID ${failure._id} not found.`);
    }
    return updatedFailure;
  } catch (err) {
    logger.error(`Cannot update failure ${failure._id}`, err);
    throw err;
  }
}

async function add(
  failure: CreatedFailure,
  scooterId: ObjectId
): Promise<Failure> {
  try {
    const newFailure = new FailureModel({ ...failure, scooterId });
    const savedFailure = await newFailure.save();

    await scooterService.addFailureToScooter(scooterId, savedFailure._id);

    return savedFailure;
  } catch (err) {
    logger.error("Cannot add failure", err);
    throw err;
  }
}

async function closeFailure(
  failureId: ObjectId,
  scooterId: ObjectId
): Promise<Failure> {
  try {
    const failure = await failureService.getById(failureId);
    failure.status = FailureStatus.CLOSED;
    failure.closingTime = new Date();
    await failureService.update(failure);

    await scooterService.removeFailureFromScooter(scooterId, failureId);

    await scooterService.addFailureToHistory(scooterId, failureId);
    return failure;
  } catch (err) {
    logger.error(`Error closing failure ${failureId}`, err);
    throw err;
  }
}

export const failureService = {
  query,
  getById,
  remove,
  update,
  add,
  closeFailure,
};
