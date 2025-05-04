import { QueryInterface } from 'sequelize';

export async function up({ context }: { context: QueryInterface }): Promise<void> {
  await context.addConstraint('tb_categoriaproduto', {
    fields: ['categoriaId'],
    type: 'foreign key',
    name: 'fk_categoria_produto_categoria',
    references: {
      table: 'tb_categorias',
      field: 'categoriaId',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });

  await context.addConstraint('tb_categoriaproduto', {
    fields: ['produtoId'],
    type: 'foreign key',
    name: 'fk_categoria_produto_produto',
    references: {
      table: 'tb_produtos',
      field: 'produtoId',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });
}

export async function down({ context }: { context: QueryInterface }): Promise<void> {
  await context.removeConstraint('tb_categoriaproduto', 'fk_categoria_produto_categoria');
  await context.removeConstraint('tb_categoriaproduto', 'fk_categoria_produto_produto');
}
