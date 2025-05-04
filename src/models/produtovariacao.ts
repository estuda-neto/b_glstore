import Sequelize, { DataTypes } from "sequelize";
import sequelize from "../configs/database";
import { Models } from ".";
import Produto from "./produto";
import Carrinho from "./carrinho";

interface ProdutoVariacaoAttributes {
  variacaoId?: number;
  preco: number;
  tamanho: string;
  cor: string;
  sexo:string;
  quantEstoque: number;
  produtoId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class ProdutoVariacao extends Sequelize.Model<ProdutoVariacaoAttributes> {
  declare variacaoId: number;
  declare preco: number;
  declare tamanho: string;
  declare cor: string;
  declare sexo:string;
  declare quantEstoque: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare produtoId: number;
  declare carrinhoId: number;

  // declaração dos objetos de relacionamentos
  public declare readonly produto?: Produto | null;
  public declare readonly carrinhos?: Carrinho[]; // Associação para carrinhos

  // definição dos relacionamentos
  public static associate(models: Models) {
    ProdutoVariacao.belongsToMany(models.Carrinho, {through: 'tb_carrinhoprodutovariacao',foreignKey: 'variacaoId',as: 'carrinhos'});
    ProdutoVariacao.belongsTo(models.Produto, {foreignKey: "produtoId",as: "produto"});
  }
}

ProdutoVariacao.init(
  {
    variacaoId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    tamanho: { type: DataTypes.STRING, allowNull: false },
    cor: { type: DataTypes.STRING, allowNull: false },
    sexo: { type: DataTypes.STRING, allowNull: false },
    quantEstoque: { type: DataTypes.INTEGER, allowNull: false },
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "tb_produtos", key: "produtoId" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "tb_produtovariacoes",
    timestamps: true,
  }
);

export default ProdutoVariacao;
