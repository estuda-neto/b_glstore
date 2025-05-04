import { injectable, inject } from "inversify";
import BaseService from "./generics/base.service";
import { ColecaoRepository } from "../repositories";
import Colecao from "../models/colecao";
import {
  InternalServerError,
  NotFoundError,
} from "../shared/middlewares/error";
import path from "path";

@injectable()
class ColecaoServices extends BaseService<Colecao> {
  constructor(@inject(ColecaoRepository) private colecaoRepository: ColecaoRepository) {
    super(colecaoRepository);
  }

  public async updateImagem(id: number, urlImagem: string): Promise<Colecao> {
    const colecao = await this.colecaoRepository.getById(id);

    if (!colecao) throw new NotFoundError("Coleção não encontrada");
    
    const extensoesPermitidas = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const extensao = path.extname(urlImagem).toLowerCase();

    if (!extensoesPermitidas.includes(extensao)) throw new Error("Extensão de imagem não suportada");

    const [linhasAfetadas] = await this.colecaoRepository.updateImagens(id,urlImagem);
    if (linhasAfetadas === 0) throw new InternalServerError("Error ao atualizar a imagem.");
    colecao.imagemCapaUrl = urlImagem;
    return colecao;
  }
}
export default ColecaoServices;
