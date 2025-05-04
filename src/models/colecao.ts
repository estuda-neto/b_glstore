import { DataTypes, Model } from "sequelize";
import sequelize from "../configs/database";
import { Models } from ".";
import Produto from "./produto";

// Interface dos atributos da entidade
interface ColecaoAttributes {
  colecaoId?: number;
  nome: string;
  nomeObjetos: string;
  descricao: string;
  slug: string;
  dataLancamento: Date;
  dataFim?: Date | null;
  imagemCapaUrl?: string;
  ativo: boolean;
  genero: string;
  tag: string;

  createdAt?: Date;
  updatedAt?: Date;
}

// Classe do modelo
class Colecao extends Model<ColecaoAttributes> {
  declare colecaoId: number;
  declare nome: string;
  declare nomeObjetos: string;
  declare descricao: string;
  declare slug: string;
  declare dataLancamento: Date;
  declare dataFim: Date | null;
  declare imagemCapaUrl?: string;
  declare ativo: boolean;
  declare genero: string;
  declare tag: string;

  declare createdAt: Date;
  declare updatedAt: Date;

  // Relacionamento com produtos
  declare readonly produtos?: Produto[];

  public static associate(model: Models) {
    Colecao.hasMany(model.Produto, { foreignKey: "colecaoId", as: "produtos" });
    model.Produto.belongsTo(Colecao, {foreignKey: "colecaoId",as: "colecao"});
  }
}

// Inicializando o modelo
Colecao.init(
  {
    colecaoId: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
    nome: { type: DataTypes.STRING, allowNull: false },
    nomeObjetos: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    dataLancamento: { type: DataTypes.DATE, allowNull: false },
    dataFim: { type: DataTypes.DATE, allowNull: true },
    imagemCapaUrl: { type: DataTypes.STRING, allowNull: true },
    ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    genero: { type: DataTypes.STRING, allowNull: false },
    tag: {type: DataTypes.STRING,allowNull: false,defaultValue: ''},
  },
  {
    sequelize,
    tableName: "tb_colecoes",
    timestamps: true,
  }
);

export default Colecao;
