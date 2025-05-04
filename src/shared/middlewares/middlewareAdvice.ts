/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import * as classerror from "./error";
import { ValidationError } from "yup";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const middlewareAdvice = (err: any, req: Request, res: Response, next: NextFunction): void => {
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Caso seja um erro de validação (Yup, por exemplo)
    if (err instanceof ValidationError) {
        res.status(400).json({
            message: "Dados de entrada inválidos",
            errors: err.inner.map((e) => ({
                message: e.message,
                path: e.path,
            })),
        });
    } else {
        const errorClasses = [
            classerror.BadRequestError,
            classerror.UnauthorizedError,
            classerror.ForbiddenError,
            classerror.NotFoundError,
            classerror.NotAllowedError,
            classerror.NotAcceptableError,
            classerror.RequestTimeoutError,
            classerror.ConflictError,
            classerror.GoneError,
            classerror.UnsupportedMediaTypeError,
            classerror.ManyRequestError,
        ];

        const matchingErrorClass = errorClasses.find(
            (errorClass) => err instanceof errorClass
        );

        if (matchingErrorClass) {
            console.log(`Erro detectado como instância de: ${matchingErrorClass.name}`);
            res.status(err.statusCode ?? 500).json({
                message: err.message,
                descricaoPadrao: err.descricaoPadrao,
            });
        } else {
            console.log("Erro desconhecido, resposta padrão");
            res.status(status).json({ message });
        }
    }
};
