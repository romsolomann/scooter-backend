import { ObjectId } from "mongodb";
import { CreatedParking, Parking } from "../../interfaces/parking.interface";
import { scooterService } from "../scooter/scooter.service";
import ParkingModel from "../../models/parking.model";
import { logger } from "../../services/logger.service";

async function query(): Promise<Parking[]> {
  try {
    const parkings = await ParkingModel.find();
    return parkings;
  } catch (err) {
    console.log("err", err);
    logger.error("Cannot find parkings", err);
    throw err;
  }
}

async function getById(parkingId: ObjectId): Promise<Parking> {
  try {
    const parking = await ParkingModel.findById(parkingId);
    if (!parking) {
      throw new Error(`Parking spot with ID ${parkingId} not found.`);
    }
    return parking;
  } catch (err) {
    logger.error(`Error finding parking ${parkingId}`, err);
    throw err;
  }
}

async function remove(parkingId: string): Promise<void> {
  try {
    await ParkingModel.findByIdAndDelete(parkingId);
  } catch (err) {
    logger.error(`Cannot remove parking ${parkingId}`, err);
    throw err;
  }
}

async function update(parking: Parking) {
  try {
    const updatedParking = await ParkingModel.findByIdAndUpdate(
      parking._id,
      parking,
      { new: true }
    );
    if (!updatedParking) {
      throw new Error(`Parking spot with ID ${parking._id} not found.`);
    }
    return updatedParking;
  } catch (err) {
    logger.error(`Cannot update parking ${parking._id}`, err);
    throw err;
  }
}

async function add(parking: CreatedParking): Promise<Parking> {
  try {
    const newParking = new ParkingModel(parking);
    const savedParking = await newParking.save();
    return savedParking;
  } catch (err) {
    logger.error("Cannot add parking", err);
    throw err;
  }
}

async function parkingAvailability(parkingId: ObjectId): Promise<number> {
  try {
    const parking = await ParkingModel.findById(parkingId);
    if (!parking) {
      throw new Error(`Parking spot with ID ${parkingId} not found.`);
    }

    const numParkedScooters = await scooterService.countByParking(
      parking._id,
      parking.location
    );
    const availableSpaces = parking.numberOfScooters - numParkedScooters;

    return availableSpaces;
  } catch (err) {
    logger.error(`Error finding parking ${parkingId}`, err);
    throw err;
  }
}

export const parkingService = {
  query,
  getById,
  remove,
  update,
  add,
  parkingAvailability,
};
