export class ConflictError  extends Error{
    constructor(private _message: string,private _statusCode?: number,private _descricaoPadrao?: string) {
        super(_message);
        this._statusCode = _statusCode ?? 409;
        this._descricaoPadrao = _descricaoPadrao ?? "O pedido não pode ser processado devido a um conflito com o estado atual do recurso.";
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
