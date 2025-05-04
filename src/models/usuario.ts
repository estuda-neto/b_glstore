import Sequelize, { DataTypes } from "sequelize";
import sequelize from "../configs/database";
import Produto from "./produto";
import Notificacao from "./notificacao";
import Pedido from "./pedido";
import Carrinho from "./carrinho";
import Pagamento from "./pagamento";
import bcrypt from "bcrypt";
import { Models } from ".";
import { TipoUsuario } from "../shared/enums/tipousuario";

interface UsuarioAttributes {
    usuarioId?: number;
    nome: string;
    cpf: string;
    email: string;
    password: string;
    telefone: string;
    endereco: string;
    tipoUsuario: TipoUsuario;
    createdAt?: Date;
    updatedAt?: Date;
}

class Usuario extends Sequelize.Model<UsuarioAttributes> {
    declare usuarioId: number;
    declare nome: string;
    declare cpf: string;
    declare email: string;
    declare password: string;
    declare telefone: string;
    declare endereco: string;
    declare tipoUsuario: TipoUsuario;
    declare createdAt: Date;
    declare updatedAt: Date;

    // declaração dos objetos de relacionamentos
    declare public readonly produtos?: Produto[];
    declare public readonly notificacoes?: Notificacao[];
    declare public readonly pedidos?: Pedido[];
    declare public readonly carrinho?: Carrinho;
    declare public readonly pagamentos?: Pagamento[];

    public static associate(models: Models) {
        Usuario.hasMany(models.Produto, {foreignKey: "usuarioId",as: "produtos"});
        models.Produto.belongsTo(Usuario, {foreignKey: "usuarioId",as: "usuarioDoProduto"});

        Usuario.belongsToMany(models.Notificacao, {through: "tb_usuarionotificacao",foreignKey: "usuarioId",as: "notificacoes"});

        Usuario.hasMany(models.Pedido, {foreignKey: "usuarioId",as: "pedidos"});
        models.Pedido.belongsTo(Usuario, {foreignKey: "usuarioId",as: "usuarioDoPedido"});

        Usuario.hasOne(models.Carrinho, {foreignKey: "usuarioId",as: "carrinho",onDelete: "CASCADE"});
        models.Carrinho.belongsTo(Usuario, {foreignKey: "usuarioId",as: "usuarioDoCarrinho"});

        Usuario.hasMany(models.Pagamento, {foreignKey: "usuarioId",as: "pagamentos"});
        models.Pagamento.belongsTo(Usuario, {foreignKey: "usuarioId",as: "usuarioDoPagamento"});
    }
}

Usuario.init(
    {
        usuarioId: {type: DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
        nome: { type: DataTypes.STRING, allowNull: false },
        cpf: { type: DataTypes.STRING, allowNull: false, unique: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        telefone: { type: DataTypes.STRING, allowNull: false },
        endereco: { type: DataTypes.STRING, allowNull: false },
        tipoUsuario: {type: DataTypes.ENUM(...Object.values(TipoUsuario)),allowNull: false},
    },
    {
        sequelize,
        tableName: "tb_usuarios",
        timestamps: true,
    }
);

// Listener para hash da senha antes de salvar
Usuario.beforeCreate(async (usuario) => {
    const password = usuario.getDataValue("password");
    if (password) {
        const salt = await bcrypt.genSalt(12);
        usuario.setDataValue("password", await bcrypt.hash(password, salt));
    } else {
        throw new Error("Password is required");
    }
});

//Listener para criar carrinho depois de criar usuario
Usuario.afterCreate(async (usuario) => {
    await Carrinho.create({ usuarioId: usuario.usuarioId });
});

export default Usuario;
