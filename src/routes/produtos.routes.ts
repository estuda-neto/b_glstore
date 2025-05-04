import express, { Request, Response, NextFunction } from "express";
import ProdutoController from "../controllers/produtos.controller";
import { container } from "../configs/container";
import { middlewareAdvice } from "../shared/middlewares/middlewareAdvice";
import { mdl_verificaId } from "../shared/middlewares/middleware.utils";
import {CreateProdutoDto,UpdateProdutoDto,UpdateProdutoImagemDto} from "../shared/dtos/produto.dto";
import { validateSchema } from "../shared/middlewares/middleware.generic";
import upload from "../shared/middlewares/middlewareMulter";
import { ProdutoVariacaoController } from "../controllers";
import {CreateProdutoVariacaoDto,UpdatePartialsProdutoVariacaoDto,UpdateProdutoVariacaoDto} from "../shared/dtos/produtovariacao.dto";
import { authenticate } from "../shared/middlewares/middlewareAuth";
import { authorize } from "../shared/middlewares/middlewareAuthorize";
import { TipoUsuario } from "../shared/enums/tipousuario";

const router = express.Router();
const produtoController = container.get<ProdutoController>(ProdutoController);
const produtoVariacaoController = container.get<ProdutoVariacaoController>(ProdutoVariacaoController);

/**
 * @swagger
 * tags:
 *    - name: Produtos
 *      description: Endpoints para gerenciar Produtos
 */

/* <- schemas -> */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProdutoDto:
 *       type: object
 *       required:
 *         - nome
 *         - descricao
 *         - quantEstoque
 *         - usuarioId
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "Calça jeans"
 *         descricao:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "Uma calça jeans azul confortável"
 *         quantEstoque:
 *           type: number
 *           minimum: 0
 *           example: 100
 *         usuarioId:
 *           type: number
 *           minimum: 1
 *           example: 1
 *         colecaoId:
 *           type: number
 *           minimum: 1
 *           example: 2
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProdutoDto:
 *       type: object
 *       required:
 *         - nome
 *         - descricao
 *         - usuarioId
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "Calça jeans"
 *         descricao:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "Uma calça jeans azul confortável"
 *         quantEstoque:
 *           type: number
 *           minimum: 0
 *           example: 100
 *         quantStarsAvaliacao:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 5
 *           example: 3.5
 *         usuarioId:
 *           type: number
 *           minimum: 1
 *           example: 1
 *         colecaoId:
 *           type: number
 *           minimum: 1
 *           example: 2
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePartialsProdutoDto:
 *       type: object
 *       required:
 *         - usuarioId
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "Calça jeans"
 *         descricao:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "Uma calça jeans azul confortável"
 *         quantEstoque:
 *           type: number
 *           minimum: 0
 *           example: 100
 *         quantStarsAvaliacao:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 5
 *           example: 3.5
 *         usuarioId:
 *           type: number
 *           minimum: 1
 *           example: 1
 *         colecaoId:
 *           type: number
 *           minimum: 1
 *           example: 2
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProdutoImagemDto:
 *       type: object
 *       required:
 *         - posicao
 *       properties:
 *         posicao:
 *           type: number
 *           minimum: 0
 *           example: 0
 */

/* <- rotas -> */

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     description: Retorna uma lista de todos os produtos cadastrados no sistema.
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de Produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   produtoId:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   descricao:
 *                     type: string
 *                   imagens:
 *                     type: array
 *                     items:
 *                       type: string
 *                       nullable: true
 *                   quantEstoque:
 *                     type: integer
 *                   quantStarsAvaliacao:
 *                     type: number
 *                   usuarioId:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
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
router.get("/", authenticate, authorize([TipoUsuario.CLIENTE,TipoUsuario.ADMIN]), (req: Request, res: Response, next: NextFunction) => produtoController.listarTodos(req, res, next));

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Retorna um Recurso específico
 *     description: Retorna os detalhes de um produto com base no ID fornecido.
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: O ID do Recurso que você deseja buscar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Resgata um produto especifico
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   produtoId:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   descricao:
 *                     type: string
 *                   preco:
 *                     type: number
 *                   tamanho:
 *                     type: string
 *                   cor:
 *                     type: string
 *                   imagens:
 *                     type: string
 *                   quantEstoque:
 *                     type: number
 *                   quantStarsAvaliacao:
 *                     type: number
 *                   usuarioId:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *                   carrinhoId:
 *                     type: number
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
router.get("/:id", authenticate, authorize([TipoUsuario.CLIENTE,TipoUsuario.ADMIN]), mdl_verificaId, (req: Request, res: Response, next: NextFunction) => produtoController.buscarPorId(req, res, next));

/**
 * @swagger
 * /produtos/{id}/withallvariacoes:
 *   get:
 *     summary: Retorna um Recurso específico
 *     description: Retorna os detalhes de um produto com base no ID fornecido, incluindo todas as suas variações.
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: O ID do recurso que você deseja buscar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Resgata um produto específico com suas variações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produtoId:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 preco:
 *                   type: string
 *                   example: "99.90"
 *                 tamanho:
 *                   type: string
 *                   example: "42.00"
 *                 cor:
 *                   type: string
 *                 imagens:
 *                   type: string
 *                   nullable: true
 *                 quantEstoque:
 *                   type: integer
 *                 quantStarsAvaliacao:
 *                   type: number
 *                 usuarioId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 carrinhoId:
 *                   type: integer
 *                   nullable: true
 *                 variacoes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       variacaoId:
 *                         type: integer
 *                       preco:
 *                         type: string
 *                         example: "44.90"
 *                       tamanho:
 *                         type: string
 *                         example: "42.00"
 *                       cor:
 *                         type: string
 *                       quantEstoque:
 *                         type: integer
 *                       produtoId:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
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
router.get( "/:id/withallvariacoes", mdl_verificaId, authenticate, authorize([TipoUsuario.CLIENTE,TipoUsuario.ADMIN]), (req: Request, res: Response, next: NextFunction) => produtoController.buscarPorIdWithVariacoes(req, res, next));

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProdutoDto'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produtoId:
 *                   type: number
 *                 nome:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 preco:
 *                   type: number
 *                 tamanho:
 *                   type: number
 *                 cor:
 *                   type: string
 *                 quantEstoque:
 *                   type: number
 *                 usuarioId:
 *                   type: number
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post( "/", authenticate, authorize([TipoUsuario.ADMIN]), validateSchema(CreateProdutoDto), (req: Request, res: Response, next: NextFunction) => produtoController.cadastrar(req, res, next));

/**
 * @swagger
 * /produtos:
 *   put:
 *     summary: Atualiza um produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProdutoDto'
 *     responses:
 *       200:
 *         description: Produto Atualizado
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   produtoId:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   descricao:
 *                     type: string
 *                   preco:
 *                     type: number
 *                   tamanho:
 *                     type: string
 *                   cor:
 *                     type: string
 *                   imagens:
 *                     type: string
 *                   quantEstoque:
 *                     type: number
 *                   quantStarsAvaliacao:
 *                     type: number
 *                   usuarioId:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *                   carrinhoId:
 *                     type: number
 *       400:
 *         description: Erro de validação
 */
router.put( "/:id", authenticate, authorize([TipoUsuario.ADMIN]), validateSchema(UpdateProdutoDto), (req: Request, res: Response, next: NextFunction) => produtoController.atualizarproduto(req, res, next));

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Deleta um Produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 */
router.delete("/:id", mdl_verificaId, authenticate, authorize([TipoUsuario.ADMIN]), (req: Request, res: Response, next: NextFunction) => produtoController.deletarproduto(req, res, next));

/**
 * @swagger
 * /produtos/{id}/imagem:
 *   put:
 *     summary: Atualiza a imagem de um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: O ID do produto que você deseja atualizar a imagem.
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
 *                 description: Arquivo da imagem do produto.
 *               posicao:
 *                 type: integer
 *                 example: 1
 *                 description: A posição da imagem no carrossel.
 *             required:
 *               - imagem
 *               - posicao
 *     responses:
 *       200:
 *         description: Imagem atualizada com sucesso!
 */
router.put("/:id/imagem", authenticate, authorize([TipoUsuario.ADMIN]), upload.single("imagem"), validateSchema(UpdateProdutoImagemDto),(req: Request, res: Response, next: NextFunction) => produtoController.adicionarOuAtualizarImagem(req, res, next));

/**
 *  @swagger
 * /produtos/{id}/variacoes:
 *   get:
 *     summary: Retorna todas as variações de um produto especificado.
 *     description: Retorna todas as variações existentes de um produto.
 *     tags: [Produtos]
 *     parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: O ID do produto que você deseja buscar.
 *           schema:
 *             type: integer
 *             example: 1
 *     responses:
 *       200:
 *         description: Lista todas as variações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   produtoId:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   descricao:
 *                     type: string
 *                   preco:
 *                     type: number
 *                   tamanho:
 *                     type: string
 *                   cor:
 *                     type: string
 *                   imagens:
 *                     type: string
 *                   quantEstoque:
 *                     type: number
 *                   usuarioId:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *                   carrinhoId:
 *                     type: number
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
router.get("/:id/variacoes", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]), mdl_verificaId,(req: Request, res: Response, next: NextFunction) => produtoVariacaoController.listarTodas(req, res, next));

/**
 *  @swagger
 * /produtos/categorias/{id}:
 *   get:
 *     summary: Retorna todas os produtos pertencente a uma categoria especifica.
 *     description: Retorna todas as variações existentes de um produto.
 *     tags: [Produtos]
 *     parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: O ID da categoria que você deseja buscar.
 *           schema:
 *             type: integer
 *             example: 1
 *     responses:
 *       200:
 *         description: Lista de Produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   produtoId:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   descricao:
 *                     type: string
 *                   imagens:
 *                     type: array
 *                     items:
 *                       type: string
 *                       nullable: true
 *                   quantEstoque:
 *                     type: integer
 *                   quantStarsAvaliacao:
 *                     type: number
 *                   usuarioId:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
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
router.get("/categorias/:id", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]), mdl_verificaId,(req: Request, res: Response, next: NextFunction) => produtoController.getProdutosByCategoriaId(req, res, next));

/**
 * @swagger
 * /produtos/variacoes/{id}:
 *   get:
 *     summary: Retorna uma variação especifica de um produto.
 *     description: Retorna os detalhes de um Recurso com base no ID fornecido.
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: O ID do produto que você deseja buscar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Recurso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 cpf:
 *                   type: string
 *                 email:
 *                   type: string
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
router.get("/variacoes/:id", authenticate, authorize([TipoUsuario.ADMIN,TipoUsuario.CLIENTE]), mdl_verificaId,(req: Request, res: Response, next: NextFunction) => produtoVariacaoController.buscarPorId(req, res, next));

/**
 * @swagger
 * /produtos/variacoes:
 *   post:
 *     summary: Cria uma variação de um produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProdutoVariacaoDto'
 *     responses:
 *       201:
 *         description: variação do produto criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 variacaoId:
 *                   type: integer
 *                 preco:
 *                   type: string
 *                 tamanho:
 *                   type: integer
 *                 cor:
 *                   type: string
 *                 quantEstoque:
 *                   type: number
 *                 produtoId:
 *                   type: integer
 *                 updatedAt:
 *                   type: string
 *                 createdAt:
 *                   type: string
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
router.post( "/variacoes", authenticate, authorize([TipoUsuario.ADMIN]) , validateSchema(CreateProdutoVariacaoDto), (req: Request, res: Response, next: NextFunction) => produtoVariacaoController.cadastrar(req, res, next));

/**
 * @swagger
 * /produtos/variacoes:
 *   put:
 *     summary: Atualiza a variação de um produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProdutoVaricaoDto'
 *     responses:
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
router.put("/variacoes/:id", authenticate, authorize([TipoUsuario.ADMIN]), validateSchema(UpdateProdutoVariacaoDto),(req: Request, res: Response, next: NextFunction) =>produtoVariacaoController.atualizarvaricao(req, res, next));

/**
 * @swagger
 * /produtos/variacoes/{id}:
 *   patch:
 *     summary: Atualiza parcialmente uma variação de produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePartialsProdutoVaricaoDto'
 *     responses:
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
router.patch("/variacoes/:id", authenticate, authorize([TipoUsuario.ADMIN]), validateSchema(UpdatePartialsProdutoVariacaoDto),(req: Request, res: Response, next: NextFunction) =>produtoVariacaoController.atualizarParcialmente(req, res, next));

/**
 * @swagger
 * /produtos/variacoes/{id}:
 *   delete:
 *     summary: Deleta uma variação pelo ID
 *     tags: [Produtos]
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
router.delete("/variacoes/:id", authenticate, authorize([TipoUsuario.ADMIN]), mdl_verificaId,(req: Request, res: Response, next: NextFunction) =>produtoVariacaoController.deletar(req, res, next));

router.use(middlewareAdvice);

export default router;
