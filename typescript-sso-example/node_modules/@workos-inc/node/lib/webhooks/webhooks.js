"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webhooks = void 0;
const crypto_1 = __importDefault(require("crypto"));
const exceptions_1 = require("../common/exceptions");
class Webhooks {
    constructEvent({ payload, sigHeader, secret, tolerance = 180000, }) {
        const options = { payload, sigHeader, secret, tolerance };
        this.verifyHeader(options);
        const webhookPayload = payload;
        return webhookPayload;
    }
    verifyHeader({ payload, sigHeader, secret, tolerance = 180000, }) {
        const [timestamp, signatureHash] = this.getTimestampAndSignatureHash(sigHeader);
        if (!signatureHash || Object.keys(signatureHash).length === 0) {
            throw new exceptions_1.SignatureVerificationException('No signature hash found with expected scheme v1');
        }
        if (parseInt(timestamp, 10) < Date.now() - tolerance) {
            throw new exceptions_1.SignatureVerificationException('Timestamp outside the tolerance zone');
        }
        const expectedSig = this.computeSignature(timestamp, payload, secret);
        if (this.secureCompare(expectedSig, signatureHash) === false) {
            throw new exceptions_1.SignatureVerificationException('Signature hash does not match the expected signature hash for payload');
        }
        return true;
    }
    getTimestampAndSignatureHash(sigHeader) {
        const signature = sigHeader;
        const [t, v1] = signature.split(',');
        if (typeof t === 'undefined' || typeof v1 === 'undefined') {
            throw new exceptions_1.SignatureVerificationException('Signature or timestamp missing');
        }
        const { 1: timestamp } = t.split('=');
        const { 1: signatureHash } = v1.split('=');
        return [timestamp, signatureHash];
    }
    computeSignature(timestamp, payload, secret) {
        payload = JSON.stringify(payload);
        const signedPayload = `${timestamp}.${payload}`;
        const expectedSignature = crypto_1.default
            .createHmac('sha256', secret)
            .update(signedPayload)
            .digest()
            .toString('hex');
        return expectedSignature;
    }
    secureCompare(stringA, stringB) {
        const strA = Buffer.from(stringA);
        const strB = Buffer.from(stringB);
        if (strA.length !== strB.length) {
            return false;
        }
        if (crypto_1.default.timingSafeEqual) {
            return crypto_1.default.timingSafeEqual(strA, strB);
        }
        const len = strA.length;
        let result = 0;
        for (let i = 0; i < len; ++i) {
            // tslint:disable-next-line:no-bitwise
            result |= strA[i] ^ strB[i];
        }
        return result === 0;
    }
}
exports.Webhooks = Webhooks;
