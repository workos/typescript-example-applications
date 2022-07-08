export declare class OauthException extends Error {
    readonly status: number;
    readonly requestID: string;
    readonly error: string | undefined;
    readonly errorDescription: string | undefined;
    readonly name: string;
    constructor(status: number, requestID: string, error: string | undefined, errorDescription: string | undefined);
}
