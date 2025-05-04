import express,{Request, Response, NextFunction} from "express";
import { container } from "../configs/container";
import { middlewareAdvice } from "../shared/middlewares/middlewareAdvice";
import { mdl_verificaId } from "../shared/middlewares/middleware.utils";
import { validateSchema } from "../shared/middlewares/middleware.generic";
import { ColecaoController } from "../controllers";
import { CreateColecaoDto, UpdateColecaoDto } from "../shared/dtos/colecao.dto";
import upload from "../shared/middlewares/middlewareMulter";
import { authenticate } from "../shared/middlewares/middlewareAuth";
import { authorize } from "../shared/middlewares/middlewareAuthorize";
import { TipoUsuario } from "../shared/enums/tipousuario";

const router = express.Router();
const colecaoController = container.get<ColecaoController>(ColecaoController);

/**
 * @swagger
 * tags:
 *    - name: Coleções
 *      description: Endpoints para gerenciar Coleções
 */

// <- schemas ->

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateColecaoDto:
 *       type: object
 *       required:
 *         - nome
 *         - nomeObjetos
 *         - descricao
 *         - slug
 *         - dataLancamento
 *         - ativo
 *         - categoria
 *         - genero
 *         - tag
 *         - produtoIds
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "Coleção Primavera"
 *         nomeObjetos:
 *           type: string
 *           example: "Roupas"
 *         descricao:
 *           type: string
 *           minLength: 3
 *           maxLength: 1000
 *           example: "Coleção de roupas leves e florais para a primavera."
 *         slug:
 *           type: string
 *           example: "colecao-primavera"
 *         dataLancamento:
 *           type: string
 *           format: date
 *           example: "2025-09-01"
 *         dataFim:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: "2025-12-01"
 *         ativo:
 *           type: boolean
 *           example: true
 *         categoria:
 *           type: string
 *           example: "moda"
 *         genero:
 *           type: string
 *           example: "feminino"
 *         tag:
 *           type: string
 *           example: "lançamento"
 *         produtoIds:
 *           type: array
 *           items:
 *             type: integer
 *           minItems: 1
 *           example: [1, 2, 3]
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateColecaoDto:
 *       type: object
 *       required:
 *         - nome
 *         - nomeObjetos
 *         - descricao
 *         - slug
 *         - dataLancamento
 *         - imagemCapaUrl
 *         - ativo
 *         - categoria
 *         - genero
 *         - tag
 *         - produtoIds
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "Coleção Verão"
 *         nomeObjetos:
 *           type: string
 *           example: "Roupas"
 *         descricao:
 *           type: string
 *           minLength: 3
 *           maxLength: 1000
 *           example: "Coleção vibrante com estampas tropicais para o verão."
 *         slug:
 *           type: string
 *           example: "colecao-verao"
 *         dataLancamento:
 *           type: string
 *           format: date
 *           example: "2025-12-01"
 *         dataFim:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: "2026-03-01"
 *         imagemCapaUrl:
 *           type: string
 *           format: uri
 *           example: "https://meusite.com/imagens/verao.png"
 *         ativo:
 *           type: boolean
 *           example: false
 *         categoria:
 *           type: string
 *           example: "praia"
 *         genero:
 *           type: string
 *           example: "unissex"
 *         tag:
 *           type: string
 *           example: "promoção"
 *         produtoIds:
 *           type: array
 *           items:
 *             type: integer
 *           minItems: 1
 *           example: [4, 5, 6]
 */


/**
 * @swagger
 * /colecoes:
 *   get:
 *     summary: Lista todos os Coleções presentes na aplicação
 *     description: Retorna um array contendo todos os Coleções cadastrados.
 *     tags: [Coleções]
 *     responses:
 *       200:
 *         description: Lista de Coleções
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   colecaoId:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: "Coleção Primavera"
 *                   nomeObjetos:
 *                     type: string
 *                     example: "Roupas"
 *                   descricao:
 *                     type: string
 *                     example: "Coleção de roupas leves e florais para a primavera."
 *                   slug:
 *                     type: string
 *                     example: "colecao-primavera"
 *                   dataLancamento:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-01T00:00:00.000Z"
 *                   dataFim:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-01T00:00:00.000Z"
 *                   imagemCapaUrl:
 *                     type: string
 *                     example: "https://meusite.com/imagens/primavera.png"
 *                   ativo:
 *                     type: boolean
 *                     example: true
 *                   genero:
 *                     type: string
 *                     example: "feminino"
 *                   tag:
 *                     type: string
 *                     example: "lançamento"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-01T13:10:25.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-01T13:10:25.000Z"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", authenticate, authorize([TipoUsuario.ADMIN, TipoUsuario.CLIENTE]), (req: Request, res: Response, next: NextFunction) => colecaoController.listarTodos(req, res, next));

/**
 * @swagger
 * /colecoes:
 *   post:
 *     summary: Cria uma nova coleção
 *     tags: [Coleções]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateColecaoDto'
 *     responses:
 *       201:
 *         description: Coleção criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 colecaoId:
 *                   type: number
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: "Coleção Primavera"
 *                 descricao:
 *                   type: string
 *                   example: "Coleção de roupas leves e florais para a primavera."
 *                 slug:
 *                   type: string
 *                   example: "colecao-primavera"
 *                 dataLancamento:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-01T00:00:00.000Z"
 *                 dataFim:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-01T00:00:00.000Z"
 *                 ativo:
 *                   type: boolean
 *                   example: true
 *                 genero:
 *                   type: string
 *                   example: "feminino"
 *                 tag:
 *                   type: string
 *                   example: "lançamento"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T17:40:53.687Z"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T17:40:53.687Z"
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", authenticate, authorize([TipoUsuario.ADMIN]), validateSchema(CreateColecaoDto), (req:Request, res:Response, next:NextFunction) => colecaoController.cadastrar(req, res, next));

/**
 * @swagger
 * /colecoes/{id}/imagem:
 *   patch:
 *     summary: Atualiza a imagem de capa de uma coleção
 *     tags: [Coleções]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da coleção a ser atualizada
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imagem:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo da nova imagem de capa
 *             required:
 *               - imagem
 *     responses:
 *       200:
 *         description: Imagem de capa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   colecaoId:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: "Coleção Primavera"
 *                   nomeObjetos:
 *                     type: string
 *                     example: "Roupas"
 *                   descricao:
 *                     type: string
 *                     example: "Coleção de roupas leves e florais para a primavera."
 *                   slug:
 *                     type: string
 *                     example: "colecao-primavera"
 *                   dataLancamento:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-01T00:00:00.000Z"
 *                   dataFim:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-01T00:00:00.000Z"
 *                   imagemCapaUrl:
 *                     type: string
 *                     example: "https://meusite.com/imagens/primavera.png"
 *                   ativo:
 *                     type: boolean
 *                     example: true
 *                   genero:
 *                     type: string
 *                     example: "feminino"
 *                   tag:
 *                     type: string
 *                     example: "lançamento"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-01T13:10:25.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-01T13:10:25.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       404:
 *         description: Coleção não encontrada
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.patch("/:id/imagem", authenticate, authorize([TipoUsuario.ADMIN]), upload.single("imagem"), (req:Request, res:Response, next:NextFunction) => colecaoController.adicionarOuAtualizarImagem(req, res, next));

/**
 * @swagger
 * /colecoes/{id}:
 *   get:
 *     summary: Retorna uma coleção específica
 *     description: Retorna os detalhes de uma coleção com base no ID fornecido.
 *     tags:
 *       - Coleções
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: O ID da coleção que você deseja buscar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Coleção encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 colecaoId:
 *                   type: number
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: "Coleção Primavera"
 *                 descricao:
 *                   type: string
 *                   example: "Coleção de roupas leves e florais para a primavera."
 *                 slug:
 *                   type: string
 *                   example: "colecao-primavera"
 *                 dataLancamento:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-01T00:00:00.000Z"
 *                 dataFim:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-01T00:00:00.000Z"
 *                 imagemCapaUrl:
 *                   type: string
 *                   example: "https://meusite.com/imagens/primavera.png"
 *                 ativo:
 *                   type: boolean
 *                   example: true
 *                 genero:
 *                   type: string
 *                   example: "feminino"
 *                 tag:
 *                   type: string
 *                   example: "lançamento"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T17:40:53.687Z"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T17:40:53.687Z"
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
router.get("/:id", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]), mdl_verificaId, (req:Request, res:Response, next: NextFunction) => colecaoController.buscarPorId(req, res, next));

/**
 * @swagger
 * /colecoes/{id}:
 *   put:
 *     summary: Atualiza uma coleção existente
 *     tags: [Coleções]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateColecaoDto'
 *     responses:
 *       200:
 *         description: Coleção atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 colecaoId:
 *                   type: number
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: "Coleção Verão"
 *                 nomeObjetos:
 *                   type: string
 *                   example: "Roupas"
 *                 descricao:
 *                   type: string
 *                   example: "Coleção vibrante com estampas tropicais para o verão."
 *                 slug:
 *                   type: string
 *                   example: "colecao-verao"
 *                 dataLancamento:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-01T00:00:00.000Z"
 *                 dataFim:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-03-01T00:00:00.000Z"
 *                 imagemCapaUrl:
 *                   type: string
 *                   example: "https://meusite.com/imagens/verao.png"
 *                 ativo:
 *                   type: boolean
 *                   example: false
 *                 genero:
 *                   type: string
 *                   example: "unissex"
 *                 tag:
 *                   type: string
 *                   example: "promoção"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T17:40:53.687Z"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T17:40:53.687Z"
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Coleção não encontrada
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/:id", authenticate, authorize([TipoUsuario.ADMIN]), validateSchema(UpdateColecaoDto), (req:Request, res:Response, next:NextFunction) => colecaoController.atualizarcolecao(req, res, next));

/**
 * @swagger
 * /colecoes/{id}:
 *   delete:
 *     summary: Deleta um Pedido pelo ID
 *     tags: [Coleções]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuarios removido com sucesso
 */
router.delete("/:id", authenticate, authorize([TipoUsuario.ADMIN]), mdl_verificaId, (req:Request, res:Response, next:NextFunction) => colecaoController.deletarcolecao(req, res, next));

router.use(middlewareAdvice);

export default router;