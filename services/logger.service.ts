import { CustomStore } from "./../interfaces/als.interface";
import fs from "fs";
import asyncLocalStorage from "./als.service";

const logsDir = "./logs";
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

function getTime(): string {
  const now = new Date();
  return now.toLocaleString();
}

function isError(e: any): boolean {
  return e && e.stack && e.message;
}

function doLog(level: string, ...args: any[]): void {
  console.log("LOGGER:", args);
  const strs = args.map((arg) =>
    typeof arg === "string" ? arg : isError(arg) ? arg : JSON.stringify(arg)
  );

  let line = strs.join(" | ");
  const store = asyncLocalStorage.getStore() as CustomStore;
  const sessionId = store?.sessionId;
  const sid = sessionId ? `(sid: ${sessionId})` : "";
  line = `${getTime()} - ${level} - ${line} ${sid}\n`;
  console.log(line);
  fs.appendFileSync("./logs/backend.log", line);
}

export const logger = {
  debug(...args: any[]): void {
    // if (process.env.NODE_ENV === 'production') return;
    doLog("DEBUG", ...args);
  },
  info(...args: any[]): void {
    doLog("INFO", ...args);
  },
  warn(...args: any[]): void {
    doLog("WARN", ...args);
  },
  error(...args: any[]): void {
    doLog("ERROR", ...args);
  },
};
