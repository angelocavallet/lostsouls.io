export enum MessageType {
    AUTHENTICATION = 'authentication',
    DEBUG = 'debug-message',
    CHAT = 'chat-message',
    POSITION = 'position',
    ACTION = 'action'
}

interface IMessage {
    type: MessageType
    token: string | null;
    data: {};
}

export class Message implements IMessage {
    type: MessageType;
    token: string | null;
    data: {};

    constructor(type: MessageType, token: string | null, data: {} | null) {
        this.type = type;
        this.token = token;
        this.data = data;
    }

    static getMessageFromJSON(message: string): Message {
        let msgParsed = JSON.parse(message);

        if (! msgParsed.type) {
            //@todo throw exception here invalid token type
            return null;
        }

        if (! msgParsed.token && msgParsed.type !== MessageType.AUTHENTICATION) {
            //@todo throw exception here invalid token
            return null;
        }

        return new Message(msgParsed.type, msgParsed.token, msgParsed.data);
    }

    toJSON(): string {
        return JSON.stringify({type: this.type, data: this.data})
    }
    toJSONAuth(): string {
        return JSON.stringify({type: this.type, token: this.token})
    }
}
