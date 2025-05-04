import { MiddlewareAsync } from "./middleware.types";

const mdl_verificaId: MiddlewareAsync = async (req, res, next): Promise<void> => {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId) || !Number.isInteger(parsedId) || parsedId <= 0) {
        res.status(400).json({ message: "O ID deve ser um número inteiro válido e maior que zero." });
        return;
    }

    next();
};

export { mdl_verificaId };
