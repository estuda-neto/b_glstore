import { injectable, inject } from "inversify";
import BaseService from "./generics/base.service";
import CategoriaRepository from "../repositories/categoria.repository";
import Categoria from "../models/categoria";

@injectable()
class CategoriaServices extends BaseService<Categoria>{

    constructor(@inject(CategoriaRepository) private categoriaRepository:CategoriaRepository){
        super(categoriaRepository);
    }
}
export default CategoriaServices;