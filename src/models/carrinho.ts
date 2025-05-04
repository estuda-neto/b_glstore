import Sequelize, { DataTypes } from "sequelize";
import sequelize from "../configs/database";
import Pedido from "./pedido";
import Usuario from "./usuario";
import { Models } from ".";
import ProdutoVariacao from "./produtovariacao";

interface CarrinhoAttributes {
    carrinhoId?: number;
    usuarioId:number;
    createdAt?: Date;
    updatedAt?: Date;
}

class Carrinho extends Sequelize.Model<CarrinhoAttributes> {
    declare carrinhoId: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    declare usuarioId: number;

    declare usuarioDoCarrinho?: Usuario;
    declare public produtosVariacoes?: ProdutoVariacao[];
    declare public pedido?: Pedido;

    public static associate(models: Models) {
        Carrinho.belongsToMany(models.ProdutoVariacao, {through: 'tb_carrinhoprodutovariacao',foreignKey: 'carrinhoId', as: 'produtosVariacoes'});
        Carrinho.hasOne(models.Pedido, {foreignKey: "carrinhoId",as: "pedido"});
        models.Pedido.belongsTo(Carrinho, {foreignKey: "carrinhoId",as: "carrinho"});
    }
    
    // Declarações de métodos de associação
    declare addProdutosVariacoes: (produtos: ProdutoVariacao[]) => Promise<void>;
}

Carrinho.init(
    {
        carrinhoId: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
        usuarioId: {type: DataTypes.INTEGER,allowNull: false,references: {model: "tb_usuarios",key: "usuarioId",},onUpdate: "CASCADE",onDelete: "CASCADE"},
    },
    {
        sequelize,
        tableName: "tb_carrinhos",
        timestamps: true,
    }
);

export default Carrinho;
