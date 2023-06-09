Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
var tslib_1 = require("tslib");
var cookie_name_1 = require("./cookie-name");
var SessionManager = /** @class */ (function () {
    function SessionManager(storage, apiKey) {
        this.storage = storage;
        this.storageKey = (0, cookie_name_1.getCookieName)(apiKey);
        this.cache = { optOut: false };
    }
    /**
     * load() must be called immediately after instantation
     *
     * ```ts
     * await new SessionManager(...).load();
     * ```
     */
    SessionManager.prototype.load = function () {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = this;
                        return [4 /*yield*/, this.storage.get(this.storageKey)];
                    case 1:
                        _b.cache = (_a = (_c.sent())) !== null && _a !== void 0 ? _a : {
                            optOut: false,
                        };
                        return [2 /*return*/, this];
                }
            });
        });
    };
    SessionManager.prototype.setSession = function (session) {
        this.cache = tslib_1.__assign(tslib_1.__assign({}, this.cache), session);
        void this.storage.set(this.storageKey, this.cache);
    };
    SessionManager.prototype.getSessionId = function () {
        return this.cache.sessionId;
    };
    SessionManager.prototype.setSessionId = function (sessionId) {
        this.setSession({ sessionId: sessionId });
    };
    SessionManager.prototype.getDeviceId = function () {
        return this.cache.deviceId;
    };
    SessionManager.prototype.setDeviceId = function (deviceId) {
        this.setSession({ deviceId: deviceId });
    };
    SessionManager.prototype.getUserId = function () {
        return this.cache.userId;
    };
    SessionManager.prototype.setUserId = function (userId) {
        this.setSession({ userId: userId });
    };
    SessionManager.prototype.getLastEventTime = function () {
        return this.cache.lastEventTime;
    };
    SessionManager.prototype.setLastEventTime = function (lastEventTime) {
        this.setSession({ lastEventTime: lastEventTime });
    };
    SessionManager.prototype.getOptOut = function () {
        return this.cache.optOut;
    };
    SessionManager.prototype.setOptOut = function (optOut) {
        this.setSession({ optOut: optOut });
    };
    SessionManager.prototype.getLastEventId = function () {
        return this.cache.lastEventId;
    };
    SessionManager.prototype.setLastEventId = function (lastEventId) {
        this.setSession({ lastEventId: lastEventId });
    };
    return SessionManager;
}());
exports.SessionManager = SessionManager;
//# sourceMappingURL=session-manager.js.map