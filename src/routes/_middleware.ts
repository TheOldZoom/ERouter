import { Request, Response, NextFunction } from "express";
import Logger from "../structures/Logger";

const logger = new Logger({ appName: "Router" });

const sensitiveFields = ["password"];

function maskSensitiveData(data: any) {
  if (typeof data === "object" && data !== null) {
    Object.keys(data).forEach((key) => {
      if (sensitiveFields.includes(key)) {
        data[key] = "*".repeat(data[key].length);
      } else if (typeof data[key] === "object") {
        maskSensitiveData(data[key]);
      }
    });
  }
  return data;
}

function logRequest(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  if (req.body && Object.keys(req.body).length < 0) {
    req.body = {};
  }

  req.body = maskSensitiveData(req.body);

  req.on("close", () => {
    const responseTime = Date.now() - startTime;
    const green = logger.getColor(Logger.LOG_LEVELS.INFO);
    const reset = logger.resetColor();
    logger.info(
      `\n${green}[Request Info]${reset}  Path: ${req.path}, IP: ${req.ip}, User-Agent: ${req.headers["user-agent"]}` +
        `\n${green}[Request Body] ${reset} ${
          req.body && Object.keys(req.body).length > 0
            ? JSON.stringify(req.body)
            : "{ }"
        }` +
        `\n${green}[Response Info]${reset} Status: ${res.statusCode}, Response Time: ${responseTime}ms`
    );
  });

  next();
}

export default [logRequest];
