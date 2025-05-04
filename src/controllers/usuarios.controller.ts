import { inject } from "inversify";
import { injectable } from "inversify";
import UsuarioServices from "../services/usuarios.service";
import { Controller } from "./base.controller";
import { NextFunction, Request, Response } from "express";
import AuthServices from "../services/auth.service";
import Usuario from "../models/usuario";
import { BadRequestError, NotFoundError } from "../shared/middlewares/error";

@injectable()
class UsuarioController extends Controller {
    constructor(
        @inject(UsuarioServices) private usuarioServices: UsuarioServices,
        @inject(AuthServices) private authService: AuthServices
    ) {
        super();
    }

    public async login(req: Request,res: Response,next: NextFunction): Promise<void> {
        await Controller.tryCatch(
            async (req, res) => {
                const { email, password, client_type } = req.body;

                if (!["web", "mobile"].includes(client_type)) {
                    throw new BadRequestError("Client type inválido");
                }

                const { accessToken, refreshToken } =
                    await this.authService.login(email, password, client_type);

                res.status(200).json({ accessToken, refreshToken });
            },req,res,next
        );
    }

    public async sendEmailResetPassword(req: Request,res: Response,next: NextFunction): Promise<void> {
        await Controller.tryCatch(
            async (req, res) => {
                const { email } = req.body;
                const enviou = this.usuarioServices.sendEmailWithHashResetPassword(email);
                if (!enviou) {
                    throw new NotFoundError("Algum erro ocorreu");
                }
                res.status(200).json({ enviado: enviou });
            },req,res,next);
    }

    public async redefinirPassword(req: Request,res: Response,next: NextFunction): Promise<void> {
        await Controller.tryCatch(
            async (req, res) => {
                const { token, email, password, repassword } = req.body;
                const redefinido = await this.usuarioServices.redefinirSenha(token,email,password,repassword);
                if (redefinido === 0) {
                    throw new BadRequestError("Algum erro ocorreu");
                }

                res.status(200).json({ usuarioId: redefinido });
            },req,res,next);
    }

    public async listaUsuarios(req: Request,res: Response,next: NextFunction): Promise<void> {
        await Controller.tryCatch(async (req, res) => {
                const usuarios = await this.usuarioServices.getAll();
                res.status(200).json(usuarios);
        },req,res,next);
    }

    public async buscarPorId(req: Request,res: Response,next: NextFunction): Promise<void> {
        await Controller.tryCatch(
            async (req, res) => {
                const { id } = req.params;
                const usuario = await this.usuarioServices.getById(Number(id));
                res.status(200).json(usuario);
            },req,res,next
        );
    }

    public async cadastrarUsuario(req: Request,res: Response,next: NextFunction): Promise<void> {
        await Controller.tryCatch(
            async (req, res) => {
                const novoUsuario = await this.usuarioServices.cadastrarUsuario(req.body);
                res.status(201).json(novoUsuario);
            },req,res,next
        );
    }

    public async atualizarUsuario(req: Request,res: Response,next: NextFunction): Promise<void> {
        await Controller.tryCatch(
            async (req, res) => {
                const { id } = req.params;
                const usuarioDto: Partial<Usuario> = req.body;
                const usuarioId = Number(id);

                const atualizado = await this.usuarioServices.atualizarUsuario(usuarioId, usuarioDto);
                res.status(200).json(atualizado);
            },req,res,next
        );
    }

    public async deletarUsuario(req: Request,res: Response,next: NextFunction): Promise<void> {
        await Controller.tryCatch(
            async (req, res) => {
                const { id } = req.params;
                await this.usuarioServices.delete(Number(id));
                res.status(200).json({message: "Usuario removido com sucesso"});
            },req,res,next
        );
    }

    public async buscarPorEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Controller.tryCatch(
            async (req, res) => {
                const { email } = req.params;
                const Usuario = await this.usuarioServices.buscarPorEmail(email);
                res.status(200).json(Usuario);
            },req,res,next);
    }

    public async listarPaginado(req: Request,res: Response,next: NextFunction): Promise<void> {
        await Controller.tryCatch(
            async (req, res) => {
                const { limit = "10", offset = "0" } = req.query;
                const limitNumber = Number(limit);
                const offsetNumber = Number(offset);

                if (isNaN(limitNumber) || isNaN(offsetNumber)) {
                    throw new BadRequestError("Parâmetros de consulta inválidos.");
                }

                const paginacao = await this.usuarioServices.listarPaginado(limitNumber,offsetNumber);
                res.status(200).json(paginacao);
            },req,res,next
        );
    }
}
export default UsuarioController;
