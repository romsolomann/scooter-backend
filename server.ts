import { logger } from "./services/logger.service";
import express, { Express } from "express";
import cors from "cors";
import path from "path";
import expressSession from "express-session";
import http from "http";
import authRoutes from "./api/auth/auth.routes";
import userRoutes from "./api/user/user.routes";
import scooterRoutes from "./api/scooter/scooter.routes";
import failureRoutes from "./api/failure/failure.routes";
import parkingRoutes from "./api/parking/parking.routes";
import { setupAsyncLocalStorage } from "./middlewares/setupAls.middleware";
import { Request, Response } from "express";
import { UserResponse } from "./interfaces/user.interface";
import { config } from "dotenv";
import mongoose from "mongoose";
import { DB_URL } from "./config";

declare module "express-session" {
  interface SessionData {
    connectedAt?: number;
    user: UserResponse;
  }
}

const app: Express = express();
const server: http.Server = http.createServer(app);

config({ path: `${__dirname}/.env` });

mongoose.connect(DB_URL!, { dbName: "scooter_db" });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database!");
});

const session = expressSession({
  secret: "coding is amazing",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});

app.use(express.json());
app.use(session);

if (process.env.NODE_ENV === "production") {
  const corsOptions = {
    origin: ["https://scooter-frontend.vercel.app"],
    credentials: true,
  };
  app.use(cors(corsOptions));
} else {
  const corsOptions = {
    origin: [
      "http://127.0.0.1:8080",
      "http://localhost:8080",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
    ],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

app.all("*", setupAsyncLocalStorage);

app.get("/api/setup-session", (req: Request, res: Response) => {
  req.session.connectedAt = Date.now();
  console.log("setup-session:", req.sessionID);
  res.end();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/scooters", scooterRoutes);
app.use("/api/failures", failureRoutes);
app.use("/api/parkings", parkingRoutes);

// app.get("/**", (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

const port: number = +process.env.PORT! || 3030;
server.listen(port, () => {
  logger.info("Server is running on port: " + port);
});

console.log("I am Here!, am I?");
