import { UserSession, Storage, SessionManager as ISessionManager } from '@amplitude/analytics-types';
export declare class SessionManager implements ISessionManager {
    private storage;
    storageKey: string;
    cache: UserSession;
    constructor(storage: Storage<UserSession>, apiKey: string);
    /**
     * load() must be called immediately after instantation
     *
     * ```ts
     * await new SessionManager(...).load();
     * ```
     */
    load(): Promise<this>;
    setSession(session: Partial<UserSession>): void;
    getSessionId(): number | undefined;
    setSessionId(sessionId: number): void;
    getDeviceId(): string | undefined;
    setDeviceId(deviceId: string): void;
    getUserId(): string | undefined;
    setUserId(userId: string): void;
    getLastEventTime(): number | undefined;
    setLastEventTime(lastEventTime: number): void;
    getOptOut(): boolean;
    setOptOut(optOut: boolean): void;
    getLastEventId(): number | undefined;
    setLastEventId(lastEventId: number): void;
}
//# sourceMappingURL=session-manager.d.ts.map