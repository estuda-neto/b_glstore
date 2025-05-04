import express,{Request, Response, NextFunction} from "express";
import { container } from "../configs/container";
import { middlewareAdvice } from "../shared/middlewares/middlewareAdvice";
import { mdl_verificaId } from "../shared/middlewares/middleware.utils";
import { CategoriaController } from "../controllers";
import { validateSchema } from "../shared/middlewares/middleware.generic";
import { CreateCategoriaDto, UpdateCategoriaDto } from "../shared/dtos/categoria.dto";
import { TipoUsuario } from "../shared/enums/tipousuario";
import { authorize } from "../shared/middlewares/middlewareAuthorize";
import { authenticate } from "../shared/middlewares/middlewareAuth";

const router = express.Router();
const categoriasController = container.get<CategoriaController>(CategoriaController);

/**
* @swagger
* tags:
*    - name: Categorias
*      description: Endpoints para gerenciar Categorias
*/

// -> schemas <-

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCategoriaDto:
 *       type: object
 *       required:
 *         - nome
 *         - descricao
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "Laticínios"
 *         descricao:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           example: "Produtos derivados do leite"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCategoriaDto:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "Congelados"
 *         descricao:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           example: "Alimentos congelados para venda"
 */


/**
*   @swagger
*   /categorias:
*   get:
*     summary: Lista todas categorias
*     description: Retorna uma lista de todos os usuários cadastrados no sistema.
*     tags: [Categorias]
*     responses:
*       200:
*         description: Lista de usuários
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   usuarioId:
*                     type: integer
*                     example: 1
*                   nome:
*                     type: string
*                     example: "Clodoaldo"
*                   cpf:
*                     type: string
*                     example: "11600808441"
*                   email:
*                     type: string
*                     example: "clodoaldo.brtp4@gmail.com"
*                   password:
*                     type: string
*                     example: "$2b$12$O1KFtsD10osgIstnJ2h9DuNNIyX6rRvQR3kE29tLfvKX10UMAhf3q"
*                   telefone:
*                     type: string
*                     example: "84999935813"
*                   endereco:
*                     type: string
*                     example: "Rua Manoel Silvano 294"
*                   tipoUsuario:
*                     type: string
*                     example: "admin"
*                   createdAt:
*                     type: string
*                     format: date-time
*                     example: "2025-04-25T16:22:35.000Z"
*                   updatedAt:
*                     type: string
*                     format: date-time
*                     example: "2025-04-25T16:22:35.000Z"
*       400:
*         $ref: '#/components/responses/BadRequestError'
*       401:
*         $ref: '#/components/responses/UnauthorizedError'
*       403:
*         $ref: '#/components/responses/ForbiddenError'
*       500:
*         $ref: '#/components/responses/InternalServerError'
*/
router.get("/",authenticate, authorize([TipoUsuario.CLIENTE,TipoUsuario.ADMIN]) ,(req: Request, res: Response, next: NextFunction) => categoriasController.listarTodos(req, res, next));

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Retorna um usuário específico
 *     description: Retorna os detalhes de um usuário com base no ID fornecido.
 *     tags: [Categorias]
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
 *                 categoriaId:
 *                   type: string
 *                   example: "1"
 *                 nome:
 *                   type: string
 *                   example: "Laticínios"
 *                 descricao:
 *                   type: string
 *                   example: "Produtos derivados do leite"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T19:51:44.418Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T19:51:44.418Z"
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/:id",authenticate, authorize([TipoUsuario.CLIENTE,TipoUsuario.ADMIN]) ,mdl_verificaId, (req:Request, res:Response, next: NextFunction) => categoriasController.buscarPorId(req, res, next));

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags:
 *       - Categorias
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoriaDto'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categoriaId:
 *                   type: string
 *                   example: "1"
 *                 nome:
 *                   type: string
 *                   example: "Laticínios"
 *                 descricao:
 *                   type: string
 *                   example: "Produtos derivados do leite"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T19:51:44.418Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T19:51:44.418Z"
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", authenticate, authorize([TipoUsuario.ADMIN]),validateSchema(CreateCategoriaDto), (req:Request, res:Response, next:NextFunction) => categoriasController.cadastrar(req, res, next));

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Atualiza uma categoria existente
 *     tags:
 *       - Categorias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoriaDto'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categoriaId:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: "Calças"
 *                 descricao:
 *                   type: string
 *                   example: "Produtos derivados do leite"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T19:51:44.418Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T20:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/:id", authenticate, authorize([TipoUsuario.ADMIN]),validateSchema(UpdateCategoriaDto), (req:Request, res:Response, next:NextFunction) => categoriasController.atualizarcategoria(req, res, next));

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Remove uma categoria existente
 *     tags:
 *       - Categorias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria a ser removida
 *     responses:
 *       204:
 *         description: Categoria removida com sucesso (sem conteúdo)
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/:id",authenticate, authorize([TipoUsuario.ADMIN]) ,mdl_verificaId, (req:Request, res:Response, next:NextFunction) => categoriasController.deletarcategoria(req, res, next));

router.use(middlewareAdvice);

export default router;