import Sequelize, { DataTypes } from "sequelize";
import sequelize from "../configs/database";
import Carrinho from "./carrinho";
import Categoria from "./categoria";
import Usuario from "./usuario";
import { Models } from ".";
import ProdutoVariacao from "./produtovariacao";

interface ProdutoAttributes {
  produtoId?: number;
  nome: string;
  descricao: string;
  imagens?: string[];
  quantEstoque: number;
  quantStarsAvaliacao:number;
  usuarioId: number;
  colecaoId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Produto extends Sequelize.Model<ProdutoAttributes> {
  declare produtoId: number;
  declare nome: string;
  declare descricao: string;
  declare imagens?: string[];
  declare quantEstoque: number;
  declare quantStarsAvaliacao:number;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare usuarioId: number;
  declare carrinhoId: number;
  declare colecaoId: number;

  // #1 declaração dos objetos de relacionamentos
  public declare readonly usuarioDoProduto?: Usuario | null;
  public declare readonly carrinho?: Carrinho | null;
  public declare readonly categorias?: Categoria[];
  public declare readonly variacoes?: ProdutoVariacao[];

  // #2 definição dos relacionamentos
  public static associate(models: Models) {
    Produto.belongsToMany(models.Categoria, {through: "tb_categoriaproduto",foreignKey: "produtoId",as: "categorias"});
    Produto.hasMany(models.ProdutoVariacao, {foreignKey: "produtoId",as: "variacoes"});
  }
}

Produto.init(
  {
    produtoId: {type: DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.STRING, allowNull: false },
    imagens: { type: DataTypes.JSON, allowNull: true },
    quantEstoque: { type: DataTypes.INTEGER, allowNull: false },
    quantStarsAvaliacao: {type: DataTypes.DECIMAL(2, 1),allowNull: false,defaultValue: 0.0},
    usuarioId: {type: DataTypes.INTEGER,allowNull: false,references: { model: "tb_usuarios", key: "usuarioId" },onUpdate: "CASCADE",onDelete: "CASCADE"},
    colecaoId: {type: DataTypes.INTEGER,allowNull: true,references: { model: "tb_colecoes", key: "colecaoId" },onUpdate: "CASCADE",onDelete: "CASCADE"},
  },
  {
    sequelize,
    modelName: "tb_produtos",
    timestamps: true,
  }
);

export default Produto;
