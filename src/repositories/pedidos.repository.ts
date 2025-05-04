import { injectable } from "inversify";
import Pedido from "../models/pedido";  // Importando o modelo Pedido
import BaseRepository from "./generics/base.repository";

@injectable()
class PedidoRepository extends BaseRepository<Pedido> {
    constructor() {
        super(Pedido);
    }

    // Você pode adicionar métodos específicos para o Pedido aqui
    // Exemplo:
    // public async buscarPorStatus(status: string) {
    //     return this.getAll({ where: { statusPedido: status } });
    // }
}

export default PedidoRepository;
