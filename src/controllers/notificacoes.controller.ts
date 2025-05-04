import { inject } from "inversify";
import { injectable } from "inversify";
import { Controller } from "./base.controller";
import { NextFunction, Request, Response} from "express";
import NotificacaoServices from "../services/notificacoes.service";
import EmailServices from "../services/email.service";

@injectable()
class NotificacaoController extends Controller {
    constructor(@inject(NotificacaoServices) private notificacaoServices: NotificacaoServices,@inject(EmailServices) private emailServices: EmailServices) {
        super();
    }

    public async sendEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res, next) => {
            const {to, subject, text, html} = req.body;
            const email = await this.emailServices.sendEmail(to, subject, text, html);
            if (!email) {
                return next(new Error('Erro ao enviar email'));
            }
            res.status(200).json(email);
        }, req, res, next);
    }

    public async listarTodos(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res, next) => {
            const notificacaos = await this.notificacaoServices.getAll();
            if(!notificacaos){
                return next(new Error('Algum erro ocorreu'));
            }
            res.status(200).json(notificacaos);
        }, req, res, next);
    }

    public async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res, next) => {
            const { id } = req.params;
            const notificacaos = await this.notificacaoServices.getById(Number(id));
            if (!notificacaos) {
                return next(new Error('notificacao não encontrado'));
            }
            res.status(200).json(notificacaos);
        }, req, res, next);
    }

    public async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const notificacao = await this.notificacaoServices.createWithAssociatons(req.body);
            res.status(201).json(notificacao);
        }, req, res, next);
    }

    public async atualizarnotificacao(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res, next) => {
            const { id } = req.params;
            const atualizado = await this.notificacaoServices.update(Number(id), req.body);
            if (!atualizado) {
                return next(new Error('notificacao não encontrado ou sem alterações'));
            }
            res.status(200).json({ message: "notificacao atualizado com sucesso" });
        }, req, res, next);
    }

    public async deletarcategoria(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
            const { id } = req.params;
            await this.notificacaoServices.delete(Number(id));
            res.status(200).json({ message: "notificacao removido com sucesso" });
        }, req, res, next);
    }

    public async buscarPorUsuarioId(req: Request, res: Response, next: NextFunction): Promise<void> {
      await Controller.tryCatch(async (req, res) => {
        const { id } = req.params;
        const notoficacoes = await this.notificacaoServices.buscarPorUsuarioId(Number(id));
        res.status(200).json(notoficacoes);
    }, req, res, next);
    }

}
export default NotificacaoController;
