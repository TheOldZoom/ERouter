import express, {
  Router as ExpressRouter,
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import { RouteModule } from "../interfaces/IRoute";

type AnyRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;

export default class Router {
  private expressRouter: ExpressRouter;
  private routes: RouteModule = {};

  constructor() {
    this.expressRouter = express.Router();
  }

  get(...handlers: AnyRequestHandler[]): void {
    this.routes.get = handlers as unknown as RequestHandler;
    this.expressRouter.get("/", ...(handlers as RequestHandler[]));
  }

  post(...handlers: AnyRequestHandler[]): void {
    this.routes.post = handlers as unknown as RequestHandler;
    this.expressRouter.post("/", ...(handlers as RequestHandler[]));
  }

  put(...handlers: AnyRequestHandler[]): void {
    this.routes.put = handlers as unknown as RequestHandler;
    this.expressRouter.put("/", ...(handlers as RequestHandler[]));
  }

  delete(...handlers: AnyRequestHandler[]): void {
    this.routes.delete = handlers as unknown as RequestHandler;
    this.expressRouter.delete("/", ...(handlers as RequestHandler[]));
  }

  patch(...handlers: AnyRequestHandler[]): void {
    this.routes.patch = handlers as unknown as RequestHandler;
    this.expressRouter.patch("/", ...(handlers as RequestHandler[]));
  }

  all(...handlers: AnyRequestHandler[]): void {
    this.routes.all = handlers as unknown as RequestHandler;
    this.expressRouter.all("/", ...(handlers as RequestHandler[]));
  }

  getRoutes(): RouteModule {
    return this.routes;
  }

  getRouter(): ExpressRouter {
    return this.expressRouter;
  }
}

export { Router };
