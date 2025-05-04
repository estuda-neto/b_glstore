# Fazer urgente

- [ ] A priori faze a logica de salvamento de variação do produto para adicionar ao carrinho.
- [ ] Transformar um carrinho em pedido.

## 4. CategoriaController
Organiza os produtos em categorias.
- [ ] GET /categorias – Listar categorias
- [ ] POST /categorias – Criar categoria (admin)
- [ ] PUT /categorias/{id} – Atualizar categoria (admin)
- [ ] DELETE /categorias/{id} – Remover categoria (admin)

## 5. CarrinhoController
Gerencia os produtos que o usuário deseja comprar.
- [ ] GET /carrinho – Ver itens do carrinho do usuário logado
- [ ] POST /carrinho – Adicionar item ao carrinho
- [ ] PUT /carrinho/{itemId} – Atualizar quantidade de um item
- [ ] DELETE /carrinho/{itemId} – Remover item
- [ ] DELETE /carrinho – Esvaziar carrinho

## 6. PedidoController
Controla o fechamento do carrinho e criação de pedidos.
- [ ] POST /pedidos – Finalizar compra (gera pedido a partir do carrinho.
- [ ] GET /pedidos – Listar pedidos do usuário
- [ ] GET /pedidos/{id} – Ver detalhes de um pedido
- [ ] GET /admin/pedidos – Listar pedidos de todos os usuários (admin)
- [ ] PUT /admin/pedidos/{id}/status – Atualizar status (ex: enviado, entregue) (admin)

## 7. PagamentoController
Lida com o pagamento dos pedidos.
- [ ] POST /pagamentos/checkout – Iniciar pagamento (Pix, cartão, boleto)
- [ ] GET /pagamentos/status/{pedidoId} – Verificar status de pagamento
- [ ] POST /pagamentos/webhook – Receber notificações da API de pagamento

## 8. NotificacaoController
Gerencia notificações (ex: status de pedido, promoções).
- [ ] GET /notificacoes/usuarios/id – Ver notificações do usuário logado
- [ ] POST /notificacoes – Criar notificação (admin)
- [ ] PUT /notificacoes/{id}/visualizar – Marcar como lida
- [ ] DELETE /notificacoes/{id} – Remover notificação
Segurança e boas práticas
JWT + Roles (user, admin)
Middleware de autenticação para proteger rotas
Validações com DTOs e schemas (ex: Yup, class-validator)
Sanitização de in- [ ] puts
Paginação nas listas
Logs e auditoria para pedidos e pagamentos
Se quiser, posso montar os DTOs ou rotas Swagger, ou até a estrutura de pastas para isso. Só falar!


## NOTADO!

# 📥 GET /recurso (listar todos)
Erros comuns:
  400 Bad Request: parâmetros de query inválidos (ex: paginação malformada).
  401 Unauthorized: token de autenticação ausente ou inválido.
  403 Forbidden: usuário autenticado não tem permissão para acessar o recurso.
  500 Internal Server Error: erro inesperado no servidor (ex: falha na consulta ao banco).
  **diferença nao tem 404 pois retorna [ ]**

# 📥 GET /recurso/{id} (buscar por ID)
Erros comuns:
  400 Bad Request: ID malformado (ex: string quando deveria ser number).
  401 Unauthorized
  403 Forbidden
  404 Not Found: recurso com o ID informado não existe.
  500 Internal Server Error

# ➕ POST /recurso (criação)
Erros comuns:
  400 Bad Request: corpo da requisição inválido ou campos obrigatórios ausentes.
  401 Unauthorized
  403 Forbidden
  409 Conflict: recurso com campos únicos duplicados (ex: email já existente).
  422 Unprocessable Entity: campos válidos sintaticamente mas com erros semânticos (mais comum em APIs REST modernas).
  500 Internal Server Error
  **diferença possui 409 e 422**

# ❌ DELETE /recurso/{id}
Erros comuns:
  400 Bad Request: ID inválido ou não permitido para exclusão.
  401 Unauthorized
  403 Forbidden
  404 Not Found
  409 Conflict: recurso está vinculado a outros dados e não pode ser deletado.
  500 Internal Server Error
  **diferença pro get que o get nao possui 409**


# 🔁 PUT ou PATCH /recurso/{id} (atualização)
Erros comuns:
  400 Bad Request: dados inválidos ou corpo malformado.
  401 Unauthorized  
  403 Forbidden
  404 Not Found: recurso com o ID informado não existe.
  409 Conflict: violação de integridade de dados.
  422 Unprocessable Entity
  500 Internal Server Error
  **diferença do post é que possui 404**

