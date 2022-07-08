"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericServerException = void 0;
class GenericServerException extends Error {
    constructor(status, message, requestID) {
        super();
        this.status = status;
        this.requestID = requestID;
        this.name = 'GenericServerException';
        this.message = 'The request could not be completed.';
        if (message) {
            this.message = message;
        }
    }
}
exports.GenericServerException = GenericServerException;
