// local dependencies
import { ws } from './connection';
import { User } from './user';
import { log } from './log';
import { TokenGenerator } from './utils';
import { Token, AuthToken, CallbackToken } from './token';
import { SignalGenerator } from './signal';


ws.on("connection", async (client, req) => {
    log.conn(`Client connected from ${req.socket.remoteAddress?.replace('::ffff:', '')}`);
    const searchParams = new URLSearchParams(req.url?.replace('/', ''));
    const token = searchParams.get('token');

    let user: Readonly<User> | null = token ? await User.fetchUser(token) : null;
    if (user) {
        log.info(`Authenticated a user`);
        user.info.connection.connected = true;
        user.info.connection.init = true;
    }
    else {
        log.info(`User did not provide a token or it was not valid`);
        log.info(`Creating a new user...`);
        user = new User(TokenGenerator.auth());
        user.info.connection.connected = true;
        user.info.connection.init = false;
        await User.saveUser(user);

        log.info(`Sending token to user`);
        
    }

    client.on("message", (data, isBinary) => {
        if (!user) {
            log.warn(`Received message from unauthenticated user`);
            return;
        }

        if (isBinary) {
            log.info(`Received binary message of ${data.toString('hex').length/2} bytes`);
            return;
        }

        log.info(`Received message => "${data}"`);
    });

    client.on("close", () => {
        log.conn(`Client disconnected`);
        if (user) {
            user.info.connection.connected = false;
            user.info.connection.init = false;
        }
    });
});