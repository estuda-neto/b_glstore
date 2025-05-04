import { injectable, inject } from "inversify";
import { fromString } from "../shared/enums/tipousuario";
import { Optional } from "sequelize";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../shared/middlewares/error";
import UsuarioRepository from "../repositories/usuarios.repository";
import Usuario from "../models/usuario";
import BaseService from "./generics/base.service";
import EmailServices from "./email.service";
import TokenServices from "./tokens.service";
import bcrypt from "bcrypt";

@injectable()
class UsuarioServices extends BaseService<Usuario> {
  constructor(
    @inject(UsuarioRepository) private usuarioRepository: UsuarioRepository,
    @inject(EmailServices) private emailServices: EmailServices,
    @inject(TokenServices) private tokenServices: TokenServices
  ) {
    super(usuarioRepository);
  }

  public async buscarPorEmail(email: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario) throw new NotFoundError("Usuario com esse email não existe na aplicação.");
    return usuario;
  }

  // public async redenifinirPassword(data: RedefUsuarioDtoType): Promise<Usuario> {
  //     return this.usuarioRepository.update();
  // }

  public async sendEmailWithHashResetPassword(email: string): Promise<boolean> {
    const usuario = await this.usuarioRepository.findByEmail(email);
    if (usuario) {
      try {
        const token = await this.tokenServices.generateToken(email);
        /** to: string → O destinatário do e-mail (exemplo: "usuario@email.com").
         *  subject: string → O assunto do e-mail (exemplo: "Bem-vindo ao nosso serviço!").
         *  text: string → O corpo do e-mail em texto puro (sem formatação HTML).
         *  html?: string → (Opcional) O corpo do e-mail em formato HTML, permitindo estilização e formatação. */
        this.emailServices.sendEmail(email,"Token para redefinição de senha",token,`um html "${token}"`);
      } catch (error) {
        throw new Error(`Deu pau:${error}`);
      }
      return true;
    }
    return false;
  }

  public async redefinirSenha(token: string,email: string,password: string,repassword: string): Promise<number> {
    const tokenvalido = await this.tokenServices.validateToken(token, email);
    if (tokenvalido) {
      const objetoEmailDecritado = await this.tokenServices.decryptToken(token);
      // Se de fato email, do tokendecriptado === email do usuario e password === repassword
      if (objetoEmailDecritado === email && password === repassword) {
        const usuario = await this.usuarioRepository.findByEmail(email);
        if (usuario) {
          const salt = await bcrypt.genSalt(12);
          usuario.password = await bcrypt.hash(password, salt);
          const [atualizou] = await this.usuarioRepository.update(
            usuario?.usuarioId,
            usuario
          );
          return atualizou;
        }
      }
    }
    return 0;
  }

  public async cadastrarUsuario(dados: Optional<Usuario, "usuarioId">): Promise<Usuario> {
    if (!dados.tipoUsuario)
      throw new BadRequestError("Tipo de usuário inválido");

    const usuario = await this.usuarioRepository.create({
      ...dados,
      tipoUsuario: fromString(dados.tipoUsuario),
    });

    if (!usuario)
      throw new InternalServerError(
        "Erro interno: o recurso não pôde ser criado!"
      );
    return usuario;
  }

  public async atualizarUsuario(usuarioId: number,dados: Partial<Usuario>): Promise<Usuario> {
    if (!usuarioId || isNaN(usuarioId))throw new BadRequestError(" Id inválido");
    
    await this.getById(usuarioId);

    if (dados.password) {
      const salt = await bcrypt.genSalt(12);
      dados.password = await bcrypt.hash(dados.password, salt);
    }

    // removendo campos unics antes de salvar
    delete dados.cpf;
    delete dados.email;

    const [linhasAfetadas] = await this.usuarioRepository.update(usuarioId, dados);
    if (linhasAfetadas < 1) {
      throw new BadRequestError("Dados faltantes ou requisição inconsistente.");
    }

    const usuarioAtualizado = await this.getById(usuarioId);
    return usuarioAtualizado;
  }

  public async listarPaginado(limit: number,offset: number): Promise<{ rows: Usuario[]; count: number }> {
    const objectWithUsuarios = await this.usuarioRepository.findWithPagination(limit, offset);
    if(!objectWithUsuarios) throw new InternalServerError("Erro interno: o recurso não pôde ser recuperado!");
    return objectWithUsuarios;
  }
}
export default UsuarioServices;
