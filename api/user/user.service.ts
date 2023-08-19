import { ObjectId } from "mongodb";
import { CreatedUser } from "../../interfaces/auth.interface";
import { User, UserResponse } from "../../interfaces/user.interface";
import UserModel from "../../models/user.model";
import { logger } from "../../services/logger.service";

async function getUsers(): Promise<UserResponse[]> {
  try {
    const usersDb = await UserModel.find({}, "-password");
    const users = usersDb.map((user) => getUserResponse(user));
    return users;
  } catch (err) {
    logger.error("Cannot find users", err);
    throw err;
  }
}

async function getById(userId: ObjectId): Promise<UserResponse> {
  try {
    const user = await UserModel.findById(userId, "-password");
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return getUserResponse(user);
  } catch (err) {
    logger.error(`Error finding user ${userId}`, err);
    throw err;
  }
}

async function getByUsername(username: string): Promise<User> {
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new Error("User not exists");
    }
    return user;
  } catch (err) {
    logger.error(`Error finding user ${username}`, err);
    throw err;
  }
}

async function remove(userId: string): Promise<void> {
  try {
    await UserModel.findByIdAndDelete(userId);
  } catch (err) {
    logger.error(`Cannot remove user ${userId}`, err);
    throw err;
  }
}

async function update(user: User): Promise<UserResponse> {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      user,
      { new: true } // Return the updated document
    );
    if (!updatedUser) {
      throw new Error(`User with ID ${user._id} not found.`);
    }
    return getUserResponse(updatedUser);
  } catch (err) {
    logger.error(`Cannot update user ${user._id}`, err);
    throw err;
  }
}

async function add(user: CreatedUser): Promise<UserResponse> {
  try {
    const existingUser = await UserModel.findOne({ email: user.email });
    if (existingUser) {
      throw new Error("User already exists.");
    }
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();
    return getUserResponse(savedUser);
  } catch (err) {
    logger.error("Cannot add user", err);
    throw err;
  }
}

function getUserResponse(userData: any): UserResponse {
  return {
    _id: userData._id,
    username: userData.username,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
  };
}

export const userService = {
  getUsers,
  getById,
  getByUsername,
  remove,
  update,
  add,
  getUserResponse,
};
