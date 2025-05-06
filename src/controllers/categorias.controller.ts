import { inject, injectable } from "inversify";
import { Controller } from "./base.controller";
import { NextFunction, Request, Response} from "express";
import CategoriaServices from "../services/categorias.service";

@injectable()
class CategoriaController extends Controller{
    constructor(@inject(CategoriaServices) private readonly categoriaServices: CategoriaServices) {
        super();
    }
    public async listarTodos(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const categorias = await this.categoriaServices.getAll();
            res.status(200).json(categorias);
        }, req, res, next);
    }

    public async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const { id } = req.params;
            const categorias = await this.categoriaServices.getById(Number(id));
            res.status(200).json(categorias);
        }, req, res, next);
    }

    public async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const categoria = await this.categoriaServices.create(req.body);
            res.status(201).json(categoria);
        }, req, res, next);
    }

    public async atualizarcategoria(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const { id } = req.params;
            const atualizado = await this.categoriaServices.update(Number(id), req.body);
            res.status(200).json(atualizado);
        }, req, res, next);
    }

    public async deletarcategoria(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const { id } = req.params;
            await this.categoriaServices.delete(Number(id));
            res.status(200).json({ message: "categoria removida com sucesso" });
        }, req, res, next);
    }

}
export default CategoriaController;
