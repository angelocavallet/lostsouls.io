

// local dependencies
import { log } from './log';
import { AuthToken, CallbackToken } from './token';

const has = <K extends string>(
    key: K,
    x: object,
): x is { [key in K]: unknown } => (
    key in x
);

const OutgoingEvents = ['ack', 'init'] as const;
const IncomingEvents = ['ack'] as const;

type OutgoingEvent = typeof OutgoingEvents[number];
type IncomingEvent = typeof IncomingEvents[number];
type Event = OutgoingEvent | IncomingEvent;

type SignalType = 'in' | 'out';
type SignalScope = 'single' | 'room' | 'global';

class SignalProperty<T> {
    name: string;
    required: boolean;
    data?: T;
    accept: (input: string) => boolean;

    constructor(name, required: boolean, accept: (input: string) => boolean) {
        this.name = name;
        this.required = required;
        this.accept = accept;
    }

    set(input: string): boolean {
        if (this.accept(input)) {
            this.data = input as T;
            return true;
        }
        else {
            return false;
        }
    }
}

class Signal {
    info: {
        type: SignalProperty<SignalType>;
        scope: SignalProperty<SignalScope>;
        auth: SignalProperty<AuthToken>;
        ack: SignalProperty<boolean>;
        callback: SignalProperty<CallbackToken>;
        event: SignalProperty<Event>;
        data: SignalProperty<unknown>;
    }

    constructor(type: 'in' | 'out', ack?: boolean) {
        this.info = {
            type: new SignalProperty('type', true, (input) => input == type),
            scope: new SignalProperty('scope', true, (input) => ['single', 'room', 'global'].includes(input)),
            auth: new SignalProperty('auth', type == 'in', (input) => input.length == 11),
            ack: new SignalProperty('ack', ack ?? false, (input) => input == 'true' || input == 'false'),
            callback: new SignalProperty('callback', ack ?? false, (input) => input.length == 5),
            event: new SignalProperty('event', true, (input) => {
                if (type == 'in') {
                    return IncomingEvents.includes(input as IncomingEvent);
                }
                else {
                    return OutgoingEvents.includes(input as OutgoingEvent);
                }
            }),
            data: new SignalProperty('data', false, (input) => true)
        };
    }

    valid(): string {
        this.info.auth.required = this.info.type.data == 'in';
        this.info.callback.required = this.info.ack.required && this.info.ack.data == true;

        let out: string[] = [];
        Object.values(this.info).forEach((prop) => {
            if (prop.required && (prop.data === undefined || prop.data === null)) {
                out.push(prop.name);
            }
        });

        return out.join(',');
    }
}

/**
 * Converts between a string and a Signal object
 * */
export class SignalGenerator {
    static parse(signal: string, type: 'in' | 'out' = 'in'): Signal | null {
        const out = new Signal(type);

        signal.substring(2, signal.length - 2).split(',').forEach((pair) => {
            const [key, value] = pair.split(':');
            
            let tkey = key as keyof typeof out.info;
            if (has(tkey, out.info)) {
                if (out.info[tkey].set(value)) {
                    log.debug(`Set property '${key}' to '${value}'`);
                }
                else {
                    log.warn(`Failed to set property ${key} to ${value}`);
                }
            }
            else {
                log.warn(`Invalid signal property ${key}`);
            }
        });

        let valid = out.valid();

        if (valid.length > 0) {
            log.error(`Not enough properties to create a valid signal. Missing: ${valid}`);
            return null;
        }

        return out;
    }

    static generate(): string {
        return '';
    }
}