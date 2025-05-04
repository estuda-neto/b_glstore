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
        await Controller.tryCatch(async (req, res, next) => {
            const categorias = await this.categoriaServices.getAll();
            if(!categorias){
                return next(new Error('Algum erro ocorreu'));
            }
            res.status(200).json(categorias);
        }, req, res, next);
    }

    public async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res, next) => {
            const { id } = req.params;
            const categorias = await this.categoriaServices.getById(Number(id));
            if (!categorias) {
                return next(new Error('categoria não encontrado'));
            }
            res.status(200).json(categorias);
        }, req, res, next);
    }

    public async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res, next) => {
            const categoria = await this.categoriaServices.create(req.body);
            if (!categoria) {
                return next(new Error('Erro ao criar categoria'));
            }
            res.status(201).json(categoria);
        }, req, res, next);
    }

    public async atualizarcategoria(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res, next) => {
            const { id } = req.params;
            const atualizado = await this.categoriaServices.update(Number(id), req.body);
            if (!atualizado) {
                return next(new Error('categoria não encontrado ou sem alterações'));
            }
            res.status(200).json({ message: "categoria atualizado com sucesso" });
        }, req, res, next);
    }

    public async deletarcategoria(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const { id } = req.params;
            await this.categoriaServices.delete(Number(id));
            res.status(200).json({ message: "categoria removido com sucesso" });
        }, req, res, next);
    }

}
export default CategoriaController;
