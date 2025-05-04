interface PixChargePayload {
    chavePix: string;
    valor: number;
    nome: string;
    cpf: string;
    descricao: string;
}

interface AddressInfo {
    rua: string;
    numero: string;
    bairro: string;
    cep: string;
    cidade: string;
    estado: string;
}
interface ChargeItem {
    name: string;
    value: number; // em centavos
    amount: number;
}

interface CustomerInfo {
    name: string;
    cpf: string;
    phone_number: string;
    email: string;
    birth?: string; // opcional, algumas chamadas pedem
}

interface BoletoChargePayload {
    items: ChargeItem[];
    customer: CustomerInfo;
    expireAt: string; // formato: "YYYY-MM-DD"
}

interface BoletoPaymentResponse {
    charge_id: number;
    status: string;
    total: number;
    link: string;
    payment: {
        banking_billet: {
            expire_at: string;
            barcode: string;
            link: string;
            pdf: string;
        };
    };
}

export {
    PixChargePayload,
    CustomerInfo,
    ChargeItem,
    AddressInfo,
    BoletoChargePayload,
    BoletoPaymentResponse,
};
