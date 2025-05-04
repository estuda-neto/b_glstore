import Sequelize, { DataTypes } from "sequelize";
import sequelize from "../configs/database";
import Usuario from "./usuario";
import Pedido from "./pedido";

interface PagamentoAttributes {
    pagamentoId?: number;
    dataPagamento: Date;
    valorPago: number;
    metodoPagamento: string;
    statusPagamento: string;
    usuarioId: number | undefined;
    pedidoId: number | undefined;
    createdAt?: Date;
    updatedAt?: Date;
}

class Pagamento extends Sequelize.Model<PagamentoAttributes> {
    declare pagamentoId: number;
    declare dataPagamento: Date;
    declare valorPago: number;
    declare metodoPagamento: string;
    declare statusPagamento: string;

    declare usuarioId: number;

    declare pedidoId: number;

    declare createdAt: Date;
    declare updatedAt: Date;

    declare public readonly usuarioDoPagamento?: Usuario;
    declare public readonly pedido?: Pedido;

    public static associate() {}
}

Pagamento.init(
    {
        pagamentoId: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
        dataPagamento: {type: DataTypes.DATE,allowNull: false},
        valorPago: {type: DataTypes.DECIMAL(10, 2),allowNull: false},
        metodoPagamento: {type: DataTypes.STRING,allowNull: false},
        statusPagamento: {type: DataTypes.STRING,allowNull: false},
        usuarioId: {type: DataTypes.INTEGER,allowNull: false,references: {    model: "tb_usuarios",    key: "usuarioId",},onUpdate: "CASCADE",onDelete: "CASCADE"},
        pedidoId: {type: DataTypes.INTEGER,allowNull: false,references: {    model: "tb_pedidos",    key: "pedidoId",},onUpdate: "CASCADE",onDelete: "CASCADE"},
    },
    {
        sequelize,
        tableName: "tb_pagamentos",
        timestamps: true,
    }
);

export default Pagamento;
