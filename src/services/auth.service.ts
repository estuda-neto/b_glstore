import { injectable, inject } from "inversify";
import { UsuarioRepository } from "../repositories";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Usuario from "../models/usuario";
import { TipoUsuario } from "../shared/enums/tipousuario";

@injectable()
class AuthServices {
    private JWT_SECRET = process.env.JWT_SECRET!;
    private JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

    constructor(@inject(UsuarioRepository) private readonly usuarioRepository: UsuarioRepository) {
        dotenv.config();
    }

    public generateToken(usuarioId: string, tipoUsuario:TipoUsuario , clientType: "web" | "mobile") {
        const expiresIn = clientType === "web" ? "30m" : "7d";

        return jwt.sign({ usuarioId, tipoUsuario, clientType }, this.JWT_SECRET, { expiresIn });
    }

    public generateRefreshToken(usuarioId: string) {
        return jwt.sign({ usuarioId }, this.JWT_REFRESH_SECRET, { expiresIn: "30d" });
    }

    public async login(email: string, password: string, clientType: "web" | "mobile") {
        const usuario: Usuario | null = await this.usuarioRepository.findByEmail(email);
        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }

        const passwordMatch = await bcrypt.compare(password, usuario.password);
        if (!passwordMatch) {
            throw new Error("Senha incorreta");
        }

        const accessToken = this.generateToken(usuario.usuarioId.toString(), usuario.tipoUsuario,clientType);
        const refreshToken = this.generateRefreshToken(usuario.usuarioId.toString());

        return { accessToken, refreshToken };
    }
}
export default AuthServices;
