import { Store } from "express-session";

export type CustomStore = Store & { sessionId: string };
