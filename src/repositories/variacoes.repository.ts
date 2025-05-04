import { injectable } from "inversify";
import BaseRepository from "./generics/base.repository";
import ProdutoVariacao from "../models/produtovariacao";

@injectable()
class ProdutoVariacaoRepository extends BaseRepository<ProdutoVariacao> {
  constructor() {
    super(ProdutoVariacao);
  }

  async findAllForProdutoId(produtoId: number): Promise<ProdutoVariacao[]> {
    return await ProdutoVariacao.findAll({ where: { produtoId: produtoId } });
  }

  async findByAtributos(produtoId: number, cor: string, tamanho: string): Promise<ProdutoVariacao | null> {
    return await ProdutoVariacao.findOne({where: {produtoId,cor,tamanho}});
  }

}
export default ProdutoVariacaoRepository;
