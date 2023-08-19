import { User } from "./user.interface";

export type CreatedUser = Omit<User, "_id">;

export type LoginDetails = Pick<User, "username" | "password">;

export interface TokenData {
  token: string;
  expiresIn: number;
}
