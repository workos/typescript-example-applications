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
const exceptions_1 = require("../common/exceptions");
const workos_1 = require("../workos");
const mock = new axios_mock_adapter_1.default(axios_1.default);
const event = {
    group: 'WorkOS',
    actor_name: 'WorkOS@example.com',
    actor_id: 'user_1',
    location: ' 192.0.0.8',
    occurred_at: new Date(0),
    target_name: 'Security Audit 2018',
    target_id: 'document_39127',
    action_type: 'U',
    action: 'document.updated',
};
const serializeEventOptions = (options) => (Object.assign(Object.assign({}, options), { occurred_at: options.occurred_at.toISOString() }));
describe('AuditTrail', () => {
    describe('createEvent', () => {
        describe('when the api responds with a 201 CREATED', () => {
            describe('with an idempotency key', () => {
                it('includes an idempotency key with request', () => __awaiter(void 0, void 0, void 0, function* () {
                    mock
                        .onPost('/events', serializeEventOptions(event))
                        .replyOnce(201, { success: true });
                    const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                    yield expect(workos.auditTrail.createEvent(event, {
                        idempotencyKey: 'the-idempotency-key',
                    })).resolves.toBeUndefined();
                    expect(mock.history.post[0].headers['Idempotency-Key']).toEqual('the-idempotency-key');
                }));
            });
            it('posts Event successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                mock
                    .onPost('/events', serializeEventOptions(event))
                    .replyOnce(201, { success: true });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                yield expect(workos.auditTrail.createEvent(event)).resolves.toBeUndefined();
            }));
        });
        describe('when the api responds with a 401', () => {
            it('throws an UnauthorizedException', () => __awaiter(void 0, void 0, void 0, function* () {
                mock.onPost('/events', serializeEventOptions(event)).replyOnce(401, {
                    message: 'Unauthorized',
                }, { 'X-Request-ID': 'a-request-id' });
                const workos = new workos_1.WorkOS('invalid apikey');
                yield expect(workos.auditTrail.createEvent(event)).rejects.toStrictEqual(new exceptions_1.UnauthorizedException('a-request-id'));
            }));
        });
        describe('when the api responds with a 422', () => {
            it('throws an UnprocessableEntity', () => __awaiter(void 0, void 0, void 0, function* () {
                const errors = [
                    {
                        field: 'target_id',
                        code: 'target_id must be a string',
                    },
                    {
                        field: 'occurred_at',
                        code: 'occurred_at must be an ISO 8601 date string',
                    },
                ];
                mock.onPost('/events', serializeEventOptions(event)).replyOnce(422, {
                    message: 'Validation failed',
                    errors,
                }, { 'X-Request-ID': 'a-request-id' });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                yield expect(workos.auditTrail.createEvent(event)).rejects.toMatchSnapshot();
            }));
        });
    });
    describe('listEvents', () => {
        describe('With no filters', () => {
            it('Returns all events', () => __awaiter(void 0, void 0, void 0, function* () {
                mock.onGet('/events').replyOnce(200, {
                    data: [
                        {
                            object: 'event',
                            id: 'evt_0',
                            group: 'foo-corp.com',
                            latitude: null,
                            longitude: null,
                            location: '::1',
                            type: 'r',
                            actor_name: 'demo@foo-corp.com',
                            actor_id: 'user_0',
                            target_name: 'http_request',
                            target_id: '',
                            metadata: {},
                            occurred_at: new Date(),
                            action: {
                                object: 'event_action',
                                id: 'evt_action_0',
                                name: 'user.searched_directories',
                            },
                        },
                        {
                            object: 'event',
                            id: 'evt_1',
                            group: 'workos.com',
                            location: '::1',
                            latitude: null,
                            longitude: null,
                            type: 'r',
                            actor_name: 'foo@example.com',
                            actor_id: 'user_1',
                            target_name: 'api_key_query',
                            target_id: 'key_0',
                            metadata: {
                                description: 'User viewed API key.',
                                x_request_id: '',
                            },
                            occurred_at: new Date('2020-07-31T14:27:00.384Z'),
                            action: {
                                object: 'event_action',
                                id: 'evt_action_1',
                                name: 'user.viewed_api_key',
                                project_id: 'project_0',
                            },
                        },
                    ],
                    list_metadata: { before: null, after: null },
                });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                const events = yield workos.auditTrail.listEvents();
                expect(events.data).toHaveLength(2);
            }));
        });
        describe('With a filter', () => {
            it('Returns events that match the filter', () => __awaiter(void 0, void 0, void 0, function* () {
                mock
                    .onGet('/events', {
                    action: ['user.searched_directories'],
                })
                    .replyOnce(200, {
                    data: [
                        {
                            object: 'event',
                            id: 'evt_0',
                            group: 'foo-corp.com',
                            latitude: null,
                            longitude: null,
                            location: '::1',
                            type: 'r',
                            actor_name: 'demo@foo-corp.com',
                            actor_id: 'user_0',
                            target_name: 'http_request',
                            target_id: '',
                            metadata: {},
                            occurred_at: new Date(),
                            action: {
                                object: 'event_action',
                                id: 'evt_action_0',
                                name: 'user.searched_directories',
                            },
                        },
                    ],
                    list_metadata: { before: null, after: null },
                });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                const events = yield workos.auditTrail.listEvents({
                    action: ['user.searched_directories'],
                });
                expect(events.data).toHaveLength(1);
                expect(events.data[0].action.name).toEqual('user.searched_directories');
            }));
        });
    });
});
