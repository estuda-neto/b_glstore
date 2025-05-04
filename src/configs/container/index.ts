import "reflect-metadata";
import { Container } from "inversify";
import * as repositories from "../../repositories";
import * as services  from "../../services";
import * as controllers from "../../controllers";
import AuthServices from "../../services/auth.service";
import EmailServices from "../../services/email.service";
import TokenServices from "../../services/tokens.service";
import EfiPaymentService from "../../services/efipayment.service";

const container = new Container();

// Repositórios
container.bind<repositories.UsuarioRepository>(repositories.UsuarioRepository).toSelf();
container.bind<repositories.ProdutoRepository>(repositories.ProdutoRepository).toSelf();
container.bind<repositories.PedidoRepository>(repositories.PedidoRepository).toSelf();
container.bind<repositories.PagamentoRepository>(repositories.PagamentoRepository).toSelf();
container.bind<repositories.NotificacaoRepository>(repositories.NotificacaoRepository).toSelf();
container.bind<repositories.CategoriaRepository>(repositories.CategoriaRepository).toSelf();
container.bind<repositories.CarrinhoRepository>(repositories.CarrinhoRepository).toSelf();
container.bind<repositories.ProdutoVariacaoRepository>(repositories.ProdutoVariacaoRepository).toSelf();
container.bind<repositories.ColecaoRepository>(repositories.ColecaoRepository).toSelf();

// Serviços
container.bind<services.UsuarioServices>(services.UsuarioServices).toSelf();
container.bind<services.ProdutoServices>(services.ProdutoServices).toSelf();
container.bind<services.PedidoServices>(services.PedidoServices).toSelf();
container.bind<services.PagamentoServices>(services.PagamentoServices).toSelf();
container.bind<services.NotificacaoServices>(services.NotificacaoServices).toSelf();
container.bind<services.CategoriaServices>(services.CategoriaServices).toSelf();
container.bind<services.CarrinhoServices>(services.CarrinhoServices).toSelf();
container.bind<services.ProdutoVariacaoServices>(services.ProdutoVariacaoServices).toSelf();
container.bind<services.ColecaoServices>(services.ColecaoServices).toSelf();

container.bind<AuthServices>(AuthServices).toSelf();
container.bind<EmailServices>(EmailServices).toSelf();
container.bind<TokenServices>(TokenServices).toSelf();
container.bind<EfiPaymentService>(EfiPaymentService).toSelf();

// Controladores
container.bind<controllers.UsuarioController>(controllers.UsuarioController).toSelf();
container.bind<controllers.ProdutoController>(controllers.ProdutoController).toSelf();
container.bind<controllers.PedidoController>(controllers.PedidoController).toSelf();
container.bind<controllers.PagamentoController>(controllers.PagamentoController).toSelf();
container.bind<controllers.NotificacaoController>(controllers.NotificacaoController).toSelf();
container.bind<controllers.CategoriaController>(controllers.CategoriaController).toSelf();
container.bind<controllers.CarrinhoController>(controllers.CarrinhoController).toSelf();
container.bind<controllers.ProdutoVariacaoController>(controllers.ProdutoVariacaoController).toSelf();
container.bind<controllers.ColecaoController>(controllers.ColecaoController).toSelf();

export { container };
