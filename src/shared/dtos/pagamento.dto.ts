import * as Yup from "yup";

const CreatePagamentoDto = Yup.object().shape({
    dataPagamento: Yup.date().required("A data do pagamento é obrigatória"),
    valorPago: Yup.number().positive("O valor pago deve ser um número positivo").required("O valor pago é obrigatório"),
    metodoPagamento: Yup.string().oneOf(["cartao", "boleto", "pix", "transferencia"], "Método de pagamento inválido").required("O método de pagamento é obrigatório"),
    statusPagamento: Yup.string().oneOf(["pendente", "aprovado", "rejeitado"], "Status de pagamento inválido").required("O status do pagamento é obrigatório"),
    usuarioId: Yup.number().integer("O ID do usuário deve ser um número inteiro").positive("O ID do usuário deve ser um número positivo").required("O ID do usuário é obrigatório"),
    pedidoId: Yup.number().integer("O ID do pedido deve ser um número inteiro").positive("O ID do pedido deve ser um número positivo").required("O ID do pedido é obrigatório"),
});

const UpdatePagamentoDto = Yup.object().shape({
    dataPagamento: Yup.date(),
    valorPago: Yup.number().positive("O valor pago deve ser um número positivo"),
    metodoPagamento: Yup.string().oneOf(["cartao", "boleto", "pix", "transferencia"]),
    statusPagamento: Yup.string().oneOf(["pendente", "aprovado", "rejeitado"]),
    usuarioId: Yup.number().integer("O ID do usuário deve ser um número inteiro").positive("O ID do usuário deve ser um número positivo"),
    pedidoId: Yup.number().integer("O ID do pedido deve ser um número inteiro").positive("O ID do pedido deve ser um número positivo"),
});

const UpdatePartialsPagamentoDto = Yup.object().shape({
    dataPagamento: Yup.date().optional(),
    valorPago: Yup.number().positive("O valor pago deve ser um número positivo").optional(),
    metodoPagamento: Yup.string().oneOf(["cartao", "boleto", "pix", "transferencia"]).optional(),
    statusPagamento: Yup.string().oneOf(["pendente", "aprovado", "rejeitado"]).optional(),
    usuarioId: Yup.number().integer("O ID do usuário deve ser um número inteiro").positive("O ID do usuário deve ser um número positivo").optional(),
    pedidoId: Yup.number().integer("O ID do pedido deve ser um número inteiro").positive("O ID do pedido deve ser um número positivo").optional(),
}).noUnknown();

const RealizarPagamentoDto = Yup.object().shape({
    pedidoId: Yup.number().integer('O pedidoId deve ser um número inteiro').positive('O pedidoId deve ser positivo').required('O pedidoId é obrigatório'),
    valor: Yup.number().positive('O valor deve ser positivo').required('O valor é obrigatório'),
    nome: Yup.string().min(3, 'O nome deve ter pelo menos 3 caracteres').max(100, 'O nome pode ter no máximo 100 caracteres').required('O nome é obrigatório'),
    email: Yup.string().email("E-mail inválido").required("O e-mail é obrigatório"),
    cpf: Yup.string().matches(/^\d{11}$/, 'CPF deve conter exatamente 11 dígitos').required('O CPF é obrigatório'),
    telefone: Yup.string().matches(/^\d{10,15}$/,"O telefone deve ter 10 ou 15 dígitos").optional(),
    endereco: Yup.object().shape({
        rua: Yup.string().required("A rua é obrigatória"),
        numero: Yup.string().required("O número é obrigatório"),
        bairro: Yup.string().required("O bairro é obrigatório"),
        cep: Yup.string().matches(/^\d{8}$/, "CEP deve conter 8 dígitos").required("O CEP é obrigatório"),
        cidade: Yup.string().required("A cidade é obrigatória"),
        estado: Yup.string().length(2, "Estado deve ter 2 letras").required("O estado é obrigatório")
      }).required("O endereço é obrigatório"),
    birth: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento deve estar no formato YYYY-MM-DD').optional(),
    descricao: Yup.string().max(255, 'A descrição pode ter no máximo 255 caracteres').optional(),
    vencimento: Yup.date().min(new Date(), 'A data de vencimento deve ser futura').optional(),
    payment_token: Yup.string().max(255, 'A descrição pode ter no máximo 255 caracteres').optional(),
    numeroParcelas: Yup.number().positive('O valor deve ser positivo').optional(),
    metodo: Yup.string().oneOf(['pix', 'boleto', 'cartao'], 'O método deve ser pix, boleto ou cartao').required('O método é obrigatório'),
}).noUnknown();

type CreatePagamentoDtoType = Yup.InferType<typeof CreatePagamentoDto>;
type UpdatePagamentoDtoType = Yup.InferType<typeof UpdatePagamentoDto>;
type UpdatePartialsPagamentoDtoType = Yup.InferType<typeof UpdatePartialsPagamentoDto>;
type RealizarPagamentoDtoType = Yup.InferType<typeof RealizarPagamentoDto>;
type PagamentoPixDtoType = { imagemQrcode: string; qrcodeUrl: string; };

export { CreatePagamentoDto,UpdatePagamentoDto,UpdatePartialsPagamentoDto,RealizarPagamentoDto,
    CreatePagamentoDtoType,UpdatePagamentoDtoType,UpdatePartialsPagamentoDtoType,RealizarPagamentoDtoType,PagamentoPixDtoType
};
