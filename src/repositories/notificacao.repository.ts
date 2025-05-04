import { injectable } from "inversify";
import Notificacao from "../models/notificacao";
import BaseRepository from "./generics/base.repository";
import Usuario from "../models/usuario";

@injectable()
class NotificacaoRepository extends BaseRepository<Notificacao> {
    constructor() {
        super(Notificacao);
    }

    // Você pode adicionar métodos específicos aqui
    async getAllNotificacoesOfUsuario(usuarioId: number): Promise<Notificacao[]> {
      return Notificacao.findAll({include: [{ model: Usuario, where: { usuarioId: usuarioId },through: { attributes: [] }}]});
    }
}

export default NotificacaoRepository;

