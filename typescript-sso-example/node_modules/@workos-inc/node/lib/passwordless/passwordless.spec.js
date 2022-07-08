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
const axios_1 = __importDefault(require("axios"));
const axios_mock_adapter_1 = __importDefault(require("axios-mock-adapter"));
const create_session_json_1 = __importDefault(require("./fixtures/create-session.json"));
const workos_1 = require("../workos");
const mock = new axios_mock_adapter_1.default(axios_1.default);
describe('Passwordless', () => {
    afterEach(() => mock.resetHistory());
    describe('createSession', () => {
        describe('with valid options', () => {
            it('creates a passwordless session', () => __awaiter(void 0, void 0, void 0, function* () {
                const email = 'passwordless-session-email@workos.com';
                const redirectURI = 'https://example.com/passwordless/callback';
                mock
                    .onPost('/passwordless/sessions', {
                    type: 'MagicLink',
                    email,
                    redirect_uri: redirectURI,
                })
                    .replyOnce(201, create_session_json_1.default);
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                const session = yield workos.passwordless.createSession({
                    type: 'MagicLink',
                    email,
                    redirectURI,
                });
                expect(session.email).toEqual(email);
                expect(session.object).toEqual('passwordless_session');
                expect(JSON.parse(mock.history.post[0].data).email).toEqual(email);
                expect(JSON.parse(mock.history.post[0].data).redirect_uri).toEqual(redirectURI);
                expect(mock.history.post[0].url).toEqual('/passwordless/sessions');
            }));
        });
    });
    describe('sendEmail', () => {
        describe('with a valid session id', () => {
            it(`sends a request to send a magic link email`, () => __awaiter(void 0, void 0, void 0, function* () {
                mock.onPost('/passwordless/sessions/session_123/send').replyOnce(200);
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                const sessionId = 'session_123';
                yield workos.passwordless.sendSession(sessionId);
                expect(mock.history.post[0].url).toEqual(`/passwordless/sessions/${sessionId}/send`);
            }));
        });
    });
});
