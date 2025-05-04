import { injectable, inject } from "inversify";
import BaseService from "./generics/base.service";
import Pagamento from "../models/pagamento";
import PagamentoRepository from "../repositories/pagamento.repository";
import PedidoServices from "./pedidos.service";
import EfiPaymentService from "./efipayment.service";
import { BadRequestError, NotFoundError } from "../shared/middlewares/error";
import {PagamentoPixDtoType,RealizarPagamentoDtoType} from "../shared/dtos/pagamento.dto";
import {AddressInfo, BoletoChargePayload,BoletoPaymentResponse,ChargeItem,CustomerInfo,PixChargePayload} from "../shared/utils/interfaces.efi";
import ProdutoServices from "./produtos.service";
import Produto from "../models/produto";
import ProdutoVariacaoServices from "./produtovariacao.service";
import ProdutoVariacao from "../models/produtovariacao";

@injectable()
class PagamentoServices extends BaseService<Pagamento> {
    constructor(
        @inject(PagamentoRepository) private pagamentoRepository: PagamentoRepository,
        @inject(PedidoServices) private pedidosServices: PedidoServices,
        @inject(ProdutoServices) private produtosServices: ProdutoServices,
        @inject(ProdutoVariacaoServices) private produtosVariacoesServices: ProdutoVariacaoServices,
        @inject(EfiPaymentService) private efiPaymentServices: EfiPaymentService
    ) {
        super(pagamentoRepository);
    }

    public async getById(id: number): Promise<Pagamento> {
        const pagamento = await this.pagamentoRepository.getById(id);
        if (!pagamento) throw new NotFoundError("Pagamento não encontrado");
        return pagamento;
    }

    public async update(id: number,data: Partial<Pagamento>): Promise<[number]> {
        const pagamentoExistente = await this.pagamentoRepository.getById(id);
        if (!pagamentoExistente) throw new NotFoundError("Pagamento não encontrado");

        if (data.pedidoId) {
            const pedido = await this.pedidosServices.getById(data.pedidoId);
            if (!pedido) throw new NotFoundError("Pedido não encontrado");
        }

        const [updatedCount] = await this.pagamentoRepository.update(id, data);
        return [updatedCount];
    }

    public async delete(id: number): Promise<void> {
        const pagamento = await this.pagamentoRepository.getById(id);
        if (!pagamento) throw new NotFoundError("Pagamento não encontrado");
        await this.pagamentoRepository.delete(id);
    }

    public async findByPedidoId(pedidoId: number): Promise<Pagamento[]> {
        return await this.pagamentoRepository.findByPedidoId(pedidoId);
    }

    public async findByStatus(status: string): Promise<Pagamento[]> {
        return await this.pagamentoRepository.findByStatus(status);
    }

    public async findByDateRange(startDate: Date,endDate: Date): Promise<Pagamento[]> {
        return await this.pagamentoRepository.findByDateRange(
            startDate,
            endDate
        );
    }

    public async findByPaymentMethod(paymentMethod: string): Promise<Pagamento[]> {
        return await this.pagamentoRepository.findByPaymentMethod(
            paymentMethod
        );
    }

    public async findByTransactionId(transactionId: number): Promise<Pagamento> {
        const pagamento = await this.pagamentoRepository.findByTransactionId(
            transactionId
        );
        if (!pagamento) {
            throw new NotFoundError("Pagamento não encontrado com este ID de transação");
        }
        return pagamento;
    }

    public async realizarPagamento(dadosPagamento: RealizarPagamentoDtoType): Promise<Pagamento | PagamentoPixDtoType | BoletoPaymentResponse> {
        const pedido = await this.pedidosServices.getById(dadosPagamento.pedidoId);
        if (!pedido) throw new NotFoundError("Pedido não encontrado");

        const listaProdutos: ChargeItem[] = [];

        await Promise.all(
            pedido.pedidoProdutos?.map(async (variacaoId, index) => {
              const prdutovariacao: ProdutoVariacao = await this.produtosVariacoesServices.getById(variacaoId);
              const produto: Produto = await this.produtosServices.getById(prdutovariacao.produtoId);

                if (prdutovariacao && produto) {
                    listaProdutos.push({name: produto.nome, value: prdutovariacao.preco,amount: pedido.pedidoProdutosQuantidades? pedido.pedidoProdutosQuantidades[index]: 0} as ChargeItem);
                }
            }) || []
        );
        const valorTotal = listaProdutos.reduce((acc, item) => {
            return acc + item.value * item.amount;
        }, 0);

        switch (dadosPagamento.metodo) {
            case "pix": {
                const chavePix: string = await this.efiPaymentServices.createRandomPixKey();
                const cobrancaId = await this.efiPaymentServices.createImmediateChargePix({chavePix: chavePix,valor: dadosPagamento.valor,nome: dadosPagamento.nome,cpf: dadosPagamento.cpf,descricao: dadosPagamento.descricao} as PixChargePayload);
                const locId = cobrancaId.loc?.id;
                if (!locId)throw new BadRequestError("Erro ao criar cobrança PIX");
                const qrcode = await this.efiPaymentServices.generatePixQrCode(locId);
                if (!qrcode) throw new BadRequestError("Erro ao gerar QRCode");
                const imagemQrcode = qrcode.imagemQrcode;
                const qrcodeUrl = qrcode.qrcode;

                const pagamento = new Pagamento({pedidoId: dadosPagamento.pedidoId,valorPago: dadosPagamento.valor,statusPagamento: "pendente",metodoPagamento: "pix",dataPagamento: new Date(),usuarioId: pedido.usuarioId,createdAt: new Date(),updatedAt: new Date()});
                await this.pagamentoRepository.create(pagamento);
                return { imagemQrcode, qrcodeUrl } as PagamentoPixDtoType;
            }
            case "boleto": {
                const payload: BoletoChargePayload = {
                    items: listaProdutos,
                    customer: {name: dadosPagamento.nome,cpf: dadosPagamento.cpf,phone_number: dadosPagamento.telefone || "",email: dadosPagamento.email,birth: dadosPagamento.birth},
                    expireAt: pedido.dataEntrega.toISOString().split("T")[0] || "", // Formato YYYY-MM-DD
                };
                const chargeBoleto = await this.efiPaymentServices.createBoletoPaymentLink(payload);

                const pagamentoBoleto = new Pagamento({pedidoId: dadosPagamento.pedidoId,valorPago: valorTotal,statusPagamento: "pendente", metodoPagamento: "boleto", dataPagamento: new Date(), usuarioId: pedido.usuarioId, createdAt: new Date(), updatedAt: new Date()});

                await this.pagamentoRepository.create(pagamentoBoleto);

                const boletoId = chargeBoleto.charge_id;
                const boletoLink = chargeBoleto.data?.link || "";
                const boletoBarcode = chargeBoleto.data?.codigo_barras || "";

                const boletoPaymentResponse: BoletoPaymentResponse = {
                    charge_id: boletoId,
                    status: chargeBoleto.status,
                    total: chargeBoleto.total,
                    link: boletoLink,
                    payment: {
                        banking_billet: {
                            expire_at: chargeBoleto.payment.banking_billet.expire_at,
                            barcode: boletoBarcode,
                            link: boletoLink,
                            pdf: chargeBoleto.payment.banking_billet.pdf,
                        },
                    },
                };
                return boletoPaymentResponse;
            }
            case "cartao": {
                const devedor:CustomerInfo = {name: dadosPagamento.nome,cpf: dadosPagamento.cpf,phone_number: dadosPagamento.telefone || "", email: dadosPagamento.email, birth: dadosPagamento.birth};
                const endereco:AddressInfo = {rua:dadosPagamento.endereco.rua,numero:dadosPagamento.endereco.numero,bairro:dadosPagamento.endereco.bairro,cep:dadosPagamento.endereco.cep,cidade:dadosPagamento.endereco.cidade,estado:dadosPagamento.endereco.estado};
                
                // 1º cria a cobrança
                const charge = await this.efiPaymentServices.createCreditCardCharge(listaProdutos, devedor);

                // 2º realiza o pagamento com o token
                const dataCard = await this.efiPaymentServices.payWithCreditCard(charge.charge_id,
                    dadosPagamento.payment_token ?? "",
                    devedor,
                    endereco,
                    dadosPagamento.numeroParcelas || 1
                );

                const pagamentoCartao = new Pagamento({pedidoId: dadosPagamento.pedidoId,valorPago: dataCard.data.total,statusPagamento: "pendente",metodoPagamento: "cartao", dataPagamento: new Date(), usuarioId: pedido.usuarioId, createdAt: new Date(), updatedAt: new Date()});
                await this.pagamentoRepository.create(pagamentoCartao);
                return pagamentoCartao;
            }
            default:
                throw new BadRequestError("Método de pagamento inválido.");
        }
    }
}

export default PagamentoServices;
