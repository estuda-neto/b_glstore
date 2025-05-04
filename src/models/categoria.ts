import Sequelize, { DataTypes } from "sequelize";
import sequelize from "../configs/database";
import Produto from "./produto";
import { Models } from ".";

interface CategoriaAttributes {
  categoriaId?: number;
  nome: string;
  descricao: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Categoria extends Sequelize.Model<CategoriaAttributes> {
  declare categoriaId: number;
  declare nome: string;
  declare descricao: string;

  declare createdAt: Date;
  declare updatedAt: Date;

  public declare readonly produtos?: Produto[];

  public static associate(models: Models) {
    Categoria.belongsToMany(models.Produto, {through: "tb_categoriaproduto",foreignKey: "categoriaId",as: "produtos"});
  }
}

Categoria.init(
  {
    categoriaId: {type: DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    nome: {type: DataTypes.STRING,allowNull: false},
    descricao: {type: DataTypes.STRING,allowNull: false},
  },
  {
    sequelize,
    tableName: "tb_categorias",
    timestamps: true,
  }
);

export default Categoria;
