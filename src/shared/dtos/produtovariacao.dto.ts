import * as Yup from "yup";


// Tamanhos válidos
const tamanhosValidos = ['PP', 'P', 'M', 'G', 'GG', 'XG'];

// DTO para criação de uma nova variação de produto
const CreateProdutoVariacaoDto = Yup.object().shape({
    preco: Yup.number().typeError("O preço deve ser um número").positive("O preço deve ser um número positivo").required("O preço é obrigatório"),
    tamanho: Yup.string().trim().oneOf(tamanhosValidos, `O tamanho deve ser um dos seguintes: ${tamanhosValidos.join(', ')}`).required("O tamanho é obrigatório"),
    cor: Yup.string().min(3, "A cor deve ter no mínimo 3 caracteres").max(50, "A cor deve ter no máximo 50 caracteres").required("A cor é obrigatória"),
    sexo: Yup.string().trim().oneOf(['M', 'F'], 'O sexo deve ser "M" (masculino) ou "F" (feminino)').required('O sexo é obrigatório'),
    quantEstoque: Yup.number().typeError("A quantidade em estoque deve ser um número").integer("A quantidade em estoque deve ser um número inteiro").min(0, "A quantidade em estoque não pode ser negativa").required("A quantidade em estoque é obrigatória"),
    produtoId: Yup.number().typeError("O ID do produto deve ser um número").integer("O ID do produto deve ser um número inteiro").positive("O ID do produto deve ser um número positivo").required("O ID do produto é obrigatório"),
});

// DTO para atualização completa
const UpdateProdutoVariacaoDto = Yup.object().shape({
    preco: Yup.number().typeError("O preço deve ser um número").positive("O preço deve ser um número positivo").required("O preço é obrigatório"),
    tamanho: Yup.string().trim().oneOf(tamanhosValidos, `O tamanho deve ser um dos seguintes: ${tamanhosValidos.join(', ')}`).required("O tamanho é obrigatório"),
    cor: Yup.string().min(3, "A cor deve ter no mínimo 3 caracteres").max(50, "A cor deve ter no máximo 50 caracteres").required("A cor é obrigatória"),
    sexo: Yup.string().trim().oneOf(['M', 'F'], 'O sexo deve ser "M" (masculino) ou "F" (feminino)').required('O sexo é obrigatório'),
    quantEstoque: Yup.number().typeError("A quantidade em estoque deve ser um número").integer("A quantidade em estoque deve ser um número inteiro").min(0, "A quantidade em estoque não pode ser negativa").required("A quantidade em estoque é obrigatória"),
    produtoId: Yup.number().typeError("O ID do produto deve ser um número").integer("O ID do produto deve ser um número inteiro").positive("O ID do produto deve ser um número positivo").required("O ID do produto é obrigatório"),
}).noUnknown();

// DTO para atualização parcial (patch)
const UpdatePartialsProdutoVariacaoDto = Yup.object().shape({
    preco: Yup.number().typeError("O preço deve ser um número").positive("O preço deve ser um número positivo").optional(),
    tamanho: Yup.string().trim().oneOf(tamanhosValidos, `O tamanho deve ser um dos seguintes: ${tamanhosValidos.join(', ')}`).optional(),
    cor: Yup.string().min(3, "A cor deve ter no mínimo 3 caracteres").max(50, "A cor deve ter no máximo 50 caracteres").optional(),
    sexo: Yup.string().trim().oneOf(['M', 'F'], 'O sexo deve ser "M" (masculino) ou "F" (feminino)').optional(),
    quantEstoque: Yup.number().typeError("A quantidade em estoque deve ser um número").integer("A quantidade em estoque deve ser um número inteiro").min(0, "A quantidade em estoque não pode ser negativa").optional(),
    produtoId: Yup.number().typeError("O ID do produto deve ser um número").integer("O ID do produto deve ser um número inteiro").positive("O ID do produto deve ser um número positivo").optional(),
}).noUnknown();

type CreateProdutoVariacaoDtoType = Yup.InferType<typeof CreateProdutoVariacaoDto>;
type UpdateProdutoVariacaoDtoType = Yup.InferType<typeof UpdateProdutoVariacaoDto>;
type UpdatePartialsProdutoVariacaoDtoType = Yup.InferType<typeof UpdatePartialsProdutoVariacaoDto>;

export {CreateProdutoVariacaoDto,UpdateProdutoVariacaoDto,UpdatePartialsProdutoVariacaoDto,CreateProdutoVariacaoDtoType,UpdateProdutoVariacaoDtoType,UpdatePartialsProdutoVariacaoDtoType};
