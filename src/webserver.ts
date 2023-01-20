
import { readFileSync } from 'fs';
import https from 'https';
import http from 'http';
import express from 'express';
import config from "./config.json";
import {log} from "./log";
import {getAddress} from "./utils";

log.server('Start WebServer');

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

//Setting routes from config.json
config.routes.forEach((route) => {
   app.get(route.url, (req, res) => {
       res.sendFile(__dirname + route.file);
   });
});
log.server('Routes OK');

server.listen(port, () => {
    log.server(`Server started on ${getAddress()}:${port}`);
})

export const WebServer = server;