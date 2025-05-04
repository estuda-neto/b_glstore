export enum TipoUsuario {
    ADMIN = "admin",
    CLIENTE = "cliente",
    FUNCIONARIO = "fornecedor",
}
export function fromString(value: string): TipoUsuario {
    // Converte uma string para o valor correspondente do enum TipoUsuario
    switch(value) {
        case 'cliente':
            return TipoUsuario.CLIENTE;
        case 'admin':
            return TipoUsuario.ADMIN;
        default:
            throw new Error("Tipo de usuário inválido.");
    }
}

