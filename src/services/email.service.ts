import { injectable, inject } from "inversify";
import { UsuarioRepository } from "../repositories";
import nodemailer, { Transporter } from 'nodemailer';
import { BadRequestError } from "../shared/middlewares/error";

@injectable()
class EmailServices {
    private transporter: Transporter;

    constructor(@inject(UsuarioRepository) private usuariosRepository: UsuarioRepository) {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || "smtp.zoho.com",
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    public async sendEmail(to: string, subject: string, text: string, html?: string) {
        const from = process.env.EMAIL_USER;
        try {
            const info = await this.transporter.sendMail({from, to , subject, text, html});
            return info;
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
            throw new BadRequestError("Dados inconsistentes, utilizados no envio de email.");
        }
    }
}

export default EmailServices;
