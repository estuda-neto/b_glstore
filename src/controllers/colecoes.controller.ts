import { inject, injectable } from "inversify";
import { Controller } from "./base.controller";
import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../shared/middlewares/error";
import { ColecaoServices } from "../services";

@injectable()
class ColecaoController extends Controller {
  constructor(@inject(ColecaoServices) private readonly colecaoServices: ColecaoServices) {
    super();
  }
  
  public async listarTodos(req: Request,res: Response, next: NextFunction): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const colecoes = await this.colecaoServices.getAll();
        res.status(200).json(colecoes);
      },req,res,next
    );
  }

  public async buscarPorId(req: Request,res: Response, next: NextFunction): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const { id } = req.params;
        const colecaos = await this.colecaoServices.getById(Number(id));
        if (!colecaos) throw new NotFoundError("colecao não encontrado");
        res.status(200).json(colecaos);
      },req,res,next
    );
  }

  public async cadastrar(req: Request,res: Response, next: NextFunction): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const colecao = await this.colecaoServices.create({...req.body,imagemCapaUrl:null});
        if (!colecao) throw new BadRequestError("Erro ao criar colecao");
        res.status(201).json(colecao);
      },req,res,next
    );
  }

  public async atualizarcolecao(req: Request,res: Response, next: NextFunction): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const { id } = req.params;
        const atualizado = await this.colecaoServices.update(
          Number(id),
          req.body
        );
        if (!atualizado)
          throw new NotFoundError("colecao não encontrado ou sem alterações");
        res.status(200).json({ message: "colecao atualizado com sucesso" });
      },req,res,next
    );
  }

  public async deletarcolecao(req: Request,res: Response, next: NextFunction): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const { id } = req.params;
        await this.colecaoServices.delete(Number(id));
        res.status(200).json({ message: "colecao removido com sucesso" });
      },req,res,next
    );
  }

  public async adicionarOuAtualizarImagem(req: Request, res: Response, next: NextFunction): Promise<void> {
    await Controller.tryCatch(async (req, res) => {
        const { id } = req.params;
        const { file } = req;

        if (!file) throw new BadRequestError("Nenhuma imagem foi enviada.");
        const urlImagem = `/uploads/${file.filename}`;
        const atualizado = await this.colecaoServices.updateImagem(Number(id), urlImagem);
        res.status(200).json(atualizado);
    }, req, res, next);
  }

}
export default ColecaoController;
