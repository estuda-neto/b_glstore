import express,{Request, Response, NextFunction} from "express";
import { container } from "../configs/container";
import { middlewareAdvice } from "../shared/middlewares/middlewareAdvice";
import { mdl_verificaId } from "../shared/middlewares/middleware.utils";
import { PagamentoController } from "../controllers";
import { CreatePagamentoDto, RealizarPagamentoDto, UpdatePagamentoDto } from "../shared/dtos/pagamento.dto";
import { validateSchema } from "../shared/middlewares/middleware.generic";
import { authenticate } from "../shared/middlewares/middlewareAuth";
import { authorize } from "../shared/middlewares/middlewareAuthorize";
import { TipoUsuario } from "../shared/enums/tipousuario";

const router = express.Router();
const pagamentosController = container.get<PagamentoController>(PagamentoController);

/**
* @swagger
* tags:
*    - name: Pagamentos
*      description: Endpoints para gerenciar Pagamentos
*/

// schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePagamentoDto:
 *       type: object
 *       required:
 *         - dataPagamento
 *         - valorPago
 *         - metodoPagamento
 *         - statusPagamento
 *         - usuarioId
 *         - pedidoId
 *       properties:
 *         dataPagamento:
 *           type: string
 *           format: date
 *           example: "2025-04-30"
 *           description: A data do pagamento
 *         valorPago:
 *           type: number
 *           minimum: 0
 *           example: 150.75
 *           description: O valor pago
 *         metodoPagamento:
 *           type: string
 *           enum: ["cartao", "boleto", "pix", "transferencia"]
 *           example: "pix"
 *           description: O método de pagamento
 *         statusPagamento:
 *           type: string
 *           enum: ["pendente", "aprovado", "rejeitado"]
 *           example: "pendente"
 *           description: O status do pagamento
 *         usuarioId:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *           description: O ID do usuário que fez o pagamento
 *         pedidoId:
 *           type: integer
 *           minimum: 1
 *           example: 1001
 *           description: O ID do pedido relacionado ao pagamento
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePagamentoDto:
 *       type: object
 *       properties:
 *         dataPagamento:
 *           type: string
 *           format: date
 *           example: "2025-04-30"
 *           description: A data do pagamento
 *         valorPago:
 *           type: number
 *           minimum: 0
 *           example: 150.75
 *           description: O valor pago
 *         metodoPagamento:
 *           type: string
 *           enum: ["cartao", "boleto", "pix", "transferencia"]
 *           example: "pix"
 *           description: O método de pagamento
 *         statusPagamento:
 *           type: string
 *           enum: ["pendente", "aprovado", "rejeitado"]
 *           example: "aprovado"
 *           description: O status do pagamento
 *         usuarioId:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *           description: O ID do usuário
 *         pedidoId:
 *           type: integer
 *           minimum: 1
 *           example: 1001
 *           description: O ID do pedido
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RealizarPagamentoDto:
 *       type: object
 *       required:
 *         - pedidoId
 *         - valor
 *         - nome
 *         - email
 *         - cpf
 *         - metodo
 *       properties:
 *         pedidoId:
 *           type: integer
 *           minimum: 1
 *           example: 1001
 *           description: O ID do pedido
 *         valor:
 *           type: number
 *           minimum: 0
 *           example: 150.75
 *           description: O valor do pagamento
 *         nome:
 *           type: string
 *           example: "João Silva"
 *           description: O nome do pagador
 *         email:
 *           type: string
 *           example: "joao.silva@example.com"
 *           description: O e-mail do pagador
 *         cpf:
 *           type: string
 *           example: "12345678901"
 *           description: O CPF do pagador
 *         telefone:
 *           type: string
 *           example: "1234567890"
 *           description: O telefone do pagador
 *         endereco:
 *           type: object
 *           required:
 *             - rua
 *             - numero
 *             - bairro
 *             - cep
 *             - cidade
 *             - estado
 *           properties:
 *             rua:
 *               type: string
 *               example: "Rua A"
 *               description: A rua do endereço
 *             numero:
 *               type: string
 *               example: "123"
 *               description: O número da casa ou prédio
 *             bairro:
 *               type: string
 *               example: "Bairro X"
 *               description: O bairro do endereço
 *             cep:
 *               type: string
 *               example: "12345678"
 *               description: O CEP do endereço
 *             cidade:
 *               type: string
 *               example: "Cidade Y"
 *               description: A cidade do endereço
 *             estado:
 *               type: string
 *               example: "SP"
 *               description: O estado do endereço
 *         birth:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *           description: A data de nascimento do pagador
 *         descricao:
 *           type: string
 *           example: "Pagamento de pedido"
 *           description: A descrição do pagamento
 *         vencimento:
 *           type: string
 *           format: date
 *           example: "2025-05-30"
 *           description: A data de vencimento do pagamento
 *         payment_token:
 *           type: string
 *           example: "abcdefg123456"
 *           description: O token de pagamento
 *         numeroParcelas:
 *           type: integer
 *           example: 1
 *           description: O número de parcelas
 *         metodo:
 *           type: string
 *           enum: ["pix", "boleto", "cartao"]
 *           example: "pix"
 *           description: O método de pagamento
 */

/**
 * @swagger
 * /pagamentos:
 *   get:
 *     summary: Lista todos os pagamentos
 *     description: Retorna uma lista de todos os pagamentos feitos no sistema.
 *     tags:
 *       - Pagamentos
 *     responses:
 *       200:
 *         description: Lista de pagamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pagamentoId:
 *                     type: integer
 *                   dataPagamento:
 *                     type: string
 *                     format: date-time
 *                   valorPago:
 *                     type: number
 *                   metodoPagamento:
 *                     type: string
 *                   statusPagamento:
 *                     type: string
 *                   usuarioId:
 *                     type: integer
 *                     nullable: true
 *                   pedidoId:
 *                     type: integer
 *                     nullable: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]), (req: Request, res: Response, next: NextFunction) => pagamentosController.listarTodos(req, res, next));

/**
 * @swagger
 * /pagamentos/{id}:
 *   get:
 *     summary: Retorna um pagamento específico
 *     description: Retorna os detalhes de um pagamento com base no ID fornecido.
 *     tags:
 *       - Pagamentos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: O ID do pagamento que você deseja buscar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Pagamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pagamentoId:
 *                   type: integer
 *                 dataPagamento:
 *                   type: string
 *                   format: date-time
 *                 valorPago:
 *                   type: number
 *                 metodoPagamento:
 *                   type: string
 *                 statusPagamento:
 *                   type: string
 *                 usuarioId:
 *                   type: integer
 *                   nullable: true
 *                 pedidoId:
 *                   type: integer
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/:id", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]),mdl_verificaId, (req:Request, res:Response, next: NextFunction) => pagamentosController.buscarPorId(req, res, next));

/**
 * @swagger
 * /pagamentos:
 *   post:
 *     summary: Cria um novo pagamento
 *     tags:
 *       - Pagamentos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePagamentoDto'
 *     responses:
 *       201:
 *         description: Pagamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pagamentoId:
 *                   type: integer
 *                 dataPagamento:
 *                   type: string
 *                   format: date-time
 *                 valorPago:
 *                   type: number
 *                 metodoPagamento:
 *                   type: string
 *                 statusPagamento:
 *                   type: string
 *                 usuarioId:
 *                   type: integer
 *                   nullable: true
 *                 pedidoId:
 *                   type: integer
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]), validateSchema(CreatePagamentoDto), (req:Request, res:Response, next:NextFunction) => pagamentosController.cadastrar(req, res, next));

/**
 * @swagger
 * /pagamentos/{id}:
 *   put:
 *     summary: Atualiza um pagamento existente
 *     description: Atualiza os detalhes de um pagamento com base no ID fornecido.
 *     tags:
 *       - Pagamentos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pagamento a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePagamentoDto'
 *     responses:
 *       200:
 *         description: Pagamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pagamentoId:
 *                   type: integer
 *                 dataPagamento:
 *                   type: string
 *                   format: date-time
 *                 valorPago:
 *                   type: number
 *                 metodoPagamento:
 *                   type: string
 *                 statusPagamento:
 *                   type: string
 *                 usuarioId:
 *                   type: integer
 *                   nullable: true
 *                 pedidoId:
 *                   type: integer
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/:id", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]),validateSchema(UpdatePagamentoDto), (req:Request, res:Response, next:NextFunction) => pagamentosController.atualizarpagamento(req, res, next));

/**
 * @swagger
 * /pagamentos/{id}:
 *   delete:
 *     summary: Remove um pagamento
 *     description: Exclui um pagamento com base no ID fornecido.
 *     tags:
 *       - Pagamentos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pagamento a ser removido
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Pagamento removido com sucesso
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/:id", authenticate, authorize([TipoUsuario.ADMIN]),mdl_verificaId, (req:Request, res:Response, next:NextFunction) => pagamentosController.deletarpagamento(req, res, next));

/**
 * @swagger
 * /pagamentos/realizar:
 *   post:
 *     summary: Realiza um pagamento (Pix, boleto ou cartão)
 *     tags:
 *       - Pagamentos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pedidoId
 *               - metodo
 *               - valor
 *             properties:
 *               pedidoId:
 *                 type: integer
 *                 example: 123
 *               metodo:
 *                 type: string
 *                 enum: [pix, boleto, cartao]
 *                 example: pix
 *               valor:
 *                 type: number
 *                 example: 150.75
 *               descricao:
 *                 type: string
 *                 example: "Pagamento do pedido 123"
 *     responses:
 *       200:
 *         description: Pagamento realizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao processar pagamento
 */
router.post("/realizar", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]),validateSchema(RealizarPagamentoDto), (req: Request, res: Response, next: NextFunction) => pagamentosController.realizarPagamento(req, res, next));
  
router.use(middlewareAdvice);

export default router;