import * as Yup from "yup";

const CreateColecaoDto = Yup.object().shape({
  nome: Yup.string().min(3).max(50).required("O nome é obrigatório"),
  descricao: Yup.string().min(3).max(1000).required("A descrição é obrigatória"),
  slug: Yup.string().required("O slug é obrigatório"),
  dataLancamento: Yup.date().required("A data de lançamento é obrigatória"),
  dataFim: Yup.date().nullable(),
  ativo: Yup.boolean().required("O status de ativo é obrigatório"),
  produtoIds: Yup.array().of(Yup.number().typeError("Cada produto deve ser um número")).min(1, "Selecione ao menos um produto").required("Os produtos são obrigatórios"),
  genero: Yup.string().required("O gênero é obrigatório"),
  tag: Yup.string().required("A tag é obrigatória"),
});

const UpdateColecaoDto = Yup.object().shape({
    nome: Yup.string().min(3).max(50).required("O nome é obrigatório"),
    descricao: Yup.string().min(3).max(1000).required("A descrição é obrigatória"),
    slug: Yup.string().required("O slug é obrigatório"),
    dataLancamento: Yup.date().required("A data de lançamento é obrigatória"),
    dataFim: Yup.date().nullable(),
    ativo: Yup.boolean().required("O status de ativo é obrigatório"),
    produtoIds: Yup.array().of(Yup.number().typeError("Cada produto deve ser um número")).min(1, "Selecione ao menos um produto").required("Os produtos são obrigatórios"),
    genero: Yup.string().required("O gênero é obrigatório"),
    tag: Yup.string().required("A tag é obrigatória"),
  })
  .noUnknown();

const UpdatePartialsColecaoDto = Yup.object().shape({
    nome: Yup.string().min(3).max(50),
    descricao: Yup.string().min(3).max(1000),
    slug: Yup.string(),
    dataLancamento: Yup.date(),
    dataFim: Yup.date().nullable(),
    ativo: Yup.boolean(),
    produtoIds: Yup.array().of(Yup.number().typeError("Cada produto deve ser um número")).min(1, "Selecione ao menos um produto"),
    genero: Yup.string(),
    tag: Yup.string(),
  })
  .noUnknown();

type CreateColecaoDtoType = Yup.InferType<typeof CreateColecaoDto>;
type UpdateColecaoDtoType = Yup.InferType<typeof UpdateColecaoDto>;
type UpdatePartialsColecaoDtoType = Yup.InferType<typeof UpdatePartialsColecaoDto>;
export {CreateColecaoDtoType,CreateColecaoDto,UpdateColecaoDtoType,UpdateColecaoDto,UpdatePartialsColecaoDtoType,UpdatePartialsColecaoDto};
