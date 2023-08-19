import { User } from "./../../interfaces/user.interface";
import {
  LoginDetails,
  CreatedUser,
  TokenData,
} from "./../../interfaces/auth.interface";
import bcrypt from "bcrypt";
import { userService } from "../user/user.service";
import { logger } from "../../services/logger.service";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "../../config";

const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7;

async function login(userData: LoginDetails): Promise<TokenData> {
  const { username, password } = userData;
  logger.debug(`auth.service - login with username: ${username}`);

  const user = await userService.getByUsername(username);
  if (!user) return Promise.reject("Invalid username or password");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return Promise.reject("Invalid username or password");

  return _createToken(user);
}

async function signup(userData: CreatedUser): Promise<TokenData> {
  const saltRounds = 10;

  const { username, password, firstName, lastName, email } = userData;

  logger.debug(
    `auth.service - signup with username: ${username}, fullname: ${firstName} ${lastName}`
  );
  if (!username || !password || !firstName || !lastName)
    return Promise.reject("fullname, username and password are required!");

  const hash = await bcrypt.hash(password, saltRounds);
  const user = await userService.add({
    username,
    password: hash,
    firstName,
    lastName,
    email,
  });

  return _createToken({ ...user, password });
}

function _createToken(user: User): TokenData {
  const userToSave = userService.getUserResponse(user);
  const secretKey: string = SECRET_KEY!;
  const expiresIn: number = SEVEN_DAYS_IN_SECONDS;

  return {
    expiresIn,
    token: sign(userToSave, secretKey, { expiresIn }),
  };
}

export const authService = { signup, login };
