import { ValidationError } from "yup";
import { MiddlewareAsync } from "./middleware.types";
import { CreateUsuarioDto } from "../dtos/usuario.dto";

const mdl_createusuario: MiddlewareAsync = async (req, res, next): Promise<void> => {
    try {
        console.log(req.body);
        await CreateUsuarioDto.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        if (error instanceof ValidationError) {

            const validationErrors = error.inner.map((err) => ({
                message: err.message,
                path: err.path,
            }));
            res.status(400).json({
                message: "Dados de entrada inválidos",
                errors: validationErrors,
            });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

const mdl_updateusuario: MiddlewareAsync = async (req, res, next): Promise<void> => {
    try {
        await CreateUsuarioDto.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        if (error instanceof ValidationError) {
            const validationErrors = error.inner.map((err) => ({
                message: err.message,
                path: err.path,
            }));
            res.status(400).json({
                message: "Dados de entrada inválidos",
                errors: validationErrors,
            });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

export { mdl_createusuario, mdl_updateusuario };