import { Config, DestinationContext as Context, DestinationPlugin, Event, InvalidResponse, PayloadTooLargeResponse, PluginType, RateLimitResponse, Response, Result, SuccessResponse } from '@amplitude/analytics-types';
export declare class Destination implements DestinationPlugin {
    name: string;
    type: PluginType.DESTINATION;
    retryTimeout: number;
    throttleTimeout: number;
    storageKey: string;
    config: Config;
    private scheduled;
    queue: Context[];
    setup(config: Config): Promise<undefined>;
    execute(event: Event): Promise<Result>;
    addToQueue(...list: Context[]): void;
    schedule(timeout: number): void;
    flush(useRetry?: boolean): Promise<void>;
    send(list: Context[], useRetry?: boolean): Promise<void>;
    handleReponse(res: Response, list: Context[]): void;
    handleSuccessResponse(res: SuccessResponse, list: Context[]): void;
    handleInvalidResponse(res: InvalidResponse, list: Context[]): void;
    handlePayloadTooLargeResponse(res: PayloadTooLargeResponse, list: Context[]): void;
    handleRateLimitResponse(res: RateLimitResponse, list: Context[]): void;
    handleOtherReponse(list: Context[]): void;
    fulfillRequest(list: Context[], code: number, message: string): void;
    /**
     * Saves events to storage
     * This is called on
     * 1) new events are added to queue; or
     * 2) response comes back for a request
     */
    saveEvents(): void;
}
//# sourceMappingURL=destination.d.ts.map