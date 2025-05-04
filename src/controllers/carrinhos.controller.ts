import { inject, injectable } from "inversify";
import { Controller } from "./base.controller";
import { NextFunction, Request, Response } from "express";
import CarrinhoServices from "../services/carrinhos.service";

@injectable()
class CarrinhoController extends Controller {
  constructor(
    @inject(CarrinhoServices) private readonly carrinhoServices: CarrinhoServices
  ) {
    super();
  }
  public async listarTodos(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const carrinhos = await this.carrinhoServices.getAll();
        res.status(200).json(carrinhos);
      },
      req,
      res,
      next
    );
  }

  public async buscarPorId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const { id } = req.params;
        const carrinhos = await this.carrinhoServices.getById(Number(id));
        res.status(200).json(carrinhos);
      },
      req,
      res,
      next
    );
  }

  public async buscarPorUsuarioId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const { id } = req.params;
        const carrinho =
          await this.carrinhoServices.getCarrinhoWithVariacoesByUsuarioId(
            Number(id)
          );
        res.status(200).json(carrinho);
      },
      req,
      res,
      next
    );
  }

  public async cadastrar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const carrinho = await this.carrinhoServices.create(req.body);
        res.status(201).json(carrinho);
      },
      req,
      res,
      next
    );
  }

  public async atualizarCarrinho(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const { id } = req.params;
        const atualizado = await this.carrinhoServices.update(
          Number(id),
          req.body
        );
        res.status(200).json(atualizado);
      },
      req,
      res,
      next
    );
  }

  public async deletarCarrinho(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const { id } = req.params;
        await this.carrinhoServices.delete(Number(id));
        res.status(200).json({ message: "carrinho removido com sucesso" });
      },
      req,
      res,
      next
    );
  }

  public async adicionarProdutoNoCarrinho(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const { usuarioId, variacaoId } = req.body;
        const carrinho = await this.carrinhoServices.adicionarProdutoCarrinho(
          Number(usuarioId),
          Number(variacaoId)
        );
        res.status(200).json(carrinho);
      },
      req,
      res,
      next
    );
  }
}
export default CarrinhoController;
