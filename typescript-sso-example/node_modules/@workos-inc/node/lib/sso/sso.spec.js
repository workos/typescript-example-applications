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
describe('SSO', () => {
    describe('SSO', () => {
        describe('getAuthorizationURL', () => {
            describe('with no custom api hostname', () => {
                it('generates an authorize url with the default api hostname', () => {
                    const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                    const url = workos.sso.getAuthorizationURL({
                        domain: 'lyft.com',
                        clientID: 'proj_123',
                        redirectURI: 'example.com/sso/workos/callback',
                    });
                    expect(url).toMatchSnapshot();
                });
            });
            describe('with no domain or provider', () => {
                it('throws an error for incomplete arguments', () => {
                    const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                    const urlFn = () => workos.sso.getAuthorizationURL({
                        clientID: 'proj_123',
                        redirectURI: 'example.com/sso/workos/callback',
                    });
                    expect(urlFn).toThrowErrorMatchingSnapshot();
                });
            });
            describe('with a provider', () => {
                it('generates an authorize url with the provider', () => {
                    const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU', {
                        apiHostname: 'api.workos.dev',
                    });
                    const url = workos.sso.getAuthorizationURL({
                        provider: 'Google',
                        clientID: 'proj_123',
                        redirectURI: 'example.com/sso/workos/callback',
                    });
                    expect(url).toMatchSnapshot();
                });
            });
            describe('with a connection', () => {
                it('generates an authorize url with the connection', () => {
                    const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU', {
                        apiHostname: 'api.workos.dev',
                    });
                    const url = workos.sso.getAuthorizationURL({
                        connection: 'connection_123',
                        clientID: 'proj_123',
                        redirectURI: 'example.com/sso/workos/callback',
                    });
                    expect(url).toMatchSnapshot();
                });
            });
            describe('with an `organization`', () => {
                it('generates an authorization URL with the organization', () => {
                    const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU', {
                        apiHostname: 'api.workos.dev',
                    });
                    const url = workos.sso.getAuthorizationURL({
                        organization: 'organization_123',
                        clientID: 'proj_123',
                        redirectURI: 'example.com/sso/workos/callback',
                    });
                    expect(url).toMatchSnapshot();
                });
            });
            describe('with a custom api hostname', () => {
                it('generates an authorize url with the custom api hostname', () => {
                    const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU', {
                        apiHostname: 'api.workos.dev',
                    });
                    const url = workos.sso.getAuthorizationURL({
                        domain: 'lyft.com',
                        clientID: 'proj_123',
                        redirectURI: 'example.com/sso/workos/callback',
                    });
                    expect(url).toMatchSnapshot();
                });
            });
            describe('with state', () => {
                it('generates an authorize url with the provided state', () => {
                    const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                    const url = workos.sso.getAuthorizationURL({
                        domain: 'lyft.com',
                        clientID: 'proj_123',
                        redirectURI: 'example.com/sso/workos/callback',
                        state: 'custom state',
                    });
                    expect(url).toMatchSnapshot();
                });
            });
            describe('with domainHint', () => {
                it('generates an authorize url with the provided domain hint', () => {
                    const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                    const url = workos.sso.getAuthorizationURL({
                        domainHint: 'lyft.com',
                        connection: 'connection_123',
                        clientID: 'proj_123',
                        redirectURI: 'example.com/sso/workos/callback',
                        state: 'custom state',
                    });
                    expect(url).toMatchInlineSnapshot(`"https://api.workos.com/sso/authorize?client_id=proj_123&connection=connection_123&domain_hint=lyft.com&redirect_uri=example.com%2Fsso%2Fworkos%2Fcallback&response_type=code&state=custom%20state"`);
                });
            });
            describe('with loginHint', () => {
                it('generates an authorize url with the provided login hint', () => {
                    const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                    const url = workos.sso.getAuthorizationURL({
                        loginHint: 'foo@workos.com',
                        connection: 'connection_123',
                        clientID: 'proj_123',
                        redirectURI: 'example.com/sso/workos/callback',
                        state: 'custom state',
                    });
                    expect(url).toMatchInlineSnapshot(`"https://api.workos.com/sso/authorize?client_id=proj_123&connection=connection_123&login_hint=foo%40workos.com&redirect_uri=example.com%2Fsso%2Fworkos%2Fcallback&response_type=code&state=custom%20state"`);
                });
            });
        });
        describe('getProfileAndToken', () => {
            describe('with all information provided', () => {
                it('sends a request to the WorkOS api for a profile', () => __awaiter(void 0, void 0, void 0, function* () {
                    const mock = new axios_mock_adapter_1.default(axios_1.default);
                    const expectedBody = new URLSearchParams({
                        client_id: 'proj_123',
                        client_secret: 'sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU',
                        code: 'authorization_code',
                        grant_type: 'authorization_code',
                    });
                    expectedBody.sort();
                    mock.onPost('/sso/token').replyOnce((config) => {
                        const actualBody = new URLSearchParams(config.data);
                        actualBody.sort();
                        if (actualBody.toString() === expectedBody.toString()) {
                            return [
                                200,
                                {
                                    access_token: '01DMEK0J53CVMC32CK5SE0KZ8Q',
                                    profile: {
                                        id: 'prof_123',
                                        idp_id: '123',
                                        organization_id: 'org_123',
                                        connection_id: 'conn_123',
                                        connection_type: 'OktaSAML',
                                        email: 'foo@test.com',
                                        first_name: 'foo',
                                        last_name: 'bar',
                                        raw_attributes: {
                                            email: 'foo@test.com',
                                            first_name: 'foo',
                                            last_name: 'bar',
                                        },
                                    },
                                },
                            ];
                        }
                        return [404];
                    });
                    const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                    const { access_token: accessToken, profile } = yield workos.sso.getProfileAndToken({
                        code: 'authorization_code',
                        clientID: 'proj_123',
                    });
                    expect(mock.history.post.length).toBe(1);
                    const { data, headers } = mock.history.post[0];
                    expect(data).toMatchSnapshot();
                    expect(headers).toMatchSnapshot();
                    expect(accessToken).toBe('01DMEK0J53CVMC32CK5SE0KZ8Q');
                    expect(profile).toMatchSnapshot();
                }));
            });
        });
        describe('getProfile', () => {
            it('calls the `/sso/profile` endpoint with the provided access token', () => __awaiter(void 0, void 0, void 0, function* () {
                const mock = new axios_mock_adapter_1.default(axios_1.default);
                mock
                    .onGet('/sso/profile', {
                    accessToken: 'access_token',
                })
                    .replyOnce(200, {
                    id: 'prof_123',
                    idp_id: '123',
                    organization_id: 'org_123',
                    connection_id: 'conn_123',
                    connection_type: 'OktaSAML',
                    email: 'foo@test.com',
                    first_name: 'foo',
                    last_name: 'bar',
                    raw_attributes: {
                        email: 'foo@test.com',
                        first_name: 'foo',
                        last_name: 'bar',
                    },
                });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                const profile = yield workos.sso.getProfile({
                    accessToken: 'access_token',
                });
                expect(mock.history.get.length).toBe(1);
                const { headers } = mock.history.get[0];
                expect(headers.Authorization).toBe(`Bearer access_token`);
                expect(profile.id).toBe('prof_123');
            }));
        });
        describe('deleteConnection', () => {
            it('sends request to delete a Connection', () => __awaiter(void 0, void 0, void 0, function* () {
                const mock = new axios_mock_adapter_1.default(axios_1.default);
                mock.onDelete('/connections/conn_123').replyOnce(200, {});
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                yield workos.sso.deleteConnection('conn_123');
                expect(mock.history.delete[0].url).toEqual('/connections/conn_123');
            }));
        });
        describe('getConnection', () => {
            it(`requests a Connection`, () => __awaiter(void 0, void 0, void 0, function* () {
                const mock = new axios_mock_adapter_1.default(axios_1.default);
                mock.onGet('/connections/conn_123').replyOnce(200, {});
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                yield workos.sso.getConnection('conn_123');
                expect(mock.history.get[0].url).toEqual('/connections/conn_123');
            }));
        });
        describe('listConnections', () => {
            it(`requests a list of Connections`, () => __awaiter(void 0, void 0, void 0, function* () {
                const mock = new axios_mock_adapter_1.default(axios_1.default);
                mock.onGet('/connections').replyOnce(200, {});
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                yield workos.sso.listConnections();
                expect(mock.history.get[0].url).toEqual('/connections');
            }));
        });
    });
});
