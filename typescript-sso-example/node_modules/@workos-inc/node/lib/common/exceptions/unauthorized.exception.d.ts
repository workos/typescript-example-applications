export declare class UnauthorizedException extends Error {
    readonly requestID: string;
    readonly status: number;
    readonly name: string;
    readonly message: string;
    constructor(requestID: string);
}
