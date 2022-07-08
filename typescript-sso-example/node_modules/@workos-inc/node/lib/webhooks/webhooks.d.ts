import { Webhook } from './interfaces/webhook.interface';
export declare class Webhooks {
    constructEvent({ payload, sigHeader, secret, tolerance, }: {
        payload: unknown;
        sigHeader: string;
        secret: string;
        tolerance?: number;
    }): Webhook;
    private verifyHeader;
    private getTimestampAndSignatureHash;
    private computeSignature;
    private secureCompare;
}
