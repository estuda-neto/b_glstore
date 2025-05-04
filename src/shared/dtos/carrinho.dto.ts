import * as Yup from "yup";

const CreateCarrinhoDto = Yup.object().shape({
    usuarioId: Yup.number().integer("O ID do usuário deve ser um número inteiro").positive("O ID do usuário deve ser um número positivo").required("O ID do usuário é obrigatório"),
});

const UpdateCarrinhoDto = Yup.object().shape({
    usuarioId: Yup.number().integer("O ID do usuário deve ser um número inteiro").positive("O ID do usuário deve ser um número positivo").required("O ID do usuário é obrigatório"),
});

const UpdatePartialsCarrinhoDto = Yup.object().shape({usuarioId: Yup.number().integer("O ID do usuário deve ser um número inteiro").positive("O ID do usuário deve ser um número positivo").optional()}).noUnknown();

const AddProdutoCarrinhoDto = Yup.object().shape({
    usuarioId: Yup.number().integer("O ID do usuário deve ser um número inteiro").positive("O ID do usuário deve ser um número positivo"),
    variacaoId: Yup.number().integer("O ID da variação especifica do produto deve ser um número inteiro").positive("O ID da variação especifica do produto deve ser um número positivo"),
}).noUnknown();

type CreateCarrinhoDtoType = Yup.InferType<typeof CreateCarrinhoDto>;
type UpdateCarrinhoDtoType = Yup.InferType<typeof UpdateCarrinhoDto>;
type UpdatePartialsCarrinhoDtoType = Yup.InferType<typeof UpdatePartialsCarrinhoDto>;

export {CreateCarrinhoDto,UpdateCarrinhoDto,UpdatePartialsCarrinhoDto,AddProdutoCarrinhoDto,CreateCarrinhoDtoType,UpdateCarrinhoDtoType,UpdatePartialsCarrinhoDtoType};
