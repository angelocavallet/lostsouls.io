import {log} from './log';

import {WebServer} from "./webserver";
import {WebSocket, WebSocketServer} from "ws";

import {User} from './user';
import {Message, MessageType} from "./message";
import {Exception, ExceptionType} from "./exceptions";

const clients: WebSocket[] = [];
const socket = new WebSocketServer({server: WebServer})


function spreadMessage(message: Message) {
    let msg = (new Message(message.type, null, message.data)).toJSON();
    clients.forEach((client) => {
        client.send(msg);
    });
}

log.server("Hot Loading player database");
//@todo filter most recently users
let users = User.fetchAll();

socket.on("connection", async (client, req) => {
    log.conn(`Client connected from ${req.socket.remoteAddress?.replace('::ffff:', '')}`);
    clients.push(client);

    client.on("message", async (data, isBinary) => {
        log.conn(`Client message`);
        const message = Message.getMessageFromJSON(data.toString());

        //Login Access
        if (message.type === MessageType.AUTHENTICATION) {
            if (!message.token) {
                let user = new User();
                user.info.connection.connected = true;
                user.info.connection.init = false;
                await User.saveUser(user);

                log.conn("Sending NEW Client Auth Token");
                client.send((new Message(MessageType.AUTHENTICATION, user.token, null)).toJSONAuth());
                return;
            }
        }

        if (!message.token) {
            client.send((new Exception(ExceptionType.AUTHENTICATION, "Token not found.")).toJSON());
            client.close();
        }

        let user = User.fetchUser(message.token);
        if (!user) {
            log.conn("Sending Invaid Auth Token");
            client.send((new Exception(ExceptionType.AUTHENTICATION, "Invalid Token!")).toJSON());
            client.close();
        }

        switch (message.type) {
            case MessageType.DEBUG:
                console.log(message.data);
                spreadMessage(message);
        }

    });
    // ws.on("message", function(client, str) {
    //     let obj = JSON.parse(str);
    //     console.log(obj)
    //     if("id" in obj) {
    //         // New client, add it to the id/client object
    //         clients[obj.id] = client;
    //     } else {
    //         // Send data to the client requested
    //         clients[obj.to].send(obj.data);
    //     }
    // });
    //
    // ws.on('message', (message: string) => {
    //     console.log('Invalid token');
    //     // check if the message has a valid token
    //     try {
    //         const data = jwt.verify(JSON.parse(message).token, secret);
    //         console.log(data);
    //     } catch (error) {
    //         console.log('Invalid token');
    //     }
    // });

    // let user: Readonly<User> | null = token ? await User.fetchUser(token) : null;
    // if (user) {
    //     log.info(`Authenticated a user`);
    //     user.info.connection.connected = true;
    //     user.info.connection.init = true;
    // }
    // else {
    //     log.info(`User did not provide a token or it was not valid`);
    //     log.info(`Creating a new user...`);
    //     user = new User(TokenGenerator.auth());
    //     user.info.connection.connected = true;
    //     user.info.connection.init = false;
    //     await User.saveUser(user);
    //
    //     log.info(`Sending token to user`);
    //
    // }
    //
    // client.on("message", (data, isBinary) => {
    //     // if (!user) {
    //     //     log.warn(`Received message from unauthenticated user`);
    //     //     return;
    //     // }
    //
    //     if (isBinary) {
    //         log.info(`Received binary message of ${data.toString('hex').length/2} bytes`);
    //         return;
    //     }
    //
    //     log.info(`Received message => "${data}"`);
    // });
});

