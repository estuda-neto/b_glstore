import { inject, injectable } from "inversify";
import { Controller } from "./base.controller";
import { ProdutoVariacaoServices } from "../services";
import { BadRequestError } from "../shared/middlewares/error";
import { Request, Response, NextFunction } from "express";

@injectable()
class ProdutoVariacaoController extends Controller {
    constructor(@inject(ProdutoVariacaoServices) private produtoVariacaoServices: ProdutoVariacaoServices) {
        super();
    }
    public async listarTodas(req: Request,res: Response,next: NextFunction): Promise<void> {
        await Controller.tryCatch(
            async (req, res) => {
                const { id } = req.params;
                const produtos = await this.produtoVariacaoServices.getAllForId(Number(id));
                res.status(200).json(produtos);
            },req,res,next
        );
    }

    public async buscarPorId(req: Request,res: Response,next: NextFunction): Promise<void> {
        await Controller.tryCatch(
            async (req, res) => {
                const { id } = req.params;
                const produtos = await this.produtoVariacaoServices.getById(Number(id));
                res.status(200).json(produtos);
            },req,res,next
        );
    }

    public async cadastrar(req: Request,res: Response,next: NextFunction): Promise<void> {
        await Controller.tryCatch(
            async (req, res) => {
                const produto = await this.produtoVariacaoServices.create(req.body);
                if (!produto) {
                    throw new BadRequestError("Erro ao criar produto");
                }
                res.status(201).json(produto);
            },req,res,next
        );
    }

    public async atualizarvaricao(req: Request,res: Response,next: NextFunction): Promise<void> {
        await Controller.tryCatch(
            async (req, res) => {
                const { id } = req.params;
                const atualizado = await this.produtoVariacaoServices.update(Number(id),req.body);
                res.status(200).json(atualizado);
            },req,res,next
        );
    }

    public async deletar(req: Request,res: Response,next: NextFunction): Promise<void> {
        await Controller.tryCatch(
            async (req, res) => {
                const { id } = req.params;
                await this.produtoVariacaoServices.delete(Number(id));
                res.status(200).json({message: "produto removido com sucesso"});
            },req,res,next
        );
    }

    public async atualizarParcialmente(req: Request, res: Response, next: NextFunction): Promise<void> {
      await Controller.tryCatch(
          async (req, res) => {
              const { id } = req.params;
              const atualizado = await this.produtoVariacaoServices.updatePartial(Number(id), req.body);
              res.status(200).json(atualizado);
          }, req, res, next
      );
  }
}

export default ProdutoVariacaoController;
