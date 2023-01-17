// 3rd party dependencies
import { readFileSync } from 'fs';
import https from 'https';
import http from 'http';
import express from 'express';
import { WebSocketServer } from "ws";

// local dependencies
import { getAddress } from './utils';
import { log } from './log';
import config from './config.json';

// express app
const app = express();

//certs
const cert = readFileSync(config.connection.cert, 'utf8');
const privkey = readFileSync(config.connection.privkey, 'utf8');

// the HTTP or HTTPS server
const port: number = config.connection.port;
const server = config.connection.secure ? https.createServer({
    cert: cert,
    key: privkey
}, app) : http.createServer(app);

// start server
server.listen(port, () => {
    log.server(`Server started on ${getAddress()}:${port}`);
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/templates/index.html");
});

app.get("/chat", (req, res) => {
    res.sendFile(__dirname + "/templates/chat.html");
});

log.info('Routes OK');

// const connections = [];
//
// io.sockets.on("connection", socket => {
//     connections.push(socket);
//     console.log(" %s sockets is connected", connections.length);
//
//     socket.on("sending message", message => {
//         console.log("Message is receiveds :", message);
//
//         io.sockets.emit("new message", { message: message });
//     });
//
//     socket.on("disconnect", () => {
//         connections.splice(connections.indexOf(socket), 1);
//     });
// });

/**
 * The WebSocket server instance
 * */
export const ws = new WebSocketServer({ server: server });
