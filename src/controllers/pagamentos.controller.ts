import { inject, injectable } from "inversify";
import { Controller } from "./base.controller";
import { NextFunction, Request, Response} from "express";
import PagamentoServices from "../services/pagamentos.service";
import { InternalServerError } from "../shared/middlewares/error";

@injectable()
class PagamentoController extends Controller{
    constructor(@inject(PagamentoServices) private readonly pagamentoServices: PagamentoServices) {
        super();
    }
    public async listarTodos(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const pagamentos = await this.pagamentoServices.getAll();
            res.status(200).json(pagamentos);
        }, req, res, next);
    }

    public async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const { id } = req.params;
            const pagamentos = await this.pagamentoServices.getById(Number(id));
            res.status(200).json(pagamentos);
        }, req, res, next);
    }

    public async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const pagamento = await this.pagamentoServices.create(req.body);
            res.status(201).json(pagamento);
        }, req, res, next);
    }

    public async atualizarpagamento(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const { id } = req.params;
            const atualizado = await this.pagamentoServices.update(Number(id), req.body);
            res.status(200).json(atualizado);
        }, req, res, next);
    }

    public async deletarpagamento(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const { id } = req.params;
            await this.pagamentoServices.delete(Number(id));
            res.status(200).json({ message: "pagamento removido com sucesso" });
        }, req, res, next);
    }

    public async realizarPagamento(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const dadosPagamento = req.body;
            // Aqui você pode adicionar validações se quiser (ex: valor, método de pagamento, etc.)
            const resultado = await this.pagamentoServices.realizarPagamento(dadosPagamento);
            if (!resultado) throw new InternalServerError('Erro ao processar pagamento');
            res.status(200).json(resultado);
        }, req, res, next);
    }
    
}
export default PagamentoController;
