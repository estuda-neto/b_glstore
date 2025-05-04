import { injectable, inject } from "inversify";
import BaseService from "./generics/base.service";
import Produto from "../models/produto";
import ProdutoRepository from "../repositories/produtos.repository";
import path from "path";
import { NotFoundError } from "../shared/middlewares/error";
import CategoriaServices from "./categorias.service";

@injectable()
class ProdutoServices extends BaseService<Produto> {
  constructor(
    @inject(ProdutoRepository) private produtoRepository: ProdutoRepository,
    @inject(CategoriaServices) private categoriaServices: CategoriaServices
  ) {
    super(produtoRepository);
  }

  public async updateImagens(
    id: number,
    urlImagem: string,
    posicao: number
  ): Promise<number> {
    const produto = await this.produtoRepository.getById(id);

    if (!produto) {
      throw new NotFoundError("Produto não encontrado");
    }

    // Validação da URL da imagem
    const extensoesPermitidas = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const extensao = path.extname(urlImagem).toLowerCase();

    if (!extensoesPermitidas.includes(extensao)) {
      throw new Error("Extensão de imagem não suportada");
    }

    // Inicializa array de imagens se necessário
    const imagens = Array.isArray(produto.imagens) ? [...produto.imagens] : [];

    // Garante que a posição é um número positivo e inteiro
    if (!Number.isInteger(posicao) || posicao < 0) {
      throw new Error("Posição inválida para a imagem");
    }

    // Ajusta o array para ter espaço até a posição indicada
    if (posicao >= imagens.length) {
      imagens.length = posicao + 1; // Preenche com `undefined`
    }

    imagens[posicao] = urlImagem;
    produto.imagens = imagens;

    const [linhasAfetadas] = await this.produtoRepository.updateImagens(
      id,
      produto.imagens
    );
    return linhasAfetadas;
  }

  public async getByIdWithVariacoes(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.getByIdWithVariacoes(id);
    if (!produto) throw new NotFoundError("Produto não encontrado");
    return produto;
  }

  public async getProdutosByCategoriaId(categoriaId: number): Promise<Produto[]> {
    const categoria = this.categoriaServices.getById(categoriaId);
    if(!categoria) throw new NotFoundError("A categoria com esse id não foi encontrada.")
    const produtos = this.produtoRepository.findByCategoriaId(categoriaId);
    return produtos;
  }
}
export default ProdutoServices;
