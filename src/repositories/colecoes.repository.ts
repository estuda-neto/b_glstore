import { injectable } from "inversify";
import BaseRepository from "./generics/base.repository";
import Colecao from "../models/colecao";

@injectable()
class ColecaoRepository extends BaseRepository<Colecao> {
  constructor() {
    super(Colecao);
  }

  async updateImagens(produtoId: number,imagemCapaUrl: string): Promise<[number]> {
    return this.update(produtoId, { imagemCapaUrl });
  }
}

export default ColecaoRepository;
