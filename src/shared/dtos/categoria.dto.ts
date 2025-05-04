import * as Yup from "yup";

// DTO para criação de categoria
const CreateCategoriaDto = Yup.object().shape({
    nome: Yup.string().min(3, "O nome da categoria deve ter no mínimo 3 caracteres").max(50, "O nome da categoria deve ter no máximo 50 caracteres").required("O nome da categoria é obrigatório"),
    descricao: Yup.string().min(3, "A descrição da categoria deve ter no mínimo 3 caracteres").max(200, "A descrição da categoria deve ter no máximo 200 caracteres").required("A descrição da categoria é obrigatória"),
});

// DTO para atualização de categoria
const UpdateCategoriaDto = Yup.object().shape({
    nome: Yup.string().min(3, "O nome da categoria deve ter no mínimo 3 caracteres").max(50, "O nome da categoria deve ter no máximo 50 caracteres"),
    descricao: Yup.string().min(3, "A descrição da categoria deve ter no mínimo 3 caracteres").max(200, "A descrição da categoria deve ter no máximo 200 caracteres"),
});

// DTO para atualização parcial de categoria
const UpdatePartialsCategoriaDto = Yup.object().shape({
    nome: Yup.string().min(3).max(50).optional(),
    descricao: Yup.string().min(3).max(200).optional(),
}).noUnknown();

// Tipos inferidos dos DTOs
type CreateCategoriaDtoType = Yup.InferType<typeof CreateCategoriaDto>;
type UpdateCategoriaDtoType = Yup.InferType<typeof UpdateCategoriaDto>;
type UpdatePartialsCategoriaDtoType = Yup.InferType<typeof UpdatePartialsCategoriaDto>;

// Exportação dos DTOs e tipos
export {CreateCategoriaDto,UpdateCategoriaDto,UpdatePartialsCategoriaDto,CreateCategoriaDtoType,UpdateCategoriaDtoType,UpdatePartialsCategoriaDtoType};
