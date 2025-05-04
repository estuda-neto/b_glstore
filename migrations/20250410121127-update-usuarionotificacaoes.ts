import { QueryInterface, DataTypes } from 'sequelize';

export async function up({ context }: { context: QueryInterface }): Promise<void> {
  await context.addColumn('tb_usuarionotificacao', 'notificacaoId', {
    type: DataTypes.INTEGER,
    allowNull: false,
  });
}

export async function down({ context }: { context: QueryInterface }): Promise<void> {
  await context.removeColumn('tb_usuarionotificacao', 'notificacaoId');
}
