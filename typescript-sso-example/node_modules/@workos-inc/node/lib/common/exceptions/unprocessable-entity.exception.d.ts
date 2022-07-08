import { UnprocessableEntityError } from '../interfaces';
export declare class UnprocessableEntityException extends Error {
    readonly status: number;
    readonly name: string;
    readonly message: string;
    readonly code?: string;
    readonly requestID: string;
    constructor({ code, errors, message, requestID, }: {
        code?: string;
        errors?: UnprocessableEntityError[];
        message?: string;
        requestID: string;
    });
}
