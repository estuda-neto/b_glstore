import { Request, Response, NextFunction } from "express";
import { ObjectSchema, ValidationError } from "yup";

/**
 * Middleware de validação genérico para schemas Yup tipados.
 * @param schema - Schema Yup que define a validação do DTO.
 */
const validateSchema = <T extends Record<string, unknown>>(schema: ObjectSchema<T>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({message: "Dados de entrada inválidos",errors: error.inner.map((err) => ({message: err.message,path: err.path}))});
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };

export { validateSchema };
