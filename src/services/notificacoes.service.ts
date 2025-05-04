import { injectable, inject } from "inversify";
import BaseService from "./generics/base.service";
import NotificacaoRepository from "../repositories/notificacao.repository";
import Notificacao from "../models/notificacao";
import { NotFoundError } from "../shared/middlewares/error";
import { CreateNotificacaoDtoType } from "../shared/dtos/notificacao.dto";

@injectable()
class NotificacaoServices extends BaseService<Notificacao>{

    constructor(@inject(NotificacaoRepository) private notificacaoRepository:NotificacaoRepository){
        super(notificacaoRepository);
    }
    
    public async buscarPorUsuarioId(usuarioId:number):Promise<Notificacao[]>{
      const notificacoes = await this.notificacaoRepository.getAllNotificacoesOfUsuario(usuarioId);
      if(!notificacoes) throw new NotFoundError("Não existe notificações para esse usuario informado");
      return notificacoes;
    }

    public async createWithAssociatons(data: CreateNotificacaoDtoType): Promise<Notificacao> {
      const { usuarioIds, ...notificacaoData } = data;
      const notificacao = await this.notificacaoRepository.create(notificacaoData);
  
      if (usuarioIds && usuarioIds.length > 0) {
          // Aqui fazemos a associação com os usuários
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (notificacao as any).setUsuarios(usuarioIds);
      }
  
      return notificacao;
    }
}
export default NotificacaoServices;