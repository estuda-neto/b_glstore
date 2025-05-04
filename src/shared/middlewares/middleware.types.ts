import { Request, Response, NextFunction } from "express";

type Middleware = (req: Request, res: Response, next: NextFunction) =>void;
type MiddlewareAsync = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export { Middleware, MiddlewareAsync };
