import * as Yup from "yup";

const EmailDto = Yup.object().shape({
  email: Yup.string().email("E-mail inválido").required("O e-mail é obrigatório"),
});

const ResetPasswordDto = Yup.object().shape({
    token: Yup.string().required("O token é obrigatório"),
    email: Yup.string().email("E-mail inválido").required("O e-mail é obrigatório"),
    password: Yup.string().min(6, "A senha deve ter no mínimo 6 caracteres").max(50, "A senha deve ter no máximo 50 caracteres").required("A senha é obrigatória"),
    repeatPassword: Yup.string().oneOf([Yup.ref('password'), undefined], "As senhas não coincidem").required("A confirmação de senha é obrigatória"),
});


type EmailDtoType = Yup.InferType<typeof EmailDto>;
type ResetPasswordDtoType = Yup.InferType<typeof ResetPasswordDto>;
export { EmailDto, EmailDtoType,ResetPasswordDto,ResetPasswordDtoType};
