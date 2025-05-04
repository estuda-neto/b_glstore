import { injectable, inject } from "inversify";
import BaseService from "./generics/base.service";
import Carrinho from "../models/carrinho";
import CarrinhoRepository from "../repositories/carrinho.repository";
import { BadRequestError, NotFoundError } from "../shared/middlewares/error";

@injectable()
class CarrinhoServices extends BaseService<Carrinho> {
    constructor(
        @inject(CarrinhoRepository)
        private readonly carrinhoRepository: CarrinhoRepository
    ) {
        super(carrinhoRepository);
    }

    public async getCarrinhoByUsuarioId(usuarioId: number) {
        const carrinho = await this.carrinhoRepository.findByUsuarioId(
            usuarioId
        );
        if (!carrinho) {
            throw new NotFoundError(
                "Carrinho com usuarioId igual a esse não existe na Aplicação."
            );
        }
        return carrinho;
    }
    
    public async getCarrinhoWithVariacoesByUsuarioId(usuarioId: number) {
      const carrinho = await this.carrinhoRepository.getCarrinhoWithVariacoesByUsuarioId(usuarioId);
    
      if (!carrinho) {
        throw new Error("Carrinho não encontrado para o usuário");
      }
    
      return carrinho;
    }

    public async getCarrinhoWithVariacoes(carrinhoId: number) {
      const carrinho = await this.carrinhoRepository.getCarrinhoWithVariacoes(carrinhoId);
    
      if (!carrinho) {
        throw new Error("Carrinho não encontrado para o usuário");
      }
    
      return carrinho;
    }

    public async adicionarProdutoCarrinho(usuarioId: number, variacaoId: number): Promise<Carrinho> {
        const carrinho = await this.getCarrinhoByUsuarioId(usuarioId);
        const carrinhoComProduto = await this.carrinhoRepository.adicionarProdutoVariacao(carrinho.carrinhoId, variacaoId);
        if (!carrinhoComProduto)
            throw new BadRequestError("Dados de requisição invalidados");
        return carrinhoComProduto;
    }

    public async limparCarrinho(carrinhoId: number): Promise<void> {
        const carrinho = await this.getById(carrinhoId);
        if (!carrinho) throw new NotFoundError("Carrinho com esse ID não existe na aplicação.");
    
        // Remover todos os produtos do carrinho
        carrinho.produtosVariacoes = [];
        
        // Atualizar o carrinho no banco de dados
        await this.carrinhoRepository.save(carrinho);
    }
}
export default CarrinhoServices;
