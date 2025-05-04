export class NotAcceptableError  extends Error{
    constructor(private _message: string,private _statusCode?: number,private _descricaoPadrao?: string) {
        super(_message);
        this._statusCode = _statusCode ?? 406;
        this._descricaoPadrao = _descricaoPadrao ?? "O recurso solicitado não pode ser fornecido de acordo com o tipo de mídia aceito pelo cliente (geralmente relacionado ao cabeçalho Accept).";
        this._message = _message;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    get statusCode() {
        return this._statusCode;
    }
    get descricaoPadrao() {
        return this._descricaoPadrao;
    }
    get message() {
        return this._message;
    }
}
