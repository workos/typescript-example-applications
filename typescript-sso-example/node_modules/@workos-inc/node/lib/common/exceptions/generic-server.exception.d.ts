export declare class GenericServerException extends Error {
    readonly status: number;
    readonly requestID: string;
    readonly name: string;
    readonly message: string;
    constructor(status: number, message: string | undefined, requestID: string);
}
