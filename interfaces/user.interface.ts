import { ObjectId } from "mongodb";

export interface User {
  _id: ObjectId;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type UserResponse = Omit<User, "password">;
