import { injectable, inject } from "inversify";
import BaseService from "./generics/base.service";
import PedidoRepository from "../repositories/pedidos.repository";
import Pedido from "../models/pedido";
import CarrinhoServices from "./carrinhos.service";
import { BadRequestError, NotFoundError } from "../shared/middlewares/error";
import Carrinho from "../models/carrinho";

@injectable()
class PedidoServices extends BaseService<Pedido> {
    constructor(
      @inject(PedidoRepository) private readonly pedidoRepository: PedidoRepository,
      @inject(CarrinhoServices) private readonly carrinhoServices: CarrinhoServices
    ) {
        super(pedidoRepository);
    }

    public async createPedido(carrinhoId: number,delivery:number,discount:number): Promise<Pedido> {
        const carrinho: Carrinho = await this.carrinhoServices.getCarrinhoWithVariacoes(carrinhoId);

        // Calcular o valor total do pedido
        const valorTotal = carrinho.produtosVariacoes?.reduce((acumulador: number, produtoVariacao) => acumulador + Number(produtoVariacao.preco), 0) ?? 0;
        const valorCalculado = (valorTotal + delivery) - discount;
        const pedidoCriado = await this.pedidoRepository.create({
          statusPedido: "Pendente",
          dataPedido: new Date(),
          dataEntrega: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Adicione esse campo que é obrigatório
          valorTotal: valorCalculado,
          usuarioId: carrinho.usuarioId,
          carrinhoId: carrinho.carrinhoId
      });
        await this.carrinhoServices.limparCarrinho(carrinhoId);
        return pedidoCriado;
    }

    public async setStatusPedidoPago(pedidoId: number, valorPago: number): Promise<number> {
        // Buscar o carrinho pelo ID
        const pedido = await this.pedidoRepository.getById(pedidoId);
        if (!pedido) throw new NotFoundError("Pedido com esse ID não existe na aplicação.");
        if (valorPago != pedido.valorTotal) throw new BadRequestError("Valor do pedido e pagamento não batem.");
        pedido.statusPedido = "Pago";
        const [linhasAfetadas] = await this.pedidoRepository.update(pedido?.pedidoId, pedido);

        return linhasAfetadas;
    }

    public async getById(id: number): Promise<Pedido> {
        const pedido = await this.pedidoRepository.getById(id);
        if (!pedido) throw new NotFoundError("Pedido não encontrado");
        return pedido;
    }
}
export default PedidoServices;
