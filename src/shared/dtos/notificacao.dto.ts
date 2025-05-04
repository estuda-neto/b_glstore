import * as Yup from "yup";

const CreateNotificacaoDto = Yup.object().shape({
    mensagem: Yup.string().min(3, "A mensagem deve ter no mínimo 3 caracteres").max(255, "A mensagem deve ter no máximo 255 caracteres").required("A mensagem é obrigatória"),
    status: Yup.string().oneOf(["pendente", "enviada", "lida"], "Status inválido").required("O status é obrigatório"),
    dataEnvio: Yup.date().required("A data de envio é obrigatória"),
    usuarioIds: Yup.array().of(Yup.number().positive().integer()).min(1, "Pelo menos um usuário deve ser informado").required("Usuários são obrigatórios"),
});

const UpdateNotificacaoDto = Yup.object().shape({
    mensagem: Yup.string().min(3, "A mensagem deve ter no mínimo 3 caracteres").max(255, "A mensagem deve ter no máximo 255 caracteres"),
    status: Yup.string().oneOf(["pendente", "enviada", "lida"], "Status inválido"),
    dataEnvio: Yup.date(),
});

const UpdatePartialsNotificacaoDto = Yup.object().shape({
    mensagem: Yup.string().min(3).max(255).optional(),
    status: Yup.string().oneOf(["pendente", "enviada", "lida"]).optional(),
    dataEnvio: Yup.date().optional(),
}).noUnknown();

type CreateNotificacaoDtoType = Yup.InferType<typeof CreateNotificacaoDto>;
type UpdateNotificacaoDtoType = Yup.InferType<typeof UpdateNotificacaoDto>;
type UpdatePartialsNotificacaoDtoType = Yup.InferType<typeof UpdatePartialsNotificacaoDto>;

export {CreateNotificacaoDto,UpdateNotificacaoDto,UpdatePartialsNotificacaoDto,CreateNotificacaoDtoType,UpdateNotificacaoDtoType,UpdatePartialsNotificacaoDtoType};
