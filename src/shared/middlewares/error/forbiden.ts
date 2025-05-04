export class ForbiddenError  extends Error{
    constructor(private _message: string,private _statusCode?: number,private _descricaoPadrao?: string) {
        super(_message);
        this._statusCode = _statusCode ?? 403;
        this._descricaoPadrao = _descricaoPadrao ?? "O servidor até entende a requisição, mas o cliente não tem permissão para acessar o recurso.";
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