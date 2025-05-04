import Sequelize, { DataTypes } from "sequelize";
import sequelize from "../configs/database";
import Usuario from "./usuario";
import { Models } from ".";

interface NotificacaoAttributes {
    notificacaoId?: number;
    mensagem: string;
    status: string;
    dataEnvio: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

class Notificacao extends Sequelize.Model<NotificacaoAttributes> {
    declare notificacaoId: number;
    declare mensagem: string;
    declare status: string;
    declare dataEnvio: Date;

    declare createdAt: Date;
    declare updatedAt: Date;

    declare usuarios?: Usuario[];

    public static associate(models: Models) {
      Notificacao.belongsToMany(models.Usuario, {through: "tb_usuarionotificacao",foreignKey: "notificacaoId",otherKey: "usuarioId",as: "usuarios"});
    }

    // Métodos mágicos adicionados pelo Sequelize
    declare public addUsuarios: (usuarios: Usuario[] | number[]) => Promise<void>;
    declare public setUsuarios: (usuarios: Usuario[] | number[]) => Promise<void>;
    declare public getUsuarios: () => Promise<Usuario[]>;
}

Notificacao.init(
    {
        notificacaoId: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
        mensagem: {type: DataTypes.STRING,allowNull: false, defaultValue: 'Notificacao padrão'},
        status: {type: DataTypes.STRING,allowNull: false},
        dataEnvio: {type: DataTypes.DATE,allowNull: false},
    },
    {
        sequelize,
        tableName: "tb_notificacoes",
        timestamps: true,
    }
);

export default Notificacao;
