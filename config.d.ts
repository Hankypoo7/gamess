import { AttributionOptions, Event, BrowserOptions, BrowserConfig as IBrowserConfig, Storage, TrackingOptions, TransportType, UserSession, SessionManager as ISessionManager } from '@amplitude/analytics-types';
import { Config, MemoryStorage } from '@amplitude/analytics-core';
import { SessionManager, FetchTransport } from '@amplitude/analytics-client-common';
import { XHRTransport } from './transports/xhr';
import { SendBeaconTransport } from './transports/send-beacon';
export declare const getDefaultConfig: () => {
    cookieExpiration: number;
    cookieSameSite: string;
    cookieSecure: boolean;
    cookieStorage: MemoryStorage<UserSession>;
    cookieUpgrade: boolean;
    disableCookies: boolean;
    domain: string;
    sessionManager: SessionManager;
    sessionTimeout: number;
    storageProvider: MemoryStorage<Event[]>;
    trackingOptions: Required<TrackingOptions>;
    transportProvider: FetchTransport;
};
export declare class BrowserConfig extends Config implements IBrowserConfig {
    appVersion?: string;
    attribution?: AttributionOptions;
    cookieExpiration: number;
    cookieSameSite: string;
    cookieSecure: boolean;
    cookieUpgrade: boolean;
    cookieStorage: Storage<UserSession>;
    disableCookies: boolean;
    domain: string;
    partnerId?: string;
    sessionTimeout: number;
    trackingOptions: TrackingOptions;
    sessionManager: ISessionManager;
    constructor(apiKey: string, userId?: string, options?: BrowserOptions);
    get deviceId(): string | undefined;
    set deviceId(deviceId: string | undefined);
    get userId(): string | undefined;
    set userId(userId: string | undefined);
    get sessionId(): number | undefined;
    set sessionId(sessionId: number | undefined);
    get optOut(): boolean;
    set optOut(optOut: boolean);
    get lastEventTime(): number | undefined;
    set lastEventTime(lastEventTime: number | undefined);
}
export declare const useBrowserConfig: (apiKey: string, userId?: string, options?: BrowserOptions) => Promise<IBrowserConfig>;
export declare const createCookieStorage: (overrides?: BrowserOptions, baseConfig?: {
    cookieExpiration: number;
    cookieSameSite: string;
    cookieSecure: boolean;
    cookieStorage: MemoryStorage<UserSession>;
    cookieUpgrade: boolean;
    disableCookies: boolean;
    domain: string;
    sessionManager: SessionManager;
    sessionTimeout: number;
    storageProvider: MemoryStorage<Event[]>;
    trackingOptions: Required<TrackingOptions>;
    transportProvider: FetchTransport;
}) => Promise<Storage<UserSession>>;
export declare const createFlexibleStorage: <T>(options: BrowserOptions) => Promise<Storage<T>>;
export declare const createEventsStorage: (overrides?: BrowserOptions) => Promise<Storage<Event[]> | undefined>;
export declare const createDeviceId: (idFromCookies?: string, idFromOptions?: string, idFromQueryParams?: string) => string;
export declare const createTransport: (transport?: TransportType) => XHRTransport | SendBeaconTransport | FetchTransport;
export declare const getTopLevelDomain: (url?: string) => Promise<string>;
//# sourceMappingURL=config.d.ts.map