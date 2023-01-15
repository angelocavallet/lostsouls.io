// 3rd party dependencies
import { nanoid } from 'nanoid';
import { networkInterfaces } from 'os';

// local dependencies
import { Token, CallbackToken, AuthToken, StrongToken } from './token';
import config from './config.json';

/**
 * Get the local IP address of the server
 * */
export const getAddress = (): string => {
    const nets = networkInterfaces();
    const results = Object.create(null);

    for (const name of Object.keys(nets)) {
        for (const net of nets?.[name] ?? []) {
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }

    return results?.[config.connection.interface]?.[0];
}

/**
 * Generate tokens of specific lengths
 * */
export class TokenGenerator {
    static callback(): CallbackToken {
        return Token(nanoid(5), 5);
    }

    static auth(): AuthToken {
        return Token(nanoid(11), 11);
    }

    static strong(): StrongToken {
        return Token(nanoid(21), 21);
    }
}