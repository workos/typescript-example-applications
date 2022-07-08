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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSO = void 0;
const query_string_1 = __importDefault(require("query-string"));
class SSO {
    constructor(workos) {
        this.workos = workos;
    }
    deleteConnection(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.workos.delete(`/connections/${id}`);
        });
    }
    getAuthorizationURL({ connection, clientID, domain, domainHint, loginHint, organization, provider, redirectURI, state, }) {
        if (!domain && !provider && !connection && !organization) {
            throw new Error(`Incomplete arguments. Need to specify either a 'connection', 'organization', 'domain', or 'provider'.`);
        }
        if (domain) {
            this.workos.emitWarning('The `domain` parameter for `getAuthorizationURL` is deprecated. Please use `organization` instead.');
        }
        const query = query_string_1.default.stringify({
            connection,
            organization,
            domain,
            domain_hint: domainHint,
            login_hint: loginHint,
            provider,
            client_id: clientID,
            redirect_uri: redirectURI,
            response_type: 'code',
            state,
        });
        return `${this.workos.baseURL}/sso/authorize?${query}`;
    }
    getConnection(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.workos.get(`/connections/${id}`);
            return data;
        });
    }
    getProfileAndToken({ code, clientID, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = new URLSearchParams({
                client_id: clientID,
                client_secret: this.workos.key,
                grant_type: 'authorization_code',
                code,
            });
            const { data } = yield this.workos.post('/sso/token', form);
            return data;
        });
    }
    getProfile({ accessToken }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.workos.get('/sso/profile', {
                accessToken,
            });
            return data;
        });
    }
    listConnections(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.workos.get(`/connections`, {
                query: options,
            });
            return data;
        });
    }
}
exports.SSO = SSO;
