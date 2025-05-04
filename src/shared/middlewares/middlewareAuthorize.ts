import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { TipoUsuario } from "../enums/tipousuario";

const JWT_SECRET = process.env.JWT_SECRET!;
export interface DecodedToken {usuarioId: string; tipoUsuario: TipoUsuario; clientType: string;};

export const authorize = (permittedRoles: TipoUsuario[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Token não fornecido" });
            return;
        }

        try {
            // token é um objeto com usuarioId, tipoUsuario , clientType
            const decoded = jwt.verify(token as string, JWT_SECRET) as DecodedToken;

            if (!decoded.tipoUsuario || !permittedRoles.includes(decoded.tipoUsuario)) {
                res.status(403).json({ message: "Acesso negado" });
                return;
            }

            next();
        } catch (error) {
            console.error("Erro ao verificar token:", error);
            res.status(403).json({ message: "Token inválido" });
            return;
        }
    };
};
