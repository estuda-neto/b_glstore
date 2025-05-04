import axios from "axios";
import qs from "qs";
import https from "https";
import fs from "fs";
import crypto from "crypto";
import { AddressInfo, BoletoChargePayload, CustomerInfo, PixChargePayload } from "../shared/utils/interfaces.efi";

export default class EfiPaymentService {
    private baseUrl: string;
    private clientId: string;
    private clientSecret: string;
    private certificate: Buffer;

    constructor() {
        this.baseUrl = process.env.EFIPAY_BASE_URL || "https://api.efipay.com.br";
        this.clientId = process.env.EFIPAY_CLIENT_ID || "";
        this.clientSecret = process.env.EFIPAY_CLIENT_SECRET || "";
        const certPath = process.env.EFIPAY_CERTIFICATE_PATH || "";

        if (!certPath) throw new Error("Certificado da Efi não configurado.");
        this.certificate = fs.readFileSync(certPath);
    }

    private getHttpsAgent(): https.Agent {
        return new https.Agent({
            cert: this.certificate,
            key: this.certificate,
        });
    }

    private async getAccessToken(): Promise<string> {
        const data = qs.stringify({ grant_type: "client_credentials" });

        const response = await axios.post(`${this.baseUrl}/oauth/token`, data, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            auth: {
                username: this.clientId,
                password: this.clientSecret,
            },
            httpsAgent: this.getHttpsAgent(),
        });

        return response.data.access_token;
    }

    /**
     * @description Retorna as chaves Pix cadastradas na conta Efi.
     * @returns {Promise<string[]>} Lista de chaves Pix.
     */
    public async getPixKeys(): Promise<string[]> {
        const accessToken = await this.getAccessToken();
    
        const response = await axios.get(`${this.baseUrl}/v2/gn/pix/keys`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            httpsAgent: this.getHttpsAgent(),
        });

        return response.data.chaves.filter((chave: { tipo: string }) => chave.tipo === "random").map((chave: { chave: string }) => chave.chave);
    }

    /**
     * @description A Efi (assim como outras instituições participantes do Pix) segue as regras do Banco Central, então o limite de 5 chaves aleatórias é por conta transacional Pix.
     */
    public async createRandomPixKey(): Promise<string> {
        const existingKeys = await this.getPixKeys();
    
        if (existingKeys.length >= 5) {
            // Se já tiver 5, retorna uma aleatória existente
            const randomIndex = Math.floor(Math.random() * existingKeys.length);
            return existingKeys[randomIndex];
        }
    
        const accessToken = await this.getAccessToken();
    
        const response = await axios.post(
            `${this.baseUrl}/v2/gn/pix/keys`,
            { tipoChave: "random" },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                httpsAgent: this.getHttpsAgent(),
            }
        );
    
        return response.data.chave;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async createImmediateChargePix({chavePix,valor,nome,cpf,descricao}: PixChargePayload): Promise<any> {
        const accessToken = await this.getAccessToken();
        const txid = crypto.randomBytes(10).toString("hex");

        const body = {
            calendario: { expiracao: 3600 },
            devedor: { cpf, nome },
            valor: { original: valor.toFixed(2) },
            chave: chavePix,
            solicitacaoPagador: descricao,
        };

        const response = await axios.put(
            `${this.baseUrl}/v2/cob/${txid}`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                httpsAgent: this.getHttpsAgent(),
            }
        );

        return { txid, ...response.data };
    }

    public async generatePixQrCode(locId: number): Promise<{ qrcode: string; imagemQrcode: string }> {
        const accessToken = await this.getAccessToken();
    
        const response = await axios.get(`${this.baseUrl}/v2/loc/${locId}/qrcode`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            httpsAgent: this.getHttpsAgent(),
        });
    
        return response.data; // contém { qrcode, imagemQrcode }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async createCreditCardCharge( items: { name: string; value: number; amount: number }[], customer: CustomerInfo): Promise<any> {
        const accessToken = await this.getAccessToken();

        const body = {
            items,
            payment: {
                banking_billet: {
                    expire_at: "2025-12-31",
                    customer,
                },
            },
        };

        const response = await axios.post(`${this.baseUrl}/v1/charge`, body, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            httpsAgent: this.getHttpsAgent(),
        });

        return response.data;
    }

    /** 
     * @returns {Promise<any>} Retorna o resultado do pagamento com cartão de crédito.
     * json -> 
     * {
        "code": 200,
        "data": {
            "charge_id": 1234567,
            "status": "paid",
            "total": 1500,
            "payment": {
            "method": "credit_card",
            "credit_card": {
                "transaction": "abcd1234567890",
                "installments": 1,
                "status": "paid"
            }
            }
        }
        }
    */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async payWithCreditCard(chargeId: number,creditCardToken: string, customer: CustomerInfo,billingAddress: AddressInfo, installments: number = 1): Promise<any> {
        const accessToken = await this.getAccessToken();

        const paymentData = {
            payment: {
                credit_card: {
                    installments,
                    payment_token: creditCardToken,
                    billing_address: billingAddress,
                    customer,
                },
            },
        };

        const response = await axios.post(
            `${this.baseUrl}/v1/charge/${chargeId}/payment`,
            paymentData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                httpsAgent: this.getHttpsAgent(),
            }
        );

        return response.data;
    }

    /**
     * ⚠️ Importante:
     * - Nunca envie os dados do cartão diretamente ao backend em produção.
     * - Utilize a SDK JS da Efi para gerar um `payment_token` no frontend com segurança.
     * - Garanta conformidade com a LGPD ao tratar dados sensíveis.
     */


    /**
     * Esse método cria uma cobrança via boleto bancário com link de pagamento, usando a rota /v1/charge/one-step/link da Efi (antiga Gerencianet). 
     * A ideia é simplificar o processo em um passo só, gerando um link onde o cliente pode acessar e pagar via boleto.
     * No caso da Efi, quando você cria esse link, ela gera uma página com:
     * O boleto para download/visualização.
     * Os dados do pagamento.
     * E normalmente sim, um QR Code opcional, mas isso vem no link retornado (o response.data tem essa URL). Se quiser exibir o QR ou o PDF, você pega esse link e mostra pro usuário.
     */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async createBoletoPaymentLink(payload: BoletoChargePayload): Promise<any> {
        const accessToken = await this.getAccessToken();
        const { items, customer, expireAt } = payload;
      
        const requestBody = {
          items,
          payment: {
            methods: ["banking_billet"],
            banking_billet: {
              expire_at: expireAt,
              customer,
            },
          },
          customer, // também vai aqui, para dados gerais da cobrança
        };
      
        const response = await axios.post(
          `${this.baseUrl}/v1/charge/one-step/link`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            httpsAgent: this.getHttpsAgent(),
          }
        );
      
        return response.data; // aqui virá o link, barcode, pdf, etc
      }
}
