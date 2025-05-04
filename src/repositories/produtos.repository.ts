import { injectable } from "inversify";
import Produto from "../models/produto";
import BaseRepository from "./generics/base.repository";

@injectable()
class ProdutoRepository extends BaseRepository<Produto> {
    constructor() {
        super(Produto);
    }

    // Você pode adicionar métodos específicos aqui
    async updateImagens(produtoId: number, imagens: string[]): Promise<[number]> {
        return this.update(produtoId, { imagens });
    }

    async getByIdWithVariacoes(produtoId: number): Promise<Produto | null> {
      return await Produto.findByPk(produtoId, {include: [{association: 'variacoes'}]});
    }
    async findByCategoriaId(categoriaId: number): Promise<Produto[]> {
      return await Produto.findAll({
        include: [
          {
            association: 'categorias',
            where: { id: categoriaId },
            attributes: []
          }
        ]
      });
    }
   
}

export default ProdutoRepository;