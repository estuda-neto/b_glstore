import { inject, injectable } from "inversify";
import { Controller } from "./base.controller";
import { NextFunction, Request, Response } from "express";
import NotificacaoServices from "../services/notificacoes.service";
import EmailServices from "../services/email.service";
import { InternalServerError, NotFoundError } from "../shared/middlewares/error";

@injectable()
class NotificacaoController extends Controller {
  constructor(
    @inject(NotificacaoServices) private readonly notificacaoServices: NotificacaoServices,
    @inject(EmailServices) private readonly emailServices: EmailServices
  ) {
    super();
  }

  public async sendEmail(req: Request,res: Response,next: NextFunction): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const { to, subject, text, html } = req.body;
        const email = await this.emailServices.sendEmail(to,subject,text,html);
        if (!email) throw new InternalServerError("Erro ao enviar email");
        res.status(200).json(email);
      },req,res,next);
  }

  public async listarTodos(req: Request,res: Response,next: NextFunction): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const notificacaos = await this.notificacaoServices.getAll();
        if (!notificacaos) throw new InternalServerError("Erro interno do servidor não foi possivel enviar a notificação");
        res.status(200).json(notificacaos);
      },req,res,next);
  }

  public async buscarPorId(req: Request,res: Response,next: NextFunction): Promise<void> {
    await Controller.tryCatch(async (req, res) => {
        const { id } = req.params;
        const notificacaos = await this.notificacaoServices.getById(Number(id));
        if (!notificacaos) throw new NotFoundError("Erro interno do servidor não foi possivel enviar a notificação");
        res.status(200).json(notificacaos);
      },req,res,next);
  }

  public async cadastrar(req: Request,res: Response,next: NextFunction): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const notificacao = await this.notificacaoServices.createWithAssociatons(req.body);
        res.status(201).json(notificacao);
      },req,res,next);
  }

  public async atualizarnotificacao(req: Request,res: Response,next: NextFunction): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const { id } = req.params;
        const atualizado = await this.notificacaoServices.update(Number(id),req.body);
        res.status(200).json(atualizado);
      },req,res,next);
  }

  public async deletarcategoria(req: Request,res: Response,next: NextFunction): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const { id } = req.params;
        await this.notificacaoServices.delete(Number(id));
        res.status(200).json({ message: "notificacao removido com sucesso" });
      },req,res,next);
  }

  public async buscarPorUsuarioId(req: Request,res: Response,next: NextFunction): Promise<void> {
    await Controller.tryCatch(
      async (req, res) => {
        const { id } = req.params;
        const notoficacoes = await this.notificacaoServices.buscarPorUsuarioId(Number(id));
        res.status(200).json(notoficacoes);
      },req,res,next);
  }
}
export default NotificacaoController;
