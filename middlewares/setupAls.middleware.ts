import { Request, Response, NextFunction } from "express";
import { AsyncLocalStorage } from "async_hooks";
import { ObjectId } from "mongodb";

const asyncLocalStorage = new AsyncLocalStorage();

async function setupAsyncLocalStorage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const storage = {};
  asyncLocalStorage.run(storage, () => {
    if (req.sessionID) {
      const alsStore = asyncLocalStorage.getStore() as {
        sessionId?: string;
        userId?: ObjectId;
      };
      alsStore.sessionId = req.sessionID;
      if (req.session.user) {
        alsStore.userId = req.session.user._id;
      }
    }
    next();
  });
}

export { setupAsyncLocalStorage };
