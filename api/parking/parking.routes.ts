import express from "express";
import { parkingController } from "./parking.controller";

const router = express.Router();

router.get("/", parkingController.getParkings);
router.get("/:id", parkingController.getParking);
router.post("/", parkingController.addParking);
router.put("/:id", parkingController.updateParking);
router.delete("/:id", parkingController.deleteParking);
router.get("/:id/availability", parkingController.parkingAvailability);

export default router;
