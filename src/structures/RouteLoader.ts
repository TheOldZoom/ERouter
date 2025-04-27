import fs from "fs";
import path from "path";
import express, { Express, RequestHandler } from "express";
import { RouteModule, RouteOptions } from "../interfaces/IRoute";
import Router from "./Router";
import Logger from "./Logger";

class RouteLoader {
  private routeRegistry: Record<string, RouteModule> = {};
  private app: Express;
  private logger: Logger;

  constructor(options: RouteOptions) {
    this.app = options.app;
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.logger = new Logger({
      appName: "Router",
      colors: true,
      showLogLevel: true,
      showTimestamp: true,
    });

    this.setupRoutes(options.path);
  }

  private loadRoutesFromDir(
    currentDir: string,
    routePrefix: string = "",
    parentMiddlewares: RequestHandler[] = []
  ): void {
    if (!fs.existsSync(currentDir)) {
      this.logger.error(`Directory not found: ${currentDir}`);
      return;
    }

    const items: string[] = fs.readdirSync(currentDir);

    let middlewares = [...parentMiddlewares];
    const middlewarePath = path.join(currentDir, "_middleware.ts");

    if (fs.existsSync(middlewarePath)) {
      const middlewareModule = require(path.resolve(middlewarePath));
      const middleware = middlewareModule.default as RequestHandler;
      if (middleware) {
        middlewares.push(middleware);

        const middlewareRoute = this.normalizeRoutePath(routePrefix || "/");
        this.logger.info(
          `Middleware loaded for: ${
            middlewareRoute === "/" ? "/*" : middlewareRoute + "/*"
          }`
        );
      }
    }

    items.sort((a, b) => {
      if (a === "index.ts" && b !== "index.ts") return -1;
      if (b === "index.ts" && a !== "index.ts") return 1;
      if (a.includes("[") && !b.includes("[")) return 1;
      if (b.includes("[") && !a.includes("[")) return -1;

      return 0;
    });

    items.forEach((item: string) => {
      const itemPath = path.join(currentDir, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        const newPrefix = path.join(routePrefix, item === "index" ? "" : item);
        this.loadRoutesFromDir(itemPath, newPrefix, middlewares);
      } else if (
        stats.isFile() &&
        (item.endsWith(".ts") || item.endsWith(".js"))
      ) {
        if (item.endsWith(".d.ts") || item === "_middleware.ts") return;

        const baseName = item.replace(/\.(js|ts)$/, "");
        const routeModule: Router = require(path.resolve(itemPath)).default;

        if (typeof routeModule?.getRoutes !== "function") {
          this.logger.warn(`Skipping invalid route module: ${item}`);
          return;
        }

        const routeName =
          baseName === "index" ? routePrefix : path.join(routePrefix, baseName);
        const routePath = this.convertFileNameToRoute(routeName);

        const routes = routeModule.getRoutes();
        const methods = Object.keys(routes) as Array<keyof RouteModule>;

        if (methods.length > 0) {
          const methodsList = methods
            .filter((method) => routes[method])
            .map((method) => (method as string).toUpperCase())
            .join(", ");

          this.logger.info(`${routePath} {${methodsList}}`);
          this.logger.debug(`File: ${path.relative("./", itemPath)}`);

          methods.forEach((method) => {
            if (routes[method]) {
              (this.app as any)[method](
                routePath,
                ...middlewares,
                routes[method] as RequestHandler
              );
            }
          });

          const allMethods = [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "PATCH",
            "OPTIONS",
          ];
          allMethods.forEach((method) => {
            if (!methods.includes(method)) {
              (this.app as any)[method.toLowerCase()](
                routePath,
                (req: express.Request, res: express.Response) => {
                  res.set("Allow", methods.join(", "));
                  res.status(405).json({
                    error: `Method ${method} Not Allowed for ${routePath}`,
                  });
                }
              );
            }
          });
        }
      }
    });
  }

  private convertFileNameToRoute(fileName: string): string {
    let routePath = fileName.replace(/\\/g, "/");
    routePath = routePath.startsWith("/") ? routePath : "/" + routePath;

    routePath = routePath.replace(/\[(\w+)\]/g, ":$1");
    routePath = routePath.replace(/\[(\w+)\?\]/g, ":$1?");

    return routePath;
  }

  private normalizeRoutePath(fileName: string): string {
    let routePath = fileName.replace(/\\/g, "/");
    routePath = routePath.startsWith("/") ? routePath : "/" + routePath;
    routePath = routePath.replace(/\[(\w+)\]/g, ":$1");
    routePath = routePath.replace(/\[(\w+)\?\]/g, ":$1?");
    return routePath === "/index" ? "/" : routePath;
  }

  private setupRoutes(routesDir: string = "./routes"): void {
    this.logger.debug(`Loading routes from: ${path.resolve(routesDir)}`);
    this.loadRoutesFromDir(routesDir);
  }

  public getRouteRegistry(): Record<string, RouteModule> {
    return this.routeRegistry;
  }
}

export default RouteLoader;
