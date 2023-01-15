// local dependencies
import { db } from './database';
import { AuthToken } from './token';

type Connection = {
    connected: boolean;
    init: boolean;
};

type UserInfo = {
    connection: Connection,
};

interface IUser {
    token: AuthToken;
    info: UserInfo;
}

/**
 * A data structure that represents a user
 * */
export class User implements IUser {
    token: AuthToken;
    info: UserInfo;

    constructor(token: AuthToken) {
        this.token = token;
        this.info = {
            connection: {
                connected: false,
                init: false
            }
        }
    }
    
    toJSON(): string {
        return JSON.stringify(this);
    }

    static async fetchUser(token: string): Promise<User | null> {
        const users = await db.get<User[]>('users');
        if (users) {
            const user = users.find(user => user.token === token);
            if (user) {
                return user;
            }
        }
        else {
            await db.set<User[]>('users', []);
        }
        return null;
    }
    
    static async saveUser(user: User): Promise<void> {
        const users = await db.get<User[]>('users');
        if (users) {
            const index = users.findIndex(u => u.token === user.token);
            if (index !== -1) {
                users[index] = user;
                await db.set<User[]>('users', users);
                return;
            }
        }
        else {
            await db.set<User[]>('users', [user]);
        }
    }
}
