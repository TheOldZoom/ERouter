import "dotenv/config";
import express from "express";
import RouteLoader from "./structures/RouteLoader";
import Logger from "./structures/Logger";

const app = express();
const PORT = parseInt(process.env.PORT || "3002", 10);
const logger = new Logger({
  appName: "App",
  colors: true,
  minLevel: Logger.LOG_LEVELS.DEBUG,
  showLogLevel: true,
  showTimestamp: true,
});

const routeLoader = new RouteLoader({
  app,
  path: "./src/routes",
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});
