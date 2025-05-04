import { injectable } from "inversify";
import Carrinho from "../models/carrinho";
import BaseRepository from "./generics/base.repository";
import ProdutoVariacao from "../models/produtovariacao";

@injectable()
class CarrinhoRepository extends BaseRepository<Carrinho> {
  constructor() {
    super(Carrinho);
  }

  // Você pode adicionar métodos específicos aqui
  public async findByUsuarioId(usuarioId: number): Promise<Carrinho | null> {
    return await Carrinho.findOne({ where: { usuarioId } });
  }

  public async save(carrinho: Carrinho): Promise<Carrinho> {
    return await carrinho.save();
  }

  public async adicionarProdutoVariacao(carrinhoId: number, variacaoId: number): Promise<Carrinho | null> {
    const carrinho = await Carrinho.findByPk(carrinhoId, {include: ["produtosVariacoes"]});
    if (!carrinho) throw new Error("Carrinho não encontrado");
  
    // Buscando a variação do produto
    const variacao = await ProdutoVariacao.findByPk(variacaoId);
    if (!variacao) throw new Error("Produto não encontrado");
  
    // Adicionando a variação de produto ao carrinho (usando o método plural)
    await carrinho.addProdutosVariacoes([variacao]);  // Usando o método correto (plural)
  
    // Retornando o carrinho atualizado
    return await Carrinho.findByPk(carrinhoId, {include: ["produtosVariacoes"]});
  }

  public async getCarrinhoWithVariacoesByUsuarioId(usuarioId: number): Promise<Carrinho | null> {
    return await Carrinho.findOne({where: { usuarioId }, include: [
        {
          association: 'produtosVariacoes', // ou o nome da associação no modelo
          required: false, // opcional: se quiser retornar carrinho mesmo sem produtos
          through: { attributes: [] },
        },
      ],
    });
  }

  public async getCarrinhoWithVariacoes(carrinhoId: number): Promise<Carrinho | null> {
    return await Carrinho.findOne({where: { carrinhoId }, include: [{association: 'produtosVariacoes',required: false,through: { attributes: [] }}]});
  }
  


}

export default CarrinhoRepository;
