import * as Yup from "yup";

const CreatePedidoDto = Yup.object().shape({
    statusPedido: Yup.string().min(3, "O status do pedido deve ter no mínimo 3 caracteres").max(50, "O status do pedido deve ter no máximo 50 caracteres").required("O status do pedido é obrigatório"),
    dataPedido: Yup.date().required("A data do pedido é obrigatória").max(new Date(), "A data do pedido não pode ser no futuro"),
    dataEntrega: Yup.date().required("A data de entrega é obrigatória").min(Yup.ref('dataPedido'), "A data de entrega não pode ser antes da data do pedido"),
    valorTotal: Yup.number().positive("O valor total deve ser um número positivo").required("O valor total é obrigatório"),
    usuarioId: Yup.number().integer("O ID do usuário deve ser um número inteiro").positive("O ID do usuário deve ser um número positivo").required("O ID do usuário é obrigatório"),
    carrinhoId: Yup.number().integer("O ID do carrinho deve ser um número inteiro").positive("O ID do carrinho deve ser um número positivo").required("O ID do carrinho é obrigatório"),
});

const UpdatePedidoDto = Yup.object().shape({
    statusPedido: Yup.string().min(3, "O status do pedido deve ter no mínimo 3 caracteres").max(50, "O status do pedido deve ter no máximo 50 caracteres").required("O status do pedido é obrigatório"),
    dataPedido: Yup.date().required("A data do pedido é obrigatória").max(new Date(), "A data do pedido não pode ser no futuro"),
    dataEntrega: Yup.date().required("A data de entrega é obrigatória").min(Yup.ref('dataPedido'), "A data de entrega não pode ser antes da data do pedido"),
    valorTotal: Yup.number().positive("O valor total deve ser um número positivo").required("O valor total é obrigatório"),
    usuarioId: Yup.number().integer("O ID do usuário deve ser um número inteiro").positive("O ID do usuário deve ser um número positivo").required("O ID do usuário é obrigatório"),
    carrinhoId: Yup.number().integer("O ID do carrinho deve ser um número inteiro").positive("O ID do carrinho deve ser um número positivo").required("O ID do carrinho é obrigatório"),
}).noUnknown();

const UpdatePartialsPedidoDto = Yup.object().shape({
    statusPedido: Yup.string().min(3, "O status do pedido deve ter no mínimo 3 caracteres").max(50, "O status do pedido deve ter no máximo 50 caracteres").optional(),
    dataPedido: Yup.date().max(new Date(), "A data do pedido não pode ser no futuro").optional(),
    dataEntrega: Yup.date().min(Yup.ref('dataPedido'), "A data de entrega não pode ser antes da data do pedido").optional(),
    valorTotal: Yup.number().positive("O valor total deve ser um número positivo").optional(),
    usuarioId: Yup.number().integer("O ID do usuário deve ser um número inteiro").positive("O ID do usuário deve ser um número positivo").optional(),
    carrinhoId: Yup.number().integer("O ID do carrinho deve ser um número inteiro").positive("O ID do carrinho deve ser um número positivo").optional(),
}).noUnknown();

const CreatePedidoFromCarinhoDto  = Yup.object().shape({
    carrinhoId: Yup.number().integer("O ID do carrinho deve ser um número inteiro").positive("O ID do carrinho deve ser um número positivo").required("O ID do carrinho é obrigatório"),
    delivery: Yup.number().required('O valor de entrega (delivery) é obrigatório').min(0, 'O valor de entrega não pode ser negativo'),
    discount: Yup.number().required('O desconto (discount) é obrigatório').min(0, 'O desconto não pode ser negativo'),
}).noUnknown();

type CreatePedidoDtoType = Yup.InferType<typeof CreatePedidoDto>;
type UpdatePedidoDtoType = Yup.InferType<typeof UpdatePedidoDto>;
type UpdatePartialsPedidoDtoType = Yup.InferType<typeof UpdatePartialsPedidoDto>;
export {CreatePedidoDto,UpdatePedidoDto,UpdatePartialsPedidoDto,CreatePedidoFromCarinhoDto,CreatePedidoDtoType,UpdatePedidoDtoType,UpdatePartialsPedidoDtoType};
