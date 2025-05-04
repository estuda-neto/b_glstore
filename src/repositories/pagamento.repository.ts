import { injectable } from "inversify";
import Pagamento from "../models/pagamento";
import BaseRepository from "./generics/base.repository";
import { Op } from "sequelize";

@injectable()
class PagamentoRepository extends BaseRepository<Pagamento> {
    constructor() {
        super(Pagamento);
    }

    // Você pode adicionar métodos específicos aqui
    async findByPedidoId(pedidoId: number) {
        return await Pagamento.findAll({
          where: { pedidoId }
        });
      }
    
      async findByStatus(status: string) {
        return await Pagamento.findAll({
          where: { statusPagamento: status }
        });
      }
    
      async findByDateRange(startDate: Date, endDate: Date) {
        return await Pagamento.findAll({
          where: {
            dataPagamento: {
              [Op.between]: [startDate, endDate]
            }
          }
        });
      }
    
      async findByPaymentMethod(method: string) {
        return await Pagamento.findAll({
          where: { metodoPagamento: method }
        });
      }
    
      async findByTransactionId(pagamentoId: number) {
        return await Pagamento.findOne({
          where: { pagamentoId }
        });
      }
}

export default PagamentoRepository;
