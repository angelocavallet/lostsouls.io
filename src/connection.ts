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

// server single-page application for debugging
app.get('/', (req, res) => {
    res.send(`Multiplayer game server for https://${getAddress()}:${port}`);
});

/**
 * The WebSocket server instance
 * */
export const ws = new WebSocketServer({ server: server });
