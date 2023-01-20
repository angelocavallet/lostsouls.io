export enum ExceptionType {
    AUTHENTICATION = 'authentication',
    DEBUG = 'debug-message',
    CHAT = 'chat-message',
    POSITION = 'position',
    ACTION = 'action'
}

interface IException {
    type: ExceptionType;
    msg: string;
}

export class Exception implements IException {
    type: ExceptionType;
    msg: string;

    constructor(type: ExceptionType, msg: string) {
        this.type = type;
        this.msg = msg;
    }

    toJSON(): string {
        return JSON.stringify({type: this.type, msg: this.msg})
    }
}
