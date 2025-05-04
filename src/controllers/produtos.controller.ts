import { inject } from "inversify";
import { injectable } from "inversify";
import { Controller } from "./base.controller";
import { NextFunction, Request, Response} from "express";
import ProdutoServices from "../services/produtos.service";
import { BadRequestError, NotFoundError } from "../shared/middlewares/error";
import { InternalServerError } from "../shared/middlewares/error/internalservererror";

@injectable()
class ProdutoController extends Controller{
    constructor(@inject(ProdutoServices) private produtoServices: ProdutoServices) {
        super();
    }
    public async listarTodos(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const produtos = await this.produtoServices.getAll();
            if(!produtos) throw new InternalServerError('Algum erro interno no servidor ocorreu');
            res.status(200).json(produtos);
        }, req, res, next);
    }

    public async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const { id } = req.params;
            const produtos = await this.produtoServices.getById(Number(id));
            if (!produtos) throw new NotFoundError('produto não encontrado');
            res.status(200).json(produtos);
        }, req, res, next);
    }

    public async buscarPorIdWithVariacoes(req: Request, res: Response, next: NextFunction): Promise<void> {
      await Controller.tryCatch(async (req, res) => {
          const { id } = req.params;
          const produto = await this.produtoServices.getByIdWithVariacoes(Number(id));
          if (!produto) throw new NotFoundError('produto não encontrado');
          res.status(200).json(produto);
      }, req, res, next);
  }

    public async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const produto = await this.produtoServices.create(req.body);
            if (!produto) throw new BadRequestError('Erro ao criar produto');
            res.status(201).json(produto);
        }, req, res, next);
    }

    public async adicionarOuAtualizarImagem(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const { id } = req.params;
            const { file } = req;
            const { posicao } = req.body;

            if (!file) throw new BadRequestError("Nenhuma imagem foi enviada.");
            const urlImagem = `/uploads/${file.filename}`;
            const atualizado = await this.produtoServices.updateImagens(Number(id), urlImagem, Number(posicao));
            res.status(200).json(atualizado);
        }, req, res, next);
    }
    

    public async atualizarproduto(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const { id } = req.params;
            const atualizado = await this.produtoServices.update(Number(id), req.body);
            if (!atualizado)  throw new NotFoundError('produto não encontrado ou sem alterações');
            res.status(200).json({ message: "produto atualizado com sucesso" });
        }, req, res, next);
    }

    public async deletarproduto(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const { id } = req.params;
            await this.produtoServices.delete(Number(id));
            res.status(200).json({ message: "produto removido com sucesso" });
        }, req, res, next);
    }

    public async getProdutosByCategoriaId(req: Request, res: Response, next: NextFunction): Promise<void> {
      await Controller.tryCatch(async (req, res) => {
          const { id } = req.params;
          const produtos = await this.produtoServices.getProdutosByCategoriaId(Number(id));
          res.status(200).json(produtos);
      }, req, res, next);
  }

}
export default ProdutoController;
