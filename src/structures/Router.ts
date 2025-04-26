import { RequestHandler } from "express";
import { RouteModule } from "../interfaces/IRoute";

export default class Router {
  private routes: RouteModule = {};

  // Assuming handlers might be asynchronous
  get(handler: RequestHandler): void | Promise<void> {
    this.routes.get = handler;
  }

  post(handler: RequestHandler): void | Promise<void> {
    this.routes.post = handler;
  }

  put(handler: RequestHandler): void | Promise<void> {
    this.routes.put = handler;
  }

  delete(handler: RequestHandler): void | Promise<void> {
    this.routes.delete = handler;
  }

  patch(handler: RequestHandler): void | Promise<void> {
    this.routes.patch = handler;
  }

  all(handler: RequestHandler): void | Promise<void> {
    this.routes.all = handler;
  }

  getRoutes(): RouteModule {
    return this.routes;
  }
}

export { Router };
