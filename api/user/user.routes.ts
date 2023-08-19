import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);

export default router;
