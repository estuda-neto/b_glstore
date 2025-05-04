import Sequelize, { DataTypes } from "sequelize";
import sequelize from "../configs/database";
import Pagamento from "./pagamento";
import Usuario from "./usuario";
import Carrinho from "./carrinho";
import { Models } from ".";

interface PedidoAttributes {
    pedidoId?: number;
    statusPedido: string;
    dataPedido: Date;
    dataEntrega: Date;
    valorTotal: number;
    usuarioId: number;
    carrinhoId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class Pedido extends Sequelize.Model<PedidoAttributes> {
    declare pedidoId: number;
    declare statusPedido: string;
    declare dataPedido: Date;
    declare dataEntrega: Date;
    declare valorTotal: number;

    declare createdAt: Date;
    declare updatedAt: Date;

    declare public usuarioId: number;
    declare public carrinhoId: number;

    declare public usuarioDoPedido?: Usuario;
    declare public carrinho?: Carrinho;

    declare public pedidoProdutos?: number[]
    declare public pedidoProdutosQuantidades?: number[]
    declare public pagamentos?: Pagamento[];

    public static associate(models: Models) {
        Pedido.belongsTo(models.Usuario, {foreignKey: "usuarioId",as: "usuario"});

        Pedido.hasMany(models.Pagamento, {foreignKey: "pedidoId",as: "pagamentos"});
    }
}

Pedido.init(
    {
        pedidoId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        statusPedido: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dataPedido: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        dataEntrega: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        valorTotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "tb_usuarios",
                key: "usuarioId",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        carrinhoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "tb_carrinhos",
                key: "carrinhoId",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
    },
    {
        sequelize,
        tableName: "tb_pedidos",
        timestamps: true,
    }
);

export default Pedido;
