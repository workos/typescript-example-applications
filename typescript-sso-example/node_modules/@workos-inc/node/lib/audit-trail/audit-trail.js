"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditTrail = void 0;
class AuditTrail {
    constructor(workos) {
        this.workos = workos;
    }
    createEvent(event, { idempotencyKey } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.workos.post('/events', event, { idempotencyKey });
        });
    }
    listEvents(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.workos.get('/events', {
                query: options,
            });
            return data;
        });
    }
}
exports.AuditTrail = AuditTrail;
