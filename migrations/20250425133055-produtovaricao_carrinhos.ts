import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

export async function up({ context }: { context: QueryInterface }): Promise<void> {
  await context.createTable('tb_carrinhoprodutovariacao', {
    carrinhoId: {type: DataTypes.INTEGER,allowNull: false,references: {  model: 'tb_carrinhos',  key: 'carrinhoId',},onUpdate: 'CASCADE',onDelete: 'CASCADE'},
    variacaoId: {type: DataTypes.INTEGER,allowNull: false,references: {  model: 'tb_produtovariacoes',  key: 'variacaoId',},onUpdate: 'CASCADE',onDelete: 'CASCADE'},
    createdAt: {type: DataTypes.DATE,allowNull: false,defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
    updatedAt: {type: DataTypes.DATE,allowNull: false,defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
  });
  
  await context.addIndex('tb_carrinhoprodutovariacao', ['carrinhoId', 'variacaoId'], {
    unique: true,
  });
}

export async function down({ context }: { context: QueryInterface }): Promise<void> {
  await context.dropTable('tb_carrinhoprodutovariacao');
}
