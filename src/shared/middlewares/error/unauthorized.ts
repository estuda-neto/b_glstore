export class UnauthorizedError  extends Error{
    constructor(private _message: string,private _statusCode?: number,private _descricaoPadrao?: string) {
        super(_message);
        this._statusCode = _statusCode ?? 401;
        this._descricaoPadrao = _descricaoPadrao ?? "O cliente precisa autenticar-se para obter a resposta solicitada.";
        this._message = _message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
    
    get statusCode(){
        return this._statusCode;
    }
    get descricaoPadrao(){
        return this._descricaoPadrao;
    }
    get message(){
        return this._message;
    }
}