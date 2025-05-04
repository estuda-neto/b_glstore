import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Token ausente" });
        return Promise.resolve();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET as string);
        
        if (typeof decoded === "object" && decoded !== null && "usuarioId" in decoded && "clientType" in decoded) {
            return next();
        }
        res.status(403).json({ message: "Token inválido" });
        return Promise.resolve();

    } catch (error: unknown) {
        console.log(error);
        res.status(403).json({ message: "Token inválido" });
        return Promise.resolve();
    }
};
