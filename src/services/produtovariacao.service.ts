import { injectable, inject } from "inversify";
import BaseService from "./generics/base.service";
import ProdutoVariacao from "../models/produtovariacao";
import { ProdutoVariacaoRepository } from "../repositories";
import ProdutoServices from "./produtos.service";
import { NotFoundError } from "../shared/middlewares/error";

type AtualizavelProdutoVariacao = Partial<Pick<ProdutoVariacao,'preco' | 'tamanho' | 'cor' | 'quantEstoque' | 'produtoId'>>;

@injectable()
class ProdutoVariacaoServices extends BaseService<ProdutoVariacao> {
    constructor(
      @inject(ProdutoVariacaoRepository) private readonly produtoVaricaoRepository: ProdutoVariacaoRepository,
      @inject(ProdutoServices) private readonly produtoServices: ProdutoServices,
    ) {
        super(produtoVaricaoRepository);
    }

    public async getAllForId(id: number): Promise<ProdutoVariacao[]> {
      const produto = await this.produtoServices.getById(id);
      if (!produto) throw new NotFoundError("Variação não encontrada");
      const produtoVariacoes = await this.produtoVaricaoRepository.findAllForProdutoId(produto.produtoId);
      return produtoVariacoes;
  }

  public async updatePartial(id: number, data: AtualizavelProdutoVariacao): Promise<number> {
    const variacao = await this.produtoVaricaoRepository.getById(id);
    if (!variacao) throw new NotFoundError("Variação não encontrada");
  
    const camposParaAtualizar: AtualizavelProdutoVariacao = {};
  
    for (const campo of Object.keys(data) as (keyof AtualizavelProdutoVariacao)[]) {
      const valor = data[campo];
      if (valor !== undefined) {
        // Aqui forçamos o tipo corretamente
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        camposParaAtualizar[campo] = valor as any;
      }
    }
  
    const [linhasAfetadas] = await this.produtoVaricaoRepository.update(id, camposParaAtualizar);
    return linhasAfetadas;
  }

  public async getByAtributes(produtoId: number, cor: string, tamanho: string):Promise<ProdutoVariacao>{
    const variacao = await this.produtoVaricaoRepository.findByAtributos(produtoId,cor, tamanho);
    if(!variacao) throw new NotFoundError("Variação desse produto não existe.");
    return variacao;
  }
      
}
export default ProdutoVariacaoServices;
