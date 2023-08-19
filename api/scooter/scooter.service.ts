import ScooterModel from "../../models/scooter.model";
import { ObjectId } from "mongodb";
import { logger } from "../../services/logger.service";
import { Geolocation, Polygon } from "../../interfaces/common.interface";
import {
  CreatedScooter,
  Scooter,
  ScooterFilter,
  ScooterStatus,
} from "../../interfaces/scooter.interface";
import { Failure } from "../../interfaces/failure.interface";
import FailureModel from "../../models/failure.model";

async function query(filterBy: ScooterFilter): Promise<Scooter[]> {
  const criteria = _buildCriteria(filterBy);
  try {
    const scooters = await ScooterModel.find(criteria).sort({ _id: -1 });
    return scooters;
  } catch (err) {
    console.log("err", err);
    logger.error("Cannot find scooters", err);
    throw err;
  }
}

async function getById(scooterId: ObjectId): Promise<Scooter> {
  try {
    const scooter = await ScooterModel.findById(scooterId);
    if (!scooter) {
      throw new Error(`Scooter with ID ${scooterId} not found.`);
    }
    return scooter;
  } catch (err) {
    logger.error(`Error finding scooter ${scooterId}`, err);
    throw err;
  }
}

async function remove(scooterId: string): Promise<void> {
  try {
    await ScooterModel.findByIdAndDelete(scooterId);
  } catch (err) {
    logger.error(`Cannot remove scooter ${scooterId}`, err);
    throw err;
  }
}

async function update(scooter: Scooter) {
  try {
    const updatedScooter = await ScooterModel.findByIdAndUpdate(
      scooter._id,
      scooter,
      { new: true } // Return the updated document
    );
    if (!updatedScooter) {
      throw new Error(`Scooter with ID ${scooter._id} not found.`);
    }
    return updatedScooter;
  } catch (err) {
    logger.error(`Cannot update scooter ${scooter._id}`, err);
    throw err;
  }
}

async function add(scooter: CreatedScooter): Promise<Scooter> {
  try {
    const newScooter = new ScooterModel(scooter);
    const savedScooter = await newScooter.save();
    return savedScooter;
  } catch (err) {
    logger.error("Cannot add scooter", err);
    throw err;
  }
}

async function countByParking(
  parkingId: ObjectId,
  parkingLocation: Geolocation
): Promise<number> {
  try {
    const nearbyScooters = await ScooterModel.find({
      parkingId,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parkingLocation.longitude, parkingLocation.latitude],
          },
        },
      },
    });
    const count = nearbyScooters.length;
    return count;
  } catch (err) {
    logger.error(`Error counting scooters at parking ${parkingId}`, err);
    throw err;
  }
}

async function addFailureToScooter(
  scooterId: ObjectId,
  failureId: ObjectId
): Promise<void> {
  try {
    const scooter = await ScooterModel.findById(scooterId);
    if (!scooter) {
      throw new Error(`Scooter with ID ${scooterId} not found.`);
    }
    if (!scooter.failures.includes(failureId)) {
      scooter.failures.push(failureId);
      await scooter.save();
    }
  } catch (err) {
    logger.error(`Error adding failure to scooter ${scooterId}`, err);
    throw err;
  }
}

async function getFailuresForScooter(scooterId: ObjectId): Promise<Failure[]> {
  try {
    const failures = await FailureModel.find({
      scooterId: new ObjectId(scooterId),
    });
    return failures;
  } catch (err) {
    logger.error(`Error finding failures for scooter ${scooterId}`, err);
    throw err;
  }
}

async function getFailureHistoryForScooter(
  scooterId: ObjectId
): Promise<Failure[]> {
  try {
    const scooter = await scooterService.getById(scooterId);
    const failureHistory = await FailureModel.find({
      _id: { $in: scooter.failureHistory },
    });
    return failureHistory;
  } catch (err) {
    logger.error(`Error getting failure history for scooter ${scooterId}`, err);
    throw err;
  }
}

async function removeFailureFromScooter(
  scooterId: ObjectId,
  failureId: ObjectId
): Promise<void> {
  try {
    await ScooterModel.updateOne(
      { _id: scooterId },
      { $pull: { failures: failureId } }
    );
  } catch (err) {
    logger.error(`Error removing failure from scooter ${scooterId}`, err);
    throw err;
  }
}

async function addFailureToHistory(
  scooterId: ObjectId,
  failureId: ObjectId
): Promise<void> {
  try {
    await ScooterModel.updateOne(
      { _id: scooterId },
      { $addToSet: { failureHistory: failureId } }
    );
  } catch (err) {
    logger.error(
      `Error adding failure to history for scooter ${scooterId}`,
      err
    );
    throw err;
  }
}

function _buildCriteria(filterBy: ScooterFilter) {
  const criteria: any = {};

  if (filterBy.polygon) {
    const polygon: Polygon = filterBy.polygon;

    criteria.location = {
      $geoWithin: {
        $geometry: {
          type: "Polygon",
          coordinates: [
            [...polygon.map((point) => [point.longitude, point.latitude])],
          ],
        },
      },
    };
  }
  if (filterBy.status) {
    criteria.status = filterBy.status
      ? ScooterStatus.ACTIVE
      : { $ne: ScooterStatus.ACTIVE };
  }

  return criteria;
}

export const scooterService = {
  query,
  getById,
  remove,
  update,
  add,
  countByParking,
  addFailureToScooter,
  getFailuresForScooter,
  getFailureHistoryForScooter,
  removeFailureFromScooter,
  addFailureToHistory,
};
