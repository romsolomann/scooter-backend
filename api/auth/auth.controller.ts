import { Request, Response } from "express";
import { authService } from "./auth.service";
import { logger } from "../../services/logger.service";
import { LoginDetails, CreatedUser } from "../../interfaces/auth.interface";
import { decodeToken } from "../../services/auth.service";
import { userService } from "../user/user.service";

async function login(req: Request, res: Response): Promise<void> {
  const userData: LoginDetails = req.body;
  try {
    const userTokenData = await authService.login(userData);
    const user = decodeToken(userTokenData.token);
    req.session.user = userService.getUserResponse(user);
    res.status(200).json(userTokenData);
  } catch (err) {
    logger.error("Failed to Login " + err);
    res.status(401).send({ err: "Failed to Login" });
  }
}

async function signup(req: Request, res: Response): Promise<void> {
  try {
    const userData: CreatedUser = req.body;
    const { username, firstName, lastName } = userData;
    logger.debug(firstName, lastName + ", " + username);
    const account = await authService.signup(req.body);
    logger.debug(
      `auth.route - new account created: ` + JSON.stringify(account)
    );
    const userTokenData = await authService.login(userData);
    const user = decodeToken(userTokenData.token);
    req.session.user = userService.getUserResponse(user);
    res.status(200).json(userTokenData);
  } catch (err) {
    logger.error("Failed to signup " + err);
    res.status(500).send({ err: "Failed to signup" });
  }
}

async function logout(req: Request, res: Response): Promise<void> {
  try {
    req.session.destroy((err: any) => {
      if (err) {
        logger.error("Failed to destroy session: " + err);
        res.status(500).send({ err: "Failed to logout" });
      } else {
        res.send({ msg: "Logged out successfully" });
      }
    });
  } catch (err) {
    logger.error("Failed to logout: " + err);
    res.status(500).send({ err: "Failed to logout" });
  }
}

export const authController = { login, signup, logout };
