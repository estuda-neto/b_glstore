import Usuario from "./usuario";
import Produto from "./produto";
import Categoria from "./categoria";
import Carrinho from "./carrinho";
import Pedido from "./pedido";
import Pagamento from "./pagamento";
import Notificacao from "./notificacao";
import ProdutoVariacao from "./produtovariacao";
import Colecao from "./colecao";

export type Models = {
  Usuario: typeof Usuario;
  Produto: typeof Produto;
  Categoria: typeof Categoria;
  Carrinho: typeof Carrinho;
  Pedido: typeof Pedido;
  Pagamento: typeof Pagamento;
  Notificacao: typeof Notificacao;
  ProdutoVariacao: typeof ProdutoVariacao;
  Colecao: typeof Colecao;
};

const models: Models = {Usuario,Produto,Categoria,Carrinho,Pedido,Pagamento,Notificacao,ProdutoVariacao,Colecao};

export default models;

export function setupRelationships() {
  Notificacao.associate(models);
  Usuario.associate(models);
  Categoria.associate(models);
  Produto.associate(models);
  Carrinho.associate(models);
  Pedido.associate(models);
  Pagamento.associate();
  ProdutoVariacao.associate(models);
  Colecao.associate(models);
}
