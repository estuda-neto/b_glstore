import { inject, injectable } from "inversify";
import { Controller } from "./base.controller";
import { NextFunction, Request, Response} from "express";
import PedidoServices from "../services/pedidos.service";
import { InternalServerError, NotFoundError } from "../shared/middlewares/error";

@injectable()
class PedidoController extends Controller{
    constructor(@inject(PedidoServices) private readonly pedidosServices: PedidoServices) {
        super();
    }
    public async listarTodos(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const pedidos = await this.pedidosServices.getAll();
            if(!pedidos) throw new InternalServerError('Algum erro interno no servidor ocorreu');
            res.status(200).json(pedidos);
        }, req, res, next);
    }

    public async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const { id } = req.params;
            const pedidos = await this.pedidosServices.getById(Number(id));
            if (!pedidos) throw new NotFoundError('pedido não encontrado');
            res.status(200).json(pedidos);
        }, req, res, next);
    }

    public async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res, next) => {
            const pedido = await this.pedidosServices.create(req.body);
            if (!pedido) {
                return next(new Error('Erro ao criar pedido'));
            }
            res.status(201).json(pedido);
        }, req, res, next);
    }

    public async atualizarpedido(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res, next) => {
            const { id } = req.params;
            const atualizado = await this.pedidosServices.update(Number(id), req.body);
            if (!atualizado) {
                return next(new Error('pedido não encontrado ou sem alterações'));
            }
            res.status(200).json({ message: "pedido atualizado com sucesso" });
        }, req, res, next);
    }

    public async deletarpedido(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const { id } = req.params;
            await this.pedidosServices.delete(Number(id));
          
            res.status(200).json({ message: "pedido removido com sucesso" });
        }, req, res, next);
    }

    public async criarPedidoApartirDeCarrinho(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res, next) => {
            const { carrinhoId, delivery, discount } = req.body;
            const pedidoCriado = await this.pedidosServices.createPedido(Number(carrinhoId),Number(delivery),Number(discount));
            if (!pedidoCriado) {
                return next(new Error('pedido não pode ser criado utilizando essa referencia.'));
            }
            res.status(201).json(pedidoCriado);
        }, req, res, next);
    }

}
export default PedidoController;
