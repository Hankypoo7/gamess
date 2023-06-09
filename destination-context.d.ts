import { Event } from './event';
import { EventCallback } from './event-callback';
export interface DestinationContext {
    event: Event;
    attempts: number;
    callback: EventCallback;
    timeout: number;
}
//# sourceMappingURL=destination-context.d.ts.map