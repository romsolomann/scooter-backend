import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { CreatedFailure } from "../../interfaces/failure.interface";
import { logger } from "../../services/logger.service";
import { failureService } from "./failure.service";

async function getFailure(req: Request, res: Response) {
  try {
    const failureId = new ObjectId(req.params.id);
    const failure = await failureService.getById(failureId);
    res.status(200).send(failure);
  } catch (err) {
    logger.error("Failed to get failure", err);
    res.status(500).send({ err: "Failed to get failure" });
  }
}

async function getFailures(req: Request, res: Response) {
  try {
    const failures = await failureService.query();

    res.status(200).send(failures);
  } catch (err) {
    console.log(err);
    logger.error("Failed to get failures", err);
    res.status(500).send({ err: "Failed to get failures" });
  }
}

async function deleteFailure(req: Request, res: Response) {
  try {
    await failureService.remove(req.params.id);
    res.send({ msg: "Deleted successfully" });
  } catch (err) {
    logger.error("Failed to delete failure", err);
    res.status(500).send({ err: "Failed to delete failure" });
  }
}

async function addFailure(req: Request, res: Response) {
  try {
    const scooterId = new ObjectId(req.params.scooterId);
    const failure: CreatedFailure = req.body;
    const savedFailure = await failureService.add(failure, scooterId);
    res.status(200).send(savedFailure);
  } catch (err) {
    logger.error("Failed to add failure", err);
    res.status(500).send({ err: "Failed to add failure" });
  }
}

async function updateFailure(req: Request, res: Response) {
  try {
    const failure = req.body;
    const savedFailure = await failureService.update(failure);
    res.send(savedFailure);
  } catch (err) {
    logger.error("Failed to update failure", err);
    res.status(500).send({ err: "Failed to update failure" });
  }
}

async function closeFailure(req: Request, res: Response) {
  try {
    const failureId = new ObjectId(req.params.failureId);
    const scooterId = new ObjectId(req.params.scooterId);
    const savedFailure = await failureService.closeFailure(
      failureId,
      scooterId
    );
    res.send(savedFailure);
  } catch (err) {
    logger.error("Failed to update failure", err);
    res.status(500).send({ err: "Failed to update failure" });
  }
}

export const failureController = {
  getFailure,
  getFailures,
  addFailure,
  deleteFailure,
  updateFailure,
  closeFailure,
};
