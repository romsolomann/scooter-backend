import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import {
  CreatedScooter,
  ScooterFilter,
} from "../../interfaces/scooter.interface";
import { logger } from "../../services/logger.service";
import { scooterService } from "./scooter.service";

async function getScooterById(req: Request, res: Response) {
  try {
    const scooterId = new ObjectId(req.params.id);
    const scooter = await scooterService.getById(scooterId);
    res.status(200).send(scooter);
  } catch (err) {
    logger.error("Failed to get scooter", err);
    res.status(500).send({ err: "Failed to get scooter" });
  }
}

async function getScooters(req: Request, res: Response) {
  try {
    const filterBy: ScooterFilter = req.body;
    const scooters = await scooterService.query(filterBy);

    res.status(200).send(scooters);
  } catch (err) {
    console.log(err);
    logger.error("Failed to get scooters", err);
    res.status(500).send({ err: "Failed to get scooters" });
  }
}

async function deleteScooter(req: Request, res: Response) {
  try {
    await scooterService.remove(req.params.id);
    res.send({ msg: "Deleted successfully" });
  } catch (err) {
    logger.error("Failed to delete scooter", err);
    res.status(500).send({ err: "Failed to delete scooter" });
  }
}

async function addScooter(req: Request, res: Response) {
  try {
    const scooter: CreatedScooter = req.body;
    const savedScooter = await scooterService.add(scooter);
    res.status(200).send(savedScooter);
  } catch (err) {
    logger.error("Failed to add scooter", err);
    res.status(500).send({ err: "Failed to add scooter" });
  }
}

async function updateScooter(req: Request, res: Response) {
  try {
    const scooter = req.body;
    const savedScooter = await scooterService.update(scooter);
    res.send(savedScooter);
  } catch (err) {
    logger.error("Failed to update scooter", err);
    res.status(500).send({ err: "Failed to update scooter" });
  }
}

async function getFailuresForScooter(req: Request, res: Response) {
  try {
    const scooterId = new ObjectId(req.params.id);
    const scooter = await scooterService.getFailuresForScooter(scooterId);
    res.status(200).send(scooter);
  } catch (err) {
    logger.error("Failed to get scooter", err);
    res.status(500).send({ err: "Failed to get scooter" });
  }
}

async function getFailureHistoryForScooter(req: Request, res: Response) {
  try {
    const scooterId = new ObjectId(req.params.id);

    const scooter = await scooterService.getFailureHistoryForScooter(scooterId);
    res.status(200).send(scooter);
  } catch (err) {
    logger.error("Failed to get scooter", err);
    res.status(500).send({ err: "Failed to get scooter" });
  }
}

export const scooterController = {
  getScooterById,
  getScooters,
  addScooter,
  deleteScooter,
  updateScooter,
  getFailuresForScooter,
  getFailureHistoryForScooter,
};
