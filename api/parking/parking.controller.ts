import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { CreatedParking } from "../../interfaces/parking.interface";
import { logger } from "../../services/logger.service";
import { parkingService } from "./parking.service";

async function getParking(req: Request, res: Response) {
  try {
    const parkingId = new ObjectId(req.params.id);
    const parking = await parkingService.getById(parkingId);
    res.status(200).send(parking);
  } catch (err) {
    logger.error("Failed to get parking", err);
    res.status(500).send({ err: "Failed to get parking" });
  }
}

async function getParkings(req: Request, res: Response) {
  try {
    const parkings = await parkingService.query();

    res.status(200).send(parkings);
  } catch (err) {
    console.log(err);
    logger.error("Failed to get parkings", err);
    res.status(500).send({ err: "Failed to get parkings" });
  }
}

async function deleteParking(req: Request, res: Response) {
  try {
    await parkingService.remove(req.params.id);
    res.send({ msg: "Deleted successfully" });
  } catch (err) {
    logger.error("Failed to delete parking", err);
    res.status(500).send({ err: "Failed to delete parking" });
  }
}

async function addParking(req: Request, res: Response) {
  try {
    const parking: CreatedParking = req.body;
    const savedParking = await parkingService.add(parking);
    res.status(200).send(savedParking);
  } catch (err) {
    logger.error("Failed to add parking", err);
    res.status(500).send({ err: "Failed to add parking" });
  }
}

async function updateParking(req: Request, res: Response) {
  try {
    const parking = req.body;
    const savedParking = await parkingService.update(parking);
    res.send(savedParking);
  } catch (err) {
    logger.error("Failed to update parking", err);
    res.status(500).send({ err: "Failed to update parking" });
  }
}

async function parkingAvailability(req: Request, res: Response) {
  try {
    const parkingId = new ObjectId(req.params.id);
    const parking = await parkingService.parkingAvailability(parkingId);
    res.status(200).send(parking);
  } catch (err) {
    logger.error("Failed to get parking", err);
    res.status(500).send({ err: "Failed to get parking" });
  }
}

export const parkingController = {
  getParking,
  getParkings,
  addParking,
  deleteParking,
  updateParking,
  parkingAvailability,
};
