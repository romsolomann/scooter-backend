import express from "express";
import { failureController } from "./failure.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = express.Router();

// router.use(requireAuth);

router.get("/", failureController.getFailures);
router.get("/:id", failureController.getFailure);
router.post("/:scooterId", failureController.addFailure);
router.put("/:id", failureController.updateFailure);
router.delete("/:id", failureController.deleteFailure);
router.put("/:failureId/close/:scooterId", failureController.closeFailure);

export default router;
