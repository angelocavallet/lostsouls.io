// 3rd party dependencies
import { appendFileSync, readFileSync, writeFileSync } from 'fs';

// local dependencies
import config from './config.json';

const logPath = config.log.path;

enum LogLevel {
    DEBUG,
    SERVER,
    CONN,
    INFO,
    WARN,
    ERROR
}

enum LogColors {
    DEBUG = '\x1b[97m',
    SERVER = '\x1b[32m',
    CONN = '\x1b[34m',
    INFO = '\x1b[90m',
    WARN = '\x1b[33m',
    ERROR = '\x1b[31m'
}

interface ILogger {
    debug(message: string): void;
    server(message: string): void;
    conn(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}

class Logger implements ILogger {
    subscriptions: boolean[];
    maxLines: number;

    constructor(options: {states?:[boolean, boolean, boolean, boolean, boolean, boolean], maxLines?: number}) {
        this.subscriptions = options.states ?? Array.from({length: Object.keys(LogLevel).length / 2}, i => i = true);
        this.maxLines = options.maxLines ?? 100;
    }

    debug(message: string): void {
        this.output(LogLevel.DEBUG, message);
    }

    server(message: string): void {
        this.output(LogLevel.SERVER, message);
    }

    conn(message: string): void {
        this.output(LogLevel.CONN, message);
    }

    info(message: string): void {
        this.output(LogLevel.INFO, message);
    }

    warn(message: string): void {
        this.output(LogLevel.WARN, message);
    }

    error(message: string): void {
        this.output(LogLevel.ERROR, message);
    }

    private output(level: LogLevel, message: string): void {
        let file = `${logPath}log-${new Date().toLocaleDateString('en-US').replace(/\//g, "_")}.txt`;
        let logMessage = `[${LogLevel[level]}] ${message}`;

        if (this.subscriptions[level]) {
            console.log(`${Object.values(LogColors)[level]}[${LogLevel[level]}]\x1b[0m`, message);
        }

        if (this.maxLines <= 0) {
            appendFileSync(file, logMessage, {flag: "a", encoding: "utf8"});
            return;
        }
        
        let lines:string[] = [];
        try {
            lines = readFileSync(file, 'utf8').split('\n');
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
        }
        
        lines.push(logMessage);

        if (lines.length > this.maxLines) {
            lines.shift();
        }

        writeFileSync(file, lines.join('\n'), {flag: "w", encoding: "utf8"});
    }
}

/**
 * The Logger instance
 * */
export const log = new Logger({states: [config.log.levels.debug, config.log.levels.server, config.log.levels.conn, config.log.levels.info, config.log.levels.warn, config.log.levels.error], maxLines: config.log.maxLines});