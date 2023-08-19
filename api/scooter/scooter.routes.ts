import express from "express";
import { scooterController } from "./scooter.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = express.Router();

// router.use(requireAuth);

router.post("/query", scooterController.getScooters);
router.get("/:id", scooterController.getScooterById);
router.post("/", scooterController.addScooter);
router.put("/:id", scooterController.updateScooter);
router.delete("/:id", scooterController.deleteScooter);

router.get("/:id/opened-failures", scooterController.getFailuresForScooter);
router.get(
  "/:id/history-failures",
  scooterController.getFailureHistoryForScooter
);

export default router;
