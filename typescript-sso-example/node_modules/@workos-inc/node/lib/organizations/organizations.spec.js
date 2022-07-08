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
const create_organization_invalid_json_1 = __importDefault(require("./fixtures/create-organization-invalid.json"));
const create_organization_json_1 = __importDefault(require("./fixtures/create-organization.json"));
const get_organization_json_1 = __importDefault(require("./fixtures/get-organization.json"));
const list_organizations_json_1 = __importDefault(require("./fixtures/list-organizations.json"));
const update_organization_json_1 = __importDefault(require("./fixtures/update-organization.json"));
const mock = new axios_mock_adapter_1.default(axios_1.default);
const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
describe('Organizations', () => {
    afterEach(() => mock.resetHistory());
    describe('listOrganizations', () => {
        describe('without any options', () => {
            it('returns organizations and metadata', () => __awaiter(void 0, void 0, void 0, function* () {
                mock.onGet('/organizations').replyOnce(200, list_organizations_json_1.default);
                const { data, list_metadata: listMetadata } = yield workos.organizations.listOrganizations();
                expect(mock.history.get[0].params).toBeUndefined();
                expect(mock.history.get[0].url).toEqual('/organizations');
                expect(data).toHaveLength(7);
                expect(listMetadata).toEqual({
                    after: null,
                    before: 'before-id',
                });
            }));
        });
        describe('with the domain option', () => {
            it('forms the proper request to the API', () => __awaiter(void 0, void 0, void 0, function* () {
                mock
                    .onGet('/organizations', {
                    domains: ['example.com'],
                })
                    .replyOnce(200, list_organizations_json_1.default);
                const { data } = yield workos.organizations.listOrganizations({
                    domains: ['example.com'],
                });
                expect(mock.history.get[0].params).toEqual({
                    domains: ['example.com'],
                });
                expect(mock.history.get[0].url).toEqual('/organizations');
                expect(data).toHaveLength(7);
            }));
        });
        describe('with the before option', () => {
            it('forms the proper request to the API', () => __awaiter(void 0, void 0, void 0, function* () {
                mock
                    .onGet('/organizations', {
                    before: 'before-id',
                })
                    .replyOnce(200, list_organizations_json_1.default);
                const { data } = yield workos.organizations.listOrganizations({
                    before: 'before-id',
                });
                expect(mock.history.get[0].params).toEqual({
                    before: 'before-id',
                });
                expect(mock.history.get[0].url).toEqual('/organizations');
                expect(data).toHaveLength(7);
            }));
        });
        describe('with the after option', () => {
            it('forms the proper request to the API', () => __awaiter(void 0, void 0, void 0, function* () {
                mock
                    .onGet('/organizations', {
                    after: 'after-id',
                })
                    .replyOnce(200, list_organizations_json_1.default);
                const { data } = yield workos.organizations.listOrganizations({
                    after: 'after-id',
                });
                expect(mock.history.get[0].params).toEqual({
                    after: 'after-id',
                });
                expect(mock.history.get[0].url).toEqual('/organizations');
                expect(data).toHaveLength(7);
            }));
        });
        describe('with the limit option', () => {
            it('forms the proper request to the API', () => __awaiter(void 0, void 0, void 0, function* () {
                mock
                    .onGet('/organizations', {
                    limit: 10,
                })
                    .replyOnce(200, list_organizations_json_1.default);
                const { data } = yield workos.organizations.listOrganizations({
                    limit: 10,
                });
                expect(mock.history.get[0].params).toEqual({
                    limit: 10,
                });
                expect(mock.history.get[0].url).toEqual('/organizations');
                expect(data).toHaveLength(7);
            }));
        });
    });
    describe('createOrganization', () => {
        describe('with a valid payload', () => {
            it('creates an organization', () => __awaiter(void 0, void 0, void 0, function* () {
                mock
                    .onPost('/organizations', {
                    domains: ['example.com'],
                    name: 'Test Organization',
                })
                    .replyOnce(201, create_organization_json_1.default);
                const subject = yield workos.organizations.createOrganization({
                    domains: ['example.com'],
                    name: 'Test Organization',
                });
                expect(subject.id).toEqual('org_01EHT88Z8J8795GZNQ4ZP1J81T');
                expect(subject.name).toEqual('Test Organization');
                expect(subject.domains).toHaveLength(1);
            }));
        });
        describe('with an invalid payload', () => {
            it('returns an error', () => __awaiter(void 0, void 0, void 0, function* () {
                mock
                    .onPost('/organizations', {
                    domains: ['example.com'],
                    name: 'Test Organization',
                })
                    .replyOnce(409, create_organization_invalid_json_1.default, {
                    'X-Request-ID': 'a-request-id',
                });
                yield expect(workos.organizations.createOrganization({
                    domains: ['example.com'],
                    name: 'Test Organization',
                })).rejects.toThrowError('An Organization with the domain example.com already exists.');
            }));
        });
    });
    describe('getOrganization', () => {
        it(`requests an Organization`, () => __awaiter(void 0, void 0, void 0, function* () {
            const mock = new axios_mock_adapter_1.default(axios_1.default);
            mock
                .onGet('/organizations/org_01EHT88Z8J8795GZNQ4ZP1J81T')
                .replyOnce(200, get_organization_json_1.default);
            const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
            const subject = yield workos.organizations.getOrganization('org_01EHT88Z8J8795GZNQ4ZP1J81T');
            expect(mock.history.get[0].url).toEqual('/organizations/org_01EHT88Z8J8795GZNQ4ZP1J81T');
            expect(subject.id).toEqual('org_01EHT88Z8J8795GZNQ4ZP1J81T');
            expect(subject.name).toEqual('Test Organization 3');
            expect(subject.allow_profiles_outside_organization).toEqual(false);
            expect(subject.domains).toHaveLength(1);
        }));
    });
    describe('deleteOrganization', () => {
        it('sends request to delete an Organization', () => __awaiter(void 0, void 0, void 0, function* () {
            const mock = new axios_mock_adapter_1.default(axios_1.default);
            mock
                .onDelete('/organizations/org_01EHT88Z8J8795GZNQ4ZP1J81T')
                .replyOnce(200, {});
            const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
            yield workos.organizations.deleteOrganization('org_01EHT88Z8J8795GZNQ4ZP1J81T');
            expect(mock.history.delete[0].url).toEqual('/organizations/org_01EHT88Z8J8795GZNQ4ZP1J81T');
        }));
    });
    describe('updateOrganization', () => {
        describe('with a valid payload', () => {
            it('updates an organization', () => __awaiter(void 0, void 0, void 0, function* () {
                mock
                    .onPut('/organizations/org_01EHT88Z8J8795GZNQ4ZP1J81T', {
                    domains: ['example.com'],
                    name: 'Test Organization 2',
                })
                    .replyOnce(201, update_organization_json_1.default);
                const subject = yield workos.organizations.updateOrganization({
                    organization: 'org_01EHT88Z8J8795GZNQ4ZP1J81T',
                    domains: ['example.com'],
                    name: 'Test Organization 2',
                });
                expect(subject.id).toEqual('org_01EHT88Z8J8795GZNQ4ZP1J81T');
                expect(subject.name).toEqual('Test Organization 2');
                expect(subject.domains).toHaveLength(1);
            }));
        });
    });
});
