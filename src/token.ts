type PToken<Length> = string & {
    readonly __Token__: never;
};

const isStringOfLength = <Length extends number>(str: string, len: Length,): str is PToken<Length> => str.trim().length == len;

export type CallbackToken = PToken<5>;
export type AuthToken = PToken<11>;
export type StrongToken = PToken<21>;

/**
 * A generator for a token of a specified length
 * */
export const Token = <Length extends number>(input: string, length: Length): PToken<Length> => {
    if (!isStringOfLength(input, length)) {
        throw new Error("Input is not between specified length or contains whitespace");
    }
    
    return input;
};