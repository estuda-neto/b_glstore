import express,{Request, Response, NextFunction} from "express";
import { container } from "../configs/container";
import { middlewareAdvice } from "../shared/middlewares/middlewareAdvice";
import { mdl_verificaId } from "../shared/middlewares/middleware.utils";
import { PedidoController } from "../controllers";
import { validateSchema } from "../shared/middlewares/middleware.generic";
import { CreatePedidoDto, CreatePedidoFromCarinhoDto, UpdatePedidoDto } from "../shared/dtos/pedido.dto";
import { authenticate } from "../shared/middlewares/middlewareAuth";
import { authorize } from "../shared/middlewares/middlewareAuthorize";
import { TipoUsuario } from "../shared/enums/tipousuario";

const router = express.Router();
const pedidoController = container.get<PedidoController>(PedidoController);

/**
 * @swagger
 * tags:
 *    - name: Pedidos
 *      description: Endpoints para gerenciar Pedidos
 */

// <- schemas ->

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePedidoDto:
 *       type: object
 *       required:
 *         - statusPedido
 *         - dataPedido
 *         - dataEntrega
 *         - valorTotal
 *         - usuarioId
 *         - carrinhoId
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         statusPedido:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "confirmado"
 *         dataPedido:
 *           type: string
 *           format: date-time
 *           example: "2024-04-29T12:00:00Z"
 *         dataEntrega:
 *           type: string
 *           format: date-time
 *           example: "2024-04-30T12:00:00Z"
 *         valorTotal:
 *           type: number
 *           minimum: 0.01
 *           example: 199.90
 *         usuarioId:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *         carrinhoId:
 *           type: integer
 *           minimum: 1
 *           example: 12
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-04-29T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-04-29T15:00:00Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePedidoDto:
 *       type: object
 *       required:
 *         - statusPedido
 *         - dataPedido
 *         - dataEntrega
 *         - valorTotal
 *         - usuarioId
 *         - carrinhoId
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         statusPedido:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "enviado"
 *         dataPedido:
 *           type: string
 *           format: date-time
 *           example: "2024-04-28T10:00:00Z"
 *         dataEntrega:
 *           type: string
 *           format: date-time
 *           example: "2024-04-30T12:00:00Z"
 *         valorTotal:
 *           type: number
 *           minimum: 0.01
 *           example: 299.99
 *         usuarioId:
 *           type: integer
 *           minimum: 1
 *           example: 3
 *         carrinhoId:
 *           type: integer
 *           minimum: 1
 *           example: 7
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-04-28T09:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-04-29T18:00:00Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePartialsPedidoDto:
 *       type: object
 *       properties:
 *         statusPedido:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "cancelado"
 *         dataPedido:
 *           type: string
 *           format: date-time
 *           example: "2024-04-28T10:00:00Z"
 *         dataEntrega:
 *           type: string
 *           format: date-time
 *           example: "2024-04-30T12:00:00Z"
 *         valorTotal:
 *           type: number
 *           minimum: 0.01
 *           example: 150.50
 *         usuarioId:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         carrinhoId:
 *           type: integer
 *           minimum: 1
 *           example: 4
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-04-27T09:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-04-28T16:00:00Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePedidoFromCarinhoDto:
 *       type: object
 *       required:
 *         - carrinhoId
 *         - delivery
 *         - discount
 *       properties:
 *         carrinhoId:
 *           type: integer
 *           minimum: 1
 *           example: 8
 *         delivery:
 *           type: number
 *           minimum: 0
 *           example: 10.00
 *         discount:
 *           type: number
 *           minimum: 0
 *           example: 5.00
 */

/** <- rotas -> */

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Lista todos os pedidos presentes na aplicação
 *     description: Retorna um array contendo todos os pedidos cadastrados.
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pedidoId:
 *                     type: integer
 *                     example: 2
 *                   statusPedido:
 *                     type: string
 *                     example: 'confirmado'
 *                   dataPedido:
 *                     type: string
 *                     format: date-time
 *                     example: '2024-04-29T12:00:00.000Z'
 *                   dataEntrega:
 *                     type: string
 *                     format: date-time
 *                     example: '2024-04-30T12:00:00.000Z'
 *                   valorTotal:
 *                     type: string
 *                     example: '199.90'
 *                   usuarioId:
 *                     type: integer
 *                     example: 1
 *                   carrinhoId:
 *                     type: integer
 *                     example: 1
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: '2024-04-29T12:00:00.000Z'
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: '2025-04-29T14:03:02.000Z'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]) ,(req: Request, res: Response, next: NextFunction) => pedidoController.listarTodos(req, res, next));

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Cria um novo Pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePedidoDto'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 101
 *                 usuarioId:
 *                   type: number
 *                   example: 1
 *                 status:
 *                   type: string
 *                   example: 'pendente'
 *                 valorTotal:
 *                   type: number
 *                   format: float
 *                   example: 89.90
 *                 observacoes:
 *                   type: string
 *                   example: 'Sem cebola'
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-04-29T14:32:00.000Z'
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-04-29T14:32:00.000Z'
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
router.post("/", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]) ,validateSchema(CreatePedidoDto), (req:Request, res:Response, next:NextFunction) => pedidoController.cadastrar(req, res, next));

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Retorna um pedido específico
 *     description: Retorna os detalhes de um pedido com base no ID fornecido.
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: O ID do pedido que você deseja buscar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pedidoId:
 *                   type: integer
 *                   example: 2
 *                 statusPedido:
 *                   type: string
 *                   example: "confirmado"
 *                 dataPedido:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-04-29T12:00:00.000Z"
 *                 dataEntrega:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-04-30T12:00:00.000Z"
 *                 valorTotal:
 *                   type: string
 *                   example: "199.90"
 *                 usuarioId:
 *                   type: integer
 *                   example: 1
 *                 carrinhoId:
 *                   type: integer
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-04-29T12:00:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-29T14:03:02.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/:id", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]), mdl_verificaId, (req:Request, res:Response, next: NextFunction) => pedidoController.buscarPorId(req, res, next));

/**
 * @swagger
 * /pedidos/create-pedido:
 *   post:
 *     summary: cria um pedido com base no carrinho
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePedidoFromCarinhoDto'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
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
router.post("/create-pedido", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]), validateSchema(CreatePedidoFromCarinhoDto), (req:Request, res:Response, next:NextFunction) => pedidoController.criarPedidoApartirDeCarrinho(req, res, next));

/**
 * @swagger
 * /pedidos/{id}:
 *   post:
 *     summary: Atualiza um Pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUsuarioDto'
 *     responses:
 *       201:
 *         description: Usuário atualizado com sucesso
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
router.put("/:id", authenticate, authorize([TipoUsuario.ADMIN]),validateSchema(UpdatePedidoDto), (req:Request, res:Response, next:NextFunction) => pedidoController.atualizarpedido(req, res, next));

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Deleta um Pedido pelo ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido removido com sucesso.
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/:id", authenticate, authorize([TipoUsuario.ADMIN]), mdl_verificaId, (req:Request, res:Response, next:NextFunction) => pedidoController.deletarpedido(req, res, next));

router.use(middlewareAdvice);

export default router;