import express, { Request, Response, NextFunction } from "express";
import { container } from "../configs/container";
import { middlewareAdvice } from "../shared/middlewares/middlewareAdvice";
import { mdl_verificaId } from "../shared/middlewares/middleware.utils";
import { NotificacaoController } from "../controllers";
import { CreateNotificacaoDto, UpdateNotificacaoDto } from "../shared/dtos/notificacao.dto";
import { validateSchema } from "../shared/middlewares/middleware.generic";
import { TipoUsuario } from "../shared/enums/tipousuario";
import { authorize } from "../shared/middlewares/middlewareAuthorize";
import { authenticate } from "../shared/middlewares/middlewareAuth";

const router = express.Router();
const notificacoesController = container.get<NotificacaoController>(NotificacaoController);

/**
 * @swagger
 * tags:
 *   - name: Notificações
 *     description: Endpoints para gerenciar Notificações
 */

/** <- schemas -> */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateNotificacaoDto:
 *       type: object
 *       required:
 *         - mensagem
 *         - status
 *         - dataEnvio
 *         - usuarioIds
 *       properties:
 *         mensagem:
 *           type: string
 *           minLength: 3
 *           maxLength: 255
 *           example: "Sua encomenda foi enviada"
 *         status:
 *           type: string
 *           enum: [pendente, enviada, lida]
 *           example: "pendente"
 *         dataEnvio:
 *           type: string
 *           format: date-time
 *           example: "2025-04-30T14:48:00.000Z"
 *         usuarioIds:
 *           type: array
 *           items:
 *             type: integer
 *             example: 1
 *           description: Lista de IDs dos usuários que receberão a notificação
 *           example: [1, 2, 3]
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateNotificacaoDto:
 *       type: object
 *       properties:
 *         mensagem:
 *           type: string
 *           minLength: 3
 *           maxLength: 255
 *           example: "Mensagem atualizada"
 *         status:
 *           type: string
 *           enum: [pendente, enviada, lida]
 *           example: "lida"
 *         dataEnvio:
 *           type: string
 *           format: date-time
 *           example: "2025-05-01T10:00:00.000Z"
 */


/**
 * @swagger
 * /notificacoes:
 *   get:
 *     summary: Lista todas as notificações presentes na aplicação
 *     description: Retorna uma lista de todas as notificações no sistema.
 *     tags: [Notificações]
 *     responses:
 *       200:
 *         description: Lista de notificações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   notificacaoId:
 *                     type: integer
 *                     example: 1
 *                   mensagem:
 *                     type: string
 *                     example: "Sua encomenda foi enviada"
 *                   status:
 *                     type: string
 *                     example: "pendente"
 *                   dataEnvio:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-30T14:48:00.000Z"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-05T23:13:27.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-05T23:13:27.000Z"
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/", authenticate, authorize([TipoUsuario.CLIENTE,TipoUsuario.ADMIN]),(req: Request, res: Response, next: NextFunction) => notificacoesController.listarTodos(req, res, next));

/**
 * @swagger
 * /notificacoes/{id}:
 *   get:
 *     summary: Retorna uma notificação específica
 *     description: Retorna os detalhes de uma notificação com base no ID fornecido.
 *     tags: [Notificações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: O ID da notificação que você deseja buscar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Notificação encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notificacaoId:
 *                   type: integer
 *                   example: 1
 *                 mensagem:
 *                   type: string
 *                   example: "Sua encomenda foi enviada"
 *                 status:
 *                   type: string
 *                   example: "pendente"
 *                 dataEnvio:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T14:48:00.000Z"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-05T23:13:27.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-05T23:13:27.000Z"
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Notificação não encontrada
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/:id", authenticate, authorize([TipoUsuario.CLIENTE,TipoUsuario.ADMIN]),mdl_verificaId, (req: Request, res: Response, next: NextFunction) => notificacoesController.buscarPorId(req, res, next));

/**
 * @swagger
 * /notificacoes/usuarios/{id}:
 *   get:
 *     summary: Retorna um usuário específico
 *     description: Retorna os detalhes de um usuário com base no ID fornecido.
 *     tags: [Notificações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: O ID do usuário que você deseja buscar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notificacaoId:
 *                   type: integer
 *                   example: 1
 *                 mensagem:
 *                   type: string
 *                   example: "Sua encomenda foi enviada"
 *                 status:
 *                   type: string
 *                   example: "pendente"
 *                 dataEnvio:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T14:48:00.000Z"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-05T23:13:27.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-05T23:13:27.000Z"
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/usuarios/:id", authenticate, authorize([TipoUsuario.CLIENTE,TipoUsuario.ADMIN]),mdl_verificaId, (req: Request, res: Response, next: NextFunction) => notificacoesController.buscarPorUsuarioId(req, res, next));

/**
 * @swagger
 * /notificacoes:
 *   post:
 *     summary: Cria uma notificaçao
 *     tags: [Notificações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNotificacaoDto'
 *     responses:
 *       201:
 *         description: Notificação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notificacaoId:
 *                   type: integer
 *                   example: 1
 *                 mensagem:
 *                   type: string
 *                   example: "Sua encomenda foi enviada"
 *                 status:
 *                   type: string
 *                   example: "pendente"
 *                 dataEnvio:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T14:48:00.000Z"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-05T23:13:27.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-05T23:13:27.000Z"
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
router.post("/", authenticate, authorize([TipoUsuario.ADMIN]),validateSchema(CreateNotificacaoDto), (req: Request, res: Response, next: NextFunction) => notificacoesController.cadastrar(req, res, next));

/**
 * @swagger
 * /notificacoes/{id}:
 *   put:
 *     summary: Atualiza uma notificação
 *     description: Atualiza os dados de uma notificação existente com base no ID fornecido.
 *     tags: [Notificações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da notificação a ser atualizada
 *         schema:
 *           type: integer
 *           example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNotificacaoDto'
 *     responses:
 *       200:
 *         description: Notificação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notificacaoId:
 *                   type: integer
 *                   example: 1
 *                 mensagem:
 *                   type: string
 *                   example: "Sua encomenda foi enviada"
 *                 status:
 *                   type: string
 *                   example: "pendente"
 *                 dataEnvio:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T14:48:00.000Z"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-05T23:13:27.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-05T23:14:24.000Z"
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
router.put("/:id", authenticate, authorize([TipoUsuario.ADMIN]),validateSchema(UpdateNotificacaoDto), (req: Request, res: Response, next: NextFunction) => notificacoesController.atualizarnotificacao(req, res, next));

/**
 * @swagger
 * /notificacoes/{id}:
 *   delete:
 *     summary: Deleta uma notifição pelo ID
 *     tags: [Notificações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuarios removido com sucesso.
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
router.delete("/:id", authenticate, authorize([TipoUsuario.ADMIN]),mdl_verificaId, (req: Request, res: Response, next: NextFunction) => notificacoesController.deletarcategoria(req, res, next));

router.use(middlewareAdvice);

export default router;
