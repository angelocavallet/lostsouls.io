import * as jwt from 'jsonwebtoken';
import {db} from './database';

type Connection = {
    connected: boolean;
    init: boolean;
    lastTimeConnected: Date;
};

type UserInfo = {
    connection: Connection,
    secretSHA3: string,
};

interface IUser {
    token: null
    info: UserInfo;
}

/**
 * A data structure that represents a user
 * */
export class User implements IUser {
    token: null;
    info: UserInfo;

    constructor() {
        this.info = {
            secretSHA3: 'test',
            connection: {
                connected: false,
                init: false,
                lastTimeConnected: new Date()
            }
        }
        this.token = jwt.sign({data: 'authenticated'}, this.info.secretSHA3);
    }

    static async fetchUser(token: string): Promise<User | null> {


        const users = await db.get<User[]>('users');
        if (users) {
            const user = users.find(user => user.token === token);
            if (user) {
                // try {
                //     const data = jwt.verify(token, user.info.secretSHA3);
                //     console.log(data);
                // } catch (error) {
                //     console.log('Invalid token');
                // }

                return user;
            }
        } else {
            await db.set<User[]>('users', []);
        }
        return null;
    }

    static async fetchAll(): Promise<User[] | null> {
        return await db.get<User[]>('users');
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
        } else {
            await db.set<User[]>('users', [user]);
        }
    }
}
