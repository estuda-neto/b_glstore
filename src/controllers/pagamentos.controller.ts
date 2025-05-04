import { inject, injectable } from "inversify";
import { Controller } from "./base.controller";
import { NextFunction, Request, Response} from "express";
import PagamentoServices from "../services/pagamentos.service";

@injectable()
class PagamentoController extends Controller{
    constructor(@inject(PagamentoServices) private readonly pagamentoServices: PagamentoServices) {
        super();
    }
    public async listarTodos(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res, next) => {
            const pagamentos = await this.pagamentoServices.getAll();
            if(!pagamentos){
                return next(new Error('Algum erro ocorreu'));
            }
            res.status(200).json(pagamentos);
        }, req, res, next);
    }

    public async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res, next) => {
            const { id } = req.params;
            const pagamentos = await this.pagamentoServices.getById(Number(id));
            if (!pagamentos) {
                return next(new Error('pagamento não encontrado'));
            }
            res.status(200).json(pagamentos);
        }, req, res, next);
    }

    public async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res, next) => {
            const pagamento = await this.pagamentoServices.create(req.body);
            if (!pagamento) {
                return next(new Error('Erro ao criar pagamento'));
            }
            res.status(201).json(pagamento);
        }, req, res, next);
    }

    public async atualizarpagamento(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res, next) => {
            const { id } = req.params;
            const atualizado = await this.pagamentoServices.update(Number(id), req.body);
            if (!atualizado) {
                return next(new Error('pagamento não encontrado ou sem alterações'));
            }
            res.status(200).json({ message: "pagamento atualizado com sucesso" });
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
        await Controller.tryCatch(async (req, res, next) => {
            const dadosPagamento = req.body;
    
            // Aqui você pode adicionar validações se quiser (ex: valor, método de pagamento, etc.)
            const resultado = await this.pagamentoServices.realizarPagamento(dadosPagamento);
            
            if (!resultado) {
                return next(new Error('Erro ao processar pagamento'));
            }
    
            res.status(200).json(resultado);
        }, req, res, next);
    }
    

}
export default PagamentoController;
