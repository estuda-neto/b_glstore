import { injectable } from "inversify";
import BaseRepository from "./generics/base.repository";
import Categoria from "../models/categoria";

@injectable()
class CategoriaRepository extends BaseRepository<Categoria> {
    constructor() {
        super(Categoria);
    }

    // Você pode adicionar métodos específicos aqui
}

export default CategoriaRepository;

