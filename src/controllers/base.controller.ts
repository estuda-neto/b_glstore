import { NextFunction, Request, Response } from "express";

type Function = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export abstract class Controller {
  protected static async tryCatch(fn: Function, req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}