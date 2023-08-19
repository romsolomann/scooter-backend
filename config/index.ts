import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV === "prod" ? "prod" : "dev"}` });

export const { DB_URL, SECRET_KEY, PORT, MODE_ENV } = process.env;
