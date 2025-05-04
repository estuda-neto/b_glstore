import express, { NextFunction, Request, Response } from "express";
import UsuarioController from "../controllers/usuarios.controller";
import { container } from "../configs/container";
import { middlewareAdvice } from "../shared/middlewares/middlewareAdvice";
import { mdl_verificaId } from "../shared/middlewares/middleware.utils";
import { authenticate } from "../shared/middlewares/middlewareAuth";
import { authorize } from "../shared/middlewares/middlewareAuthorize";
import { TipoUsuario } from "../shared/enums/tipousuario";
import {CreateUsuarioDto,LoginUsuarioDto,UpdateUsuarioDto} from "../shared/dtos/usuario.dto";
import { validateSchema } from "../shared/middlewares/middleware.generic";
import { EmailDto, ResetPasswordDto } from "../shared/dtos/email.dto";

const router = express.Router();
const usuarioController = container.get<UsuarioController>(UsuarioController);

/**
 * @swagger
 * tags:
 *    - name: Usuarios
 *      description: Endpoints para gerenciar usuários
 */

// <- schemas ->

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUsuarioDto:
 *       type: object
 *       required:
 *         - nome
 *         - cpf
 *         - email
 *         - password
 *         - telefone
 *         - endereco
 *         - tipoUsuario
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "João Silva"
 *         cpf:
 *           type: string
 *           pattern: "^[0-9]{11}$"
 *           example: "29362930064"
 *         email:
 *           type: string
 *           format: email
 *           example: "joao@gmail.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           maxLength: 50
 *           example: "senha123"
 *         telefone:
 *           type: string
 *           pattern: "^[0-9]{10,15}$"
 *           example: "84999935813"
 *         endereco:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           example: "Rua das Flores, 123"
 *         tipoUsuario:
 *           type: string
 *           enum: ["admin", "cliente", "fornecedor"]
 *           example: "cliente"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginUsuarioDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - client_type
 *       properties:
 *         email:
 *           type: string
 *           example: "usuario@gmail.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "senha123"
 *         client_type:
 *           type: string
 *           enum: [web, mobile]
 *           example: "web"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ResetPasswordDto:
 *       type: object
 *       required:
 *         - token
 *         - email
 *         - password
 *         - repeatPassword
 *       properties:
 *         token:
 *           type: string
 *           description: "Token para reset de senha"
 *           example: "GTSxt1/cKNo8patVFfImEu7tbJ4uORvyBfDGR3oCiZBonqJIHOJhLJ/rDsirmequr6fyTTvWhhZtO+wWcqsopyZPg56BuaseFonxdtY2sd34rRWY5Jgw="
 *         email:
 *           type: string
 *           format: email
 *           description: "Endereço de e-mail do usuário"
 *           example: "joao@email.com"
 *         password:
 *           type: string
 *           description: "Nova senha do usuário"
 *           minLength: 6
 *           maxLength: 50
 *           example: "senha123"
 *         repeatPassword:
 *           type: string
 *           description: "Confirmação da nova senha. Deve ser igual à senha."
 *           minLength: 6
 *           maxLength: 50
 *           example: "senha123"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUsuarioDto:
 *       type: object
 *       required:
 *         - nome
 *         - cpf
 *         - email
 *         - password
 *         - telefone
 *         - endereco
 *         - tipoUsuario
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "João Silva"
 *         cpf:
 *           type: string
 *           pattern: "^[0-9]{11}$"
 *           example: "12345678901"
 *         email:
 *           type: string
 *           format: email
 *           example: "joao@email.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           maxLength: 50
 *           example: "senha123"
 *         telefone:
 *           type: string
 *           pattern: "^[0-9]{10,11}$"
 *           example: "11987654321"
 *         endereco:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           example: "Rua das Flores, 123"
 *         tipoUsuario:
 *           type: string
 *           enum: ["admin", "cliente", "fornecedor"]
 *           example: "cliente"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EmailDto:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "joao@email.com"
 */

// <- schemas errors ->
/**
 * @swagger
 * components:
 *   responses:
 *     BadRequestError:
 *       description: Requisição inválida - dados enviados estão incorretos ou incompletos.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Campo 'x' é obrigatório."
 *     UnauthorizedError:
 *       description: Não autorizado - Token ausente.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Token ausente."
 *     ForbiddenError:
 *       description: Acesso Proibido - usuário não tem permissão para acessar este recurso.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Acesso negado: apenas administradores podem acessar este recurso"
 *     NotFoundError:
 *       description: Não Encontrado - O recurso que você procura não foi encontrado.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Recurso não encontrado"
 *     ConflictError:
 *       description: Conflito de recurso - O recurso que você está cadastrando já existe.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Recurso já cadastrado"
 *     InternalServerError:
 *       description: Erro interno no servidor.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Erro interno inesperado"
 */

// <- rotas ->

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários presentes na aplicação
 *     description: |
 *       Retorna uma lista de todos os usuários cadastrados no sistema.
 *       Precisa de autenticação -> bearer Token e autorização como ADMIN, contida no token.
 *     tags: [Usuarios]
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
 *                   updateAt:
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
router.get( "/", authenticate, authorize([TipoUsuario.ADMIN]), (req: Request, res: Response, next: NextFunction) => usuarioController.listaUsuarios(req, res, next));

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUsuarioDto'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuarioId:
 *                   type: number
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: 'João Silva'
 *                 cpf:
 *                   type: string
 *                   example: '11600008311'
 *                 email:
 *                   type: string
 *                   example: 'joao.b4@gmail.com'
 *                 password:
 *                   type: string
 *                   example: 'password hash code encrypted'
 *                 telefone:
 *                   type: string
 *                   example: '84999832710'
 *                 endereco:
 *                   type: string
 *                   example: 'Rua das Flores, 123'
 *                 tipoUsuario:
 *                   type: string
 *                   example: 'cliente'
 *                 updateAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-21T18:10:21.000Z"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-21T18:10:21.000Z"
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
router.post("/", validateSchema(CreateUsuarioDto),(req: Request, res: Response, next: NextFunction) => usuarioController.cadastrarUsuario(req, res, next));

/**
 * @swagger
 * /usuarios/auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUsuarioDto'
 *     responses:
 *       200:
 *         description: Usuário logado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUz..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUz..."
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
router.post("/auth/login", validateSchema(LoginUsuarioDto), (req: Request, res: Response, next: NextFunction) => usuarioController.login(req, res, next));

/**
 * @swagger
 * /usuarios/email/{email}:
 *   get:
 *     summary: Retorna um Usuarios pelo email
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuarios encontrado
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
router.get("/email/:email", authenticate, authorize([TipoUsuario.CLIENTE]), (req: Request, res: Response, next: NextFunction) => usuarioController.buscarPorEmail(req, res, next));

/**
 * @swagger
 * /usuarios/paginado:
 *   get:
 *     summary: Retorna a lista de usuários paginada (/paginado?limit=10&offset=0)
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número de usuários por página
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Quantidade de registros a pular
 *     responses:
 *       200:
 *         description: Lista de usuários com contagem total
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       usuarioId:
 *                         type: integer
 *                         example: 1
 *                       nome:
 *                         type: string
 *                         example: "Clodoaldo"
 *                       cpf:
 *                         type: string
 *                         example: "11600808441"
 *                       email:
 *                         type: string
 *                         example: "clodoaldo.brtp4@gmail.com"
 *                       password:
 *                         type: string
 *                         example: "$2b$12$O1KFtsD10osgIstnJ2h9DuNNIyX6rRvQR3kE29tLfvKX10UMAhf3q"
 *                       telefone:
 *                         type: string
 *                         example: "84999935813"
 *                       endereco:
 *                         type: string
 *                         example: "Rua Manoel Silvano 294"
 *                       tipoUsuario:
 *                         type: string
 *                         example: "admin"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-25T16:22:35.000Z"
 *                       updateAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-25T16:22:35.000Z"
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
router.get("/paginado", authenticate,authorize([TipoUsuario.ADMIN]), (req: Request, res: Response, next: NextFunction) => usuarioController.listarPaginado(req, res, next));

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Retorna um usuário específico
 *     description: Retorna os detalhes de um usuário com base no ID fornecido.
 *     tags: [Usuarios]
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
router.get("/:id", authenticate, authorize([TipoUsuario.ADMIN]),mdl_verificaId,(req: Request, res: Response, next: NextFunction) => usuarioController.buscarPorId(req, res, next));

/**
 * @swagger
 * /usuarios/reset-password:
 *   put:
 *     summary: redefine a senha de um usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordDto'
 *     responses:
 *       200:
 *         description: Password redefinida
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
router.put( "/reset-password", validateSchema(ResetPasswordDto), (req: Request, res: Response, next: NextFunction) => usuarioController.redefinirPassword(req, res, next));

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser atualizado
 *         schema:
 *           type: integer
 *           example: 123
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
router.put( "/:id", authenticate, authorize([TipoUsuario.CLIENTE]), validateSchema(UpdateUsuarioDto), (req: Request, res: Response, next: NextFunction) => usuarioController.atualizarUsuario(req, res, next));

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Deleta um Usuarios pelo ID
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
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
router.delete("/:id",authenticate, authorize([TipoUsuario.ADMIN]),mdl_verificaId,(req: Request, res: Response, next: NextFunction) => usuarioController.deletarUsuario(req, res, next));

/**
 * @swagger
 * /usuarios/send-email-reset:
 *   post:
 *     summary: send codigo no email passado, para redefinição de senha
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailDto'
 *     responses:
 *       200:
 *         description: Código enviado para o seu email.
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
router.post("/send-email-reset", validateSchema(EmailDto),(req: Request, res: Response, next: NextFunction) => usuarioController.sendEmailResetPassword(req, res, next));

router.use(middlewareAdvice);

export default router;
