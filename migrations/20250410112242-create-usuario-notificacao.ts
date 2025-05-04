import { QueryInterface, DataTypes } from 'sequelize';

export async function up({ context }: { context: QueryInterface }): Promise<void> {
  await context.createTable('tb_usuarionotificacao', {
    usuarionotificaoId: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
    usuarioId: {type: DataTypes.INTEGER,allowNull: false},
    createdAt: {type: DataTypes.DATE,allowNull: false},
    updatedAt: {type: DataTypes.DATE,allowNull: false},
  });
}

export async function down({ context }: { context: QueryInterface }): Promise<void> {
  await context.dropTable('tb_usuarionotificacao');
}
