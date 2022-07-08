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
const workos_1 = require("../workos");
const generate_link_invalid_json_1 = __importDefault(require("./fixtures/generate-link-invalid.json"));
const generate_link_json_1 = __importDefault(require("./fixtures/generate-link.json"));
const generate_portal_link_intent_interface_1 = require("./interfaces/generate-portal-link-intent.interface");
const mock = new axios_mock_adapter_1.default(axios_1.default);
const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
describe('Portal', () => {
    afterEach(() => mock.resetHistory());
    describe('generateLink', () => {
        describe('with a valid organization', () => {
            describe('with the sso intent', () => {
                it('returns an Admin Portal link', () => __awaiter(void 0, void 0, void 0, function* () {
                    mock
                        .onPost('/portal/generate_link', {
                        intent: generate_portal_link_intent_interface_1.GeneratePortalLinkIntent.SSO,
                        organization: 'org_01EHQMYV6MBK39QC5PZXHY59C3',
                        return_url: 'https://www.example.com',
                    })
                        .replyOnce(201, generate_link_json_1.default);
                    const { link } = yield workos.portal.generateLink({
                        intent: generate_portal_link_intent_interface_1.GeneratePortalLinkIntent.SSO,
                        organization: 'org_01EHQMYV6MBK39QC5PZXHY59C3',
                        returnUrl: 'https://www.example.com',
                    });
                    expect(link).toEqual('https://id.workos.com/portal/launch?secret=secret');
                }));
            });
            describe('with the dsync intent', () => {
                it('returns an Admin Portal link', () => __awaiter(void 0, void 0, void 0, function* () {
                    mock
                        .onPost('/portal/generate_link', {
                        intent: generate_portal_link_intent_interface_1.GeneratePortalLinkIntent.DSync,
                        organization: 'org_01EHQMYV6MBK39QC5PZXHY59C3',
                        return_url: 'https://www.example.com',
                    })
                        .reply(201, generate_link_json_1.default);
                    const { link } = yield workos.portal.generateLink({
                        intent: generate_portal_link_intent_interface_1.GeneratePortalLinkIntent.DSync,
                        organization: 'org_01EHQMYV6MBK39QC5PZXHY59C3',
                        returnUrl: 'https://www.example.com',
                    });
                    expect(link).toEqual('https://id.workos.com/portal/launch?secret=secret');
                }));
            });
        });
        describe('with an invalid organization', () => {
            it('throws an error', () => __awaiter(void 0, void 0, void 0, function* () {
                mock
                    .onPost('/portal/generate_link', {
                    intent: generate_portal_link_intent_interface_1.GeneratePortalLinkIntent.SSO,
                    organization: 'bogus-id',
                    return_url: 'https://www.example.com',
                })
                    .reply(400, generate_link_invalid_json_1.default, {
                    'X-Request-ID': 'a-request-id',
                });
                yield expect(workos.portal.generateLink({
                    intent: generate_portal_link_intent_interface_1.GeneratePortalLinkIntent.SSO,
                    organization: 'bogus-id',
                    returnUrl: 'https://www.example.com',
                })).rejects.toThrowError('Could not find an organization with the id, bogus-id.');
            }));
        });
    });
});
