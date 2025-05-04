import { injectable } from "inversify";
import Usuario from "../models/usuario";
import BaseRepository from "./generics/base.repository";


@injectable()
class UsuarioRepository extends BaseRepository<Usuario> {
    constructor() {
        super(Usuario);
    }

    // Você pode adicionar métodos específicos aqui
    public async findByEmail(email: string): Promise<Usuario | null> {
        return await Usuario.findOne({ where: { email } });
    }
}

export default UsuarioRepository;
