import { QueryInterface } from 'sequelize';

export async function up({ context }: { context: QueryInterface }): Promise<void> {
  await context.addConstraint('tb_usuarionotificacao', {
    fields: ['notificacaoId'],
    type: 'foreign key',
    name: 'fk_usuario_notificacao_notificacao',
    references: {
      table: 'tb_notificacoes',
      field: 'notificacaoId',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });
}

export async function down({ context }: { context: QueryInterface }): Promise<void> {
  await context.removeConstraint('tb_usuarionotificacao', 'fk_usuario_notificacao_notificacao');
}
