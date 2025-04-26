import { Request, Response, NextFunction } from "express";
import Logger from "../structures/Logger";

const logger = new Logger({ appName: "Router" });

function logRequest(req: Request, res: Response, next: NextFunction) {
  logger.info(`Request path: ${req.path}`);
  next();
}

export default [logRequest];
