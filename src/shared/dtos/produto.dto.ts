import * as Yup from "yup";

const CreateProdutoDto = Yup.object().shape({
    nome: Yup.string().min(3, "O nome deve ter no mínimo 3 caracteres").max(50, "O nome deve ter no máximo 50 caracteres").required("O nome é obrigatório"),
    descricao: Yup.string().min(3, "A descrição deve ter no mínimo 3 caracteres").max(50, "A descrição deve ter no máximo 50 caracteres").required("Uma descrição é obrigatória"),
    quantEstoque: Yup.number().integer("A quantidade em estoque deve ser um número inteiro").min(0, "A quantidade em estoque não pode ser negativa").required("A quantidade em estoque é obrigatória"),
    usuarioId: Yup.number().integer("O ID do usuário deve ser um número inteiro").positive("O ID do usuário deve ser um número positivo").required("O ID do usuário é obrigatório"),
    colecaoId: Yup.number().integer("O ID da coleção deve ser um número inteiro").positive("O ID da coleção deve ser um número positivo").notRequired(),
});

const UpdateProdutoDto = Yup.object().shape({
    nome: Yup.string().min(3, "O nome deve ter no mínimo 3 caracteres").max(50, "O nome deve ter no máximo 50 caracteres").required("O nome é obrigatório"),
    descricao: Yup.string().min(3, "A descrição deve ter no mínimo 3 caracteres").max(50, "A descrição deve ter no máximo 50 caracteres").required("Uma descrição é obrigatória"),
    quantEstoque: Yup.number().integer("A quantidade em estoque deve ser um número inteiro").min(0, "A quantidade em estoque não pode ser negativa"),
    quantStarsAvaliacao: Yup.number().min(0, "A quantidade de estrelas não pode ser negativa").max(5, "A quantidade de estrelas não pode ser maior que 5"),
    usuarioId: Yup.number().integer("O ID do usuário deve ser um número inteiro").positive("O ID do usuário deve ser um número positivo").required("O ID do usuário é obrigatório"),
    colecaoId: Yup.number().integer("O ID da coleção deve ser um número inteiro").positive("O ID da coleção deve ser um número positivo").notRequired(),
}).noUnknown();

const UpdatePartialsProdutoDto = Yup.object().shape({
    nome: Yup.string().min(3, "O nome deve ter no mínimo 3 caracteres").max(50, "O nome deve ter no máximo 50 caracteres").optional(),
    descricao: Yup.string().min(3, "A descrição deve ter no mínimo 3 caracteres").max(50, "A descrição deve ter no máximo 50 caracteres").optional(),
    quantEstoque: Yup.number().integer("A quantidade em estoque deve ser um número inteiro").min(0, "A quantidade em estoque não pode ser negativa").optional(),
    quantStarsAvaliacao: Yup.number().min(0, "A quantidade de estrelas não pode ser negativa").max(5, "A quantidade de estrelas não pode ser maior que 5"),
    usuarioId: Yup.number().integer("O ID do usuário deve ser um número inteiro").positive("O ID do usuário deve ser um número positivo").required("O ID do usuário é obrigatório"),
    colecaoId: Yup.number().integer("O ID da coleção deve ser um número inteiro").positive("O ID da coleção deve ser um número positivo").notRequired(),
}).noUnknown();

const UpdateProdutoImagemDto = Yup.object().shape({
    posicao: Yup.number().typeError("A posição deve ser um número").integer("A posição deve ser um número inteiro").min(0, "A posição deve ser no mínimo 0").required("A posição é obrigatória"),
}).noUnknown();

type CreateProdutoDtoType = Yup.InferType<typeof CreateProdutoDto>;
type UpdateProdutoDtoType = Yup.InferType<typeof UpdateProdutoDto>;
type UpdatePartialsProdutoDtoType = Yup.InferType<typeof UpdatePartialsProdutoDto>;
type UpdateProdutoImagemDtoType = Yup.InferType<typeof UpdateProdutoImagemDto>;
export {CreateProdutoDto,UpdateProdutoDto,UpdatePartialsProdutoDto,UpdateProdutoImagemDto,CreateProdutoDtoType,UpdateProdutoDtoType,UpdatePartialsProdutoDtoType,UpdateProdutoImagemDtoType};
