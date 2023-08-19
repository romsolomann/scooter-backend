import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { User } from "../../interfaces/user.interface";
import { logger } from "../../services/logger.service";
import { userService } from "./user.service";

async function getUsers(req: Request, res: Response) {
  try {
    const users = await userService.getUsers();
    res.status(200).send(users);
  } catch (err) {
    logger.error("Failed to get users", err);
    res.status(500).send({ err: "Failed to get users" });
  }
}

async function getUserById(req: Request, res: Response) {
  try {
    const userId = new ObjectId(req.params.id);
    const user = await userService.getById(userId);
    res.status(200).send(user);
  } catch (err) {
    logger.error("Failed to get user", err);
    res.status(500).send({ err: "Failed to get user" });
  }
}

async function deleteUser(req: Request, res: Response) {
  try {
    await userService.remove(req.params.id);
    res.send({ msg: "Deleted successfully" });
  } catch (err) {
    logger.error("Failed to delete user", err);
    res.status(500).send({ err: "Failed to delete user" });
  }
}

async function updateUser(req: Request, res: Response) {
  try {
    const user: User = req.body;
    const savedUser = await userService.update(user);
    res.status(200).send(savedUser);
  } catch (err) {
    logger.error("Failed to update user", err);
    res.status(500).send({ err: "Failed to update user" });
  }
}

export const userController = {
  getUserById,
  getUsers,
  deleteUser,
  updateUser,
};
