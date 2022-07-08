import { CreateEventOptions } from './interfaces/create-event-options.interface';
import { Event } from './interfaces/event.interface';
import { EventOptions } from './interfaces/event-options.interface';
import { List } from '../common/interfaces/list.interface';
import { ListEventsOptions } from './interfaces/list-events-options.interface';
import { WorkOS } from '../workos';
export declare class AuditTrail {
    private readonly workos;
    constructor(workos: WorkOS);
    createEvent(event: EventOptions, { idempotencyKey }?: CreateEventOptions): Promise<void>;
    listEvents(options?: ListEventsOptions): Promise<List<Event>>;
}
