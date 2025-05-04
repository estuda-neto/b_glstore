export class RequestTimeoutError  extends Error{
    constructor(private _message: string,private _statusCode?: number,private _descricaoPadrao?: string) {
        super(_message);
        this._statusCode = _statusCode ?? 408;
        this._descricaoPadrao = _descricaoPadrao ?? "O servidor demorou muito para processar a requisição e o cliente deve tentar novamente mais tarde.";
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
