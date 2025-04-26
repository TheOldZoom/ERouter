import { RequestHandler } from "express";
import type { Express } from "express";
export interface RouteModule {
  get?: RequestHandler;
  post?: RequestHandler;
  put?: RequestHandler;
  delete?: RequestHandler;
  patch?: RequestHandler;
  [key: string]: RequestHandler | undefined;
}

export type RouteHandler = RequestHandler | RouteModule;

export interface RouteMethodRegistry {
  [path: string]: {
    methods: Set<string>;
    handlers: RouteModule;
  };
}

export interface RouteOptions {
  app: Express;
  path: string;
}
