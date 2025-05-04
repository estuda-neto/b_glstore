import express,{Request, Response, NextFunction} from "express";
import { container } from "../configs/container";
import { middlewareAdvice } from "../shared/middlewares/middlewareAdvice";
import { mdl_verificaId } from "../shared/middlewares/middleware.utils";
import { CarrinhoController } from "../controllers";
import { AddProdutoCarrinhoDto, CreateCarrinhoDto, UpdateCarrinhoDto } from "../shared/dtos/carrinho.dto";
import { validateSchema } from "../shared/middlewares/middleware.generic";
import { TipoUsuario } from "../shared/enums/tipousuario";
import { authorize } from "../shared/middlewares/middlewareAuthorize";
import { authenticate } from "../shared/middlewares/middlewareAuth";

const router = express.Router();
const carrinhosController = container.get<CarrinhoController>(CarrinhoController);

/**
 * @swagger
 * tags:
 *    - name: Carrinhos
 *      description: Endpoints para gerenciar Carrinhos
 */

// schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCarrinhoDto:
 *       type: object
 *       required:
 *         - usuarioId
 *       properties:
 *         usuarioId:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *           description: O ID do usuário responsável pelo carrinho
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCarrinhoDto:
 *       type: object
 *       required:
 *         - usuarioId
 *       properties:
 *         usuarioId:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *           description: O ID do usuário responsável pelo carrinho
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePartialsCarrinhoDto:
 *       type: object
 *       properties:
 *         usuarioId:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *           description: O ID do usuário responsável pelo carrinho
 *       additionalProperties: false
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AddProdutoCarrinhoDto:
 *       type: object
 *       properties:
 *         usuarioId:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *           description: O ID do usuário
 *         variacaoId:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *           description: O ID da variação específica do produto
 *       additionalProperties: false
 */


/**
 * @swagger
 * /carrinhos:
 *   get:
 *     summary: Lista todos os carrinhos presentes na aplicação
 *     description: |
 *       Retorna uma lista de todos os carrinhos cadastrados no sistema.
 *       Precisa de autenticação -> bearer Token e autorização como ADMIN, contida no token.
 *     tags: [Carrinhos]
 *     responses:
 *       200:
 *         description: Lista de carrinhos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   carrinhoId:
 *                     type: integer
 *                     example: 1
 *                   usuarioId:
 *                     type: integer
 *                     example: 1
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-30T17:37:54.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-30T17:37:54.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]), (req: Request, res: Response, next: NextFunction) => carrinhosController.listarTodos(req, res, next));

/**
 * @swagger
 * /carrinhos/{id}:
 *   get:
 *     summary: Busca um carrinho pelo ID
 *     description: |
 *       Retorna um carrinho específico a partir de seu ID.
 *       Precisa de autenticação -> bearer Token e autorização como ADMIN ou dono do carrinho, contida no token.
 *     tags: [Carrinhos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do carrinho a ser buscado
 *     responses:
 *       200:
 *         description: Carrinho encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 carrinhoId:
 *                   type: integer
 *                   example: 1
 *                 usuarioId:
 *                   type: integer
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T17:37:54.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T17:37:54.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Carrinho não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/:id", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]),mdl_verificaId, (req:Request, res:Response, next: NextFunction) => carrinhosController.buscarPorId(req, res, next));

/**
 * @swagger
 * /carrinhos/usuarios/{id}:
 *   get:
 *     summary: Busca carrinho de um usuário pelo ID
 *     description: |
 *       Retorna o carrinho de um usuário específico a partir de seu ID.
 *       Precisa de autenticação -> bearer Token e autorização como ADMIN ou dono do carrinho, contida no token.
 *     tags: [Carrinhos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário para o qual o carrinho será buscado
 *     responses:
 *       200:
 *         description: Carrinho do usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 carrinhoId:
 *                   type: integer
 *                   example: 1
 *                 usuarioId:
 *                   type: integer
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T17:37:54.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T17:37:54.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Carrinho do usuário não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/usuarios/:id", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]),mdl_verificaId, (req:Request, res:Response, next: NextFunction) => carrinhosController.buscarPorUsuarioId(req, res, next));

/**
 * @swagger
 * /carrinhos:
 *   post:
 *     summary: Cria um novo carrinho
 *     description: |
 *       Cria um novo carrinho para um usuário. O carrinho será vinculado ao usuário especificado.
 *       Precisa de autenticação -> bearer Token e autorização como ADMIN ou dono do carrinho, contida no token.
 *     tags: [Carrinhos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCarrinhoDto'
 *     responses:
 *       201:
 *         description: Carrinho criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateCarrinhoDto'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]),validateSchema(CreateCarrinhoDto), (req:Request, res:Response, next:NextFunction) => carrinhosController.cadastrar(req, res, next));

/**
 * @swagger
 * /carrinhos/add-produto-to-car:
 *   post:
 *     summary: Adiciona um produto ao carrinho do usuário
 *     description: Associa uma variação de produto ao carrinho de um usuário.
 *     tags: [Carrinhos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddProdutoCarrinhoDto'
 *     responses:
 *       200:
 *         description: Produto adicionado com sucesso
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/add-produto-to-car", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]),validateSchema(AddProdutoCarrinhoDto), (req:Request, res:Response, next:NextFunction) => carrinhosController.adicionarProdutoNoCarrinho(req, res, next));

/**
 * @swagger
 * /carrinhos/{id}:
 *   put:
 *     summary: Atualiza completamente um carrinho
 *     description: Atualiza todos os campos de um carrinho existente.
 *     tags: [Carrinhos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do carrinho a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCarrinhoDto'
 *     responses:
 *       200:
 *         description: Carrinho atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateCarrinhoDto'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Carrinho não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/:id", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]),validateSchema(UpdateCarrinhoDto), (req:Request, res:Response, next:NextFunction) => carrinhosController.atualizarCarrinho(req, res, next));

/**
 * @swagger
 * /carrinhos/{id}:
 *   delete:
 *     summary: Remove um carrinho pelo ID
 *     description: |
 *       Remove o carrinho com o ID especificado. A exclusão será feita apenas se o carrinho
 *       existir no sistema.
 *     tags: [Carrinhos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do carrinho a ser removido
 *     responses:
 *       200:
 *         description: Carrinho removido com sucesso
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Carrinho não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/:id", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]),mdl_verificaId, (req:Request, res:Response, next:NextFunction) => carrinhosController.deletarCarrinho(req, res, next));

router.use(middlewareAdvice);
 
export default router; 