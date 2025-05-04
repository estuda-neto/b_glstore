import * as Yup from "yup";

const CreateUsuarioDto = Yup.object().shape({
  nome: Yup.string()
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(50, "O nome deve ter no máximo 50 caracteres")
    .required("O nome é obrigatório"),
  cpf: Yup.string()
    .matches(/^\d{11}$/, "O CPF deve ter exatamente 11 dígitos numéricos")
    .required("O CPF é obrigatório"),
  email: Yup.string()
    .email("E-mail inválido")
    .required("O e-mail é obrigatório"),
  password: Yup.string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .max(50, "A senha deve ter no máximo 50 caracteres")
    .required("A senha é obrigatória"),
  telefone: Yup.string()
    .matches(/^\d{10,11}$/, "O telefone deve ter 10 ou 11 dígitos")
    .required("O telefone é obrigatório"),
  endereco: Yup.string()
    .min(3, "O endereço deve ter no mínimo 3 caracteres")
    .max(100, "O endereço deve ter no máximo 100 caracteres")
    .required("O endereço é obrigatório"),
  tipoUsuario: Yup.string()
    .oneOf(["admin", "cliente", "fornecedor"], "Tipo de usuário inválido")
    .required("O tipo de usuário é obrigatório"),
});

const UpdateUsuarioDto = Yup.object()
  .shape({
    nome: Yup.string()
      .min(3, "O nome deve ter no mínimo 3 caracteres")
      .max(50, "O nome deve ter no máximo 50 caracteres"),
    email: Yup.string().email("E-mail inválido"),
    cpf: Yup.string().matches(
      /^\d{11}$/,
      "O CPF deve ter exatamente 11 dígitos numéricos"
    ),
    telefone: Yup.string().matches(
      /^\d{10,15}$/,
      "O telefone deve ter 10 ou 15 dígitos"
    ),
    endereco: Yup.string()
      .min(3, "O endereço deve ter no mínimo 3 caracteres")
      .max(100, "O endereço deve ter no máximo 100 caracteres"),
    tipoUsuario: Yup.string().oneOf(
      ["admin", "cliente", "fornecedor"],
      "Tipo de usuário inválido"
    ),
  })
  .noUnknown();

const UpdatePartialsUsuarioDto = Yup.object()
  .shape({
    nome: Yup.string().min(3).max(50).optional(),
    cpf: Yup.string()
      .matches(/^\d{11}$/, "O CPF deve ter exatamente 11 dígitos numéricos")
      .optional(),
    email: Yup.string().email("E-mail inválido").optional(),
    password: Yup.string().min(6).max(50).optional(),
    telefone: Yup.string()
      .matches(/^\d{10,11}$/, "O telefone deve ter 10 ou 11 dígitos")
      .optional(),
    endereco: Yup.string().min(3).max(100).optional(),
    tipoUsuario: Yup.string()
      .oneOf(["admin", "cliente", "fornecedor"], "Tipo de usuário inválido")
      .optional(),
  })
  .noUnknown();

const RedefUsuarioDto = Yup.object()
  .shape({
    password: Yup.string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .max(50, "A senha deve ter no máximo 50 caracteres")
      .required("A senha é obrigatória"),
    repassword: Yup.string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .max(50, "A senha deve ter no máximo 50 caracteres")
      .required("A senha é obrigatória"),
    codigo: Yup.string()
      .min(11, "O código deve ter 11 caracteres")
      .max(50, "O nome deve ter no máximo 50 caracteres"),
  })
  .noUnknown();

const LoginUsuarioDto = Yup.object()
  .shape({
    email: Yup.string()
      .email("E-mail inválido")
      .required("O e-mail é obrigatório"),
    password: Yup.string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .max(50, "A senha deve ter no máximo 50 caracteres")
      .required("A senha é obrigatória"),
    client_type: Yup.mixed<"web" | "mobile">()
      .oneOf(["web", "mobile"], "Tipo de cliente inválido")
      .required("O tipo de cliente é obrigatório"),
  })
  .noUnknown();

type RedefUsuarioDtoType = Yup.InferType<typeof RedefUsuarioDto>;
type UpdateUsuarioDtoType = Yup.InferType<typeof UpdateUsuarioDto>;
type ICreateUsuarioDto = Yup.InferType<typeof CreateUsuarioDto>;
type UpdatePartialsUsuarioDtoType = Yup.InferType<
  typeof UpdatePartialsUsuarioDto
>;
type LoginUsuarioDtoType = Yup.InferType<typeof LoginUsuarioDto>;
export {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  UpdatePartialsUsuarioDto,
  RedefUsuarioDto,
  LoginUsuarioDto,
  RedefUsuarioDtoType,
  UpdateUsuarioDtoType,
  ICreateUsuarioDto,
  UpdatePartialsUsuarioDtoType,
  LoginUsuarioDtoType,
};
