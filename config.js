var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopLevelDomain = exports.createTransport = exports.createDeviceId = exports.createEventsStorage = exports.createFlexibleStorage = exports.createCookieStorage = exports.useBrowserConfig = exports.BrowserConfig = exports.getDefaultConfig = void 0;
var tslib_1 = require("tslib");
var analytics_types_1 = require("@amplitude/analytics-types");
var analytics_core_1 = require("@amplitude/analytics-core");
var analytics_client_common_1 = require("@amplitude/analytics-client-common");
var local_storage_1 = require("./storage/local-storage");
var xhr_1 = require("./transports/xhr");
var send_beacon_1 = require("./transports/send-beacon");
var getDefaultConfig = function () {
    var cookieStorage = new analytics_core_1.MemoryStorage();
    var trackingOptions = {
        deviceManufacturer: true,
        deviceModel: true,
        ipAddress: true,
        language: true,
        osName: true,
        osVersion: true,
        platform: true,
    };
    return {
        cookieExpiration: 365,
        cookieSameSite: 'Lax',
        cookieSecure: false,
        cookieStorage: cookieStorage,
        cookieUpgrade: true,
        disableCookies: false,
        domain: '',
        sessionManager: new analytics_client_common_1.SessionManager(cookieStorage, ''),
        sessionTimeout: 30 * 60 * 1000,
        storageProvider: new analytics_core_1.MemoryStorage(),
        trackingOptions: trackingOptions,
        transportProvider: new analytics_client_common_1.FetchTransport(),
    };
};
exports.getDefaultConfig = getDefaultConfig;
var BrowserConfig = /** @class */ (function (_super) {
    tslib_1.__extends(BrowserConfig, _super);
    function BrowserConfig(apiKey, userId, options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        var defaultConfig = (0, exports.getDefaultConfig)();
        _this = _super.call(this, tslib_1.__assign(tslib_1.__assign({ flushIntervalMillis: 1000, flushMaxRetries: 5, flushQueueSize: 30 }, options), { apiKey: apiKey, storageProvider: (_a = options === null || options === void 0 ? void 0 : options.storageProvider) !== null && _a !== void 0 ? _a : defaultConfig.storageProvider, transportProvider: (_b = options === null || options === void 0 ? void 0 : options.transportProvider) !== null && _b !== void 0 ? _b : defaultConfig.transportProvider })) || this;
        _this.cookieStorage = (_c = options === null || options === void 0 ? void 0 : options.cookieStorage) !== null && _c !== void 0 ? _c : defaultConfig.cookieStorage;
        _this.sessionManager = (_d = options === null || options === void 0 ? void 0 : options.sessionManager) !== null && _d !== void 0 ? _d : defaultConfig.sessionManager;
        _this.sessionTimeout = (_e = options === null || options === void 0 ? void 0 : options.sessionTimeout) !== null && _e !== void 0 ? _e : defaultConfig.sessionTimeout;
        _this.appVersion = options === null || options === void 0 ? void 0 : options.appVersion;
        _this.attribution = options === null || options === void 0 ? void 0 : options.attribution;
        _this.cookieExpiration = (_f = options === null || options === void 0 ? void 0 : options.cookieExpiration) !== null && _f !== void 0 ? _f : defaultConfig.cookieExpiration;
        _this.cookieSameSite = (_g = options === null || options === void 0 ? void 0 : options.cookieSameSite) !== null && _g !== void 0 ? _g : defaultConfig.cookieSameSite;
        _this.cookieSecure = (_h = options === null || options === void 0 ? void 0 : options.cookieSecure) !== null && _h !== void 0 ? _h : defaultConfig.cookieSecure;
        _this.cookieUpgrade = (_j = options === null || options === void 0 ? void 0 : options.cookieUpgrade) !== null && _j !== void 0 ? _j : defaultConfig.cookieUpgrade;
        _this.deviceId = options === null || options === void 0 ? void 0 : options.deviceId;
        _this.disableCookies = (_k = options === null || options === void 0 ? void 0 : options.disableCookies) !== null && _k !== void 0 ? _k : defaultConfig.disableCookies;
        _this.domain = (_l = options === null || options === void 0 ? void 0 : options.domain) !== null && _l !== void 0 ? _l : defaultConfig.domain;
        _this.lastEventTime = (_m = _this.lastEventTime) !== null && _m !== void 0 ? _m : options === null || options === void 0 ? void 0 : options.lastEventTime;
        _this.optOut = Boolean(options === null || options === void 0 ? void 0 : options.optOut);
        _this.partnerId = options === null || options === void 0 ? void 0 : options.partnerId;
        _this.sessionId = options === null || options === void 0 ? void 0 : options.sessionId;
        _this.trackingOptions = (_o = options === null || options === void 0 ? void 0 : options.trackingOptions) !== null && _o !== void 0 ? _o : defaultConfig.trackingOptions;
        _this.userId = userId;
        return _this;
    }
    Object.defineProperty(BrowserConfig.prototype, "deviceId", {
        get: function () {
            return this.sessionManager.getDeviceId();
        },
        set: function (deviceId) {
            this.sessionManager.setDeviceId(deviceId);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserConfig.prototype, "userId", {
        get: function () {
            return this.sessionManager.getUserId();
        },
        set: function (userId) {
            this.sessionManager.setUserId(userId);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserConfig.prototype, "sessionId", {
        get: function () {
            return this.sessionManager.getSessionId();
        },
        set: function (sessionId) {
            this.sessionManager.setSessionId(sessionId);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserConfig.prototype, "optOut", {
        get: function () {
            return this.sessionManager.getOptOut();
        },
        set: function (optOut) {
            var _a;
            (_a = this.sessionManager) === null || _a === void 0 ? void 0 : _a.setOptOut(Boolean(optOut));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserConfig.prototype, "lastEventTime", {
        get: function () {
            return this.sessionManager.getLastEventTime();
        },
        set: function (lastEventTime) {
            this.sessionManager.setLastEventTime(lastEventTime);
        },
        enumerable: false,
        configurable: true
    });
    return BrowserConfig;
}(analytics_core_1.Config));
exports.BrowserConfig = BrowserConfig;
var useBrowserConfig = function (apiKey, userId, options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var defaultConfig, domain, _a, cookieStorage, cookieName, cookies, queryParams, sessionManager, _b, _c, _d;
    var _e;
    var _f, _g, _h, _j, _k;
    return tslib_1.__generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                defaultConfig = (0, exports.getDefaultConfig)();
                if (!((_f = options === null || options === void 0 ? void 0 : options.domain) !== null && _f !== void 0)) return [3 /*break*/, 1];
                _a = _f;
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, (0, exports.getTopLevelDomain)()];
            case 2:
                _a = (_l.sent());
                _l.label = 3;
            case 3:
                domain = _a;
                return [4 /*yield*/, (0, exports.createCookieStorage)(tslib_1.__assign(tslib_1.__assign({}, options), { domain: domain }))];
            case 4:
                cookieStorage = _l.sent();
                cookieName = (0, analytics_client_common_1.getCookieName)(apiKey);
                return [4 /*yield*/, cookieStorage.get(cookieName)];
            case 5:
                cookies = _l.sent();
                queryParams = (0, analytics_client_common_1.getQueryParams)();
                return [4 /*yield*/, new analytics_client_common_1.SessionManager(cookieStorage, apiKey).load()];
            case 6:
                sessionManager = _l.sent();
                _b = BrowserConfig.bind;
                _c = [void 0, apiKey, userId !== null && userId !== void 0 ? userId : cookies === null || cookies === void 0 ? void 0 : cookies.userId];
                _d = [tslib_1.__assign({}, options)];
                _e = { cookieStorage: cookieStorage, sessionManager: sessionManager, deviceId: (0, exports.createDeviceId)(cookies === null || cookies === void 0 ? void 0 : cookies.deviceId, options === null || options === void 0 ? void 0 : options.deviceId, queryParams.deviceId), domain: domain, optOut: (_g = options === null || options === void 0 ? void 0 : options.optOut) !== null && _g !== void 0 ? _g : Boolean(cookies === null || cookies === void 0 ? void 0 : cookies.optOut) };
                return [4 /*yield*/, cookieStorage.get(cookieName)];
            case 7:
                _e.sessionId = (_j = (_h = (_l.sent())) === null || _h === void 0 ? void 0 : _h.sessionId) !== null && _j !== void 0 ? _j : options === null || options === void 0 ? void 0 : options.sessionId;
                return [4 /*yield*/, (0, exports.createEventsStorage)(options)];
            case 8: return [2 /*return*/, new (_b.apply(BrowserConfig, _c.concat([tslib_1.__assign.apply(void 0, _d.concat([(_e.storageProvider = _l.sent(), _e.trackingOptions = tslib_1.__assign(tslib_1.__assign({}, defaultConfig.trackingOptions), options === null || options === void 0 ? void 0 : options.trackingOptions), _e.transportProvider = (_k = options === null || options === void 0 ? void 0 : options.transportProvider) !== null && _k !== void 0 ? _k : (0, exports.createTransport)(options === null || options === void 0 ? void 0 : options.transport), _e)]))])))()];
        }
    });
}); };
exports.useBrowserConfig = useBrowserConfig;
var createCookieStorage = function (overrides, baseConfig) {
    if (baseConfig === void 0) { baseConfig = (0, exports.getDefaultConfig)(); }
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var options, cookieStorage, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = tslib_1.__assign(tslib_1.__assign({}, baseConfig), overrides);
                    cookieStorage = overrides === null || overrides === void 0 ? void 0 : overrides.cookieStorage;
                    _a = !cookieStorage;
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, cookieStorage.isEnabled()];
                case 1:
                    _a = !(_b.sent());
                    _b.label = 2;
                case 2:
                    if (_a) {
                        return [2 /*return*/, (0, exports.createFlexibleStorage)(options)];
                    }
                    return [2 /*return*/, cookieStorage];
            }
        });
    });
};
exports.createCookieStorage = createCookieStorage;
var createFlexibleStorage = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var storage, _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                storage = new analytics_client_common_1.CookieStorage({
                    domain: options.domain,
                    expirationDays: options.cookieExpiration,
                    sameSite: options.cookieSameSite,
                    secure: options.cookieSecure,
                });
                _a = options.disableCookies;
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, storage.isEnabled()];
            case 1:
                _a = !(_b.sent());
                _b.label = 2;
            case 2:
                if (!_a) return [3 /*break*/, 4];
                storage = new local_storage_1.LocalStorage();
                return [4 /*yield*/, storage.isEnabled()];
            case 3:
                if (!(_b.sent())) {
                    storage = new analytics_core_1.MemoryStorage();
                }
                _b.label = 4;
            case 4: return [2 /*return*/, storage];
        }
    });
}); };
exports.createFlexibleStorage = createFlexibleStorage;
var createEventsStorage = function (overrides) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var hasStorageProviderProperty, _a, _b, storage, _c, e_1_1;
    var e_1, _d;
    return tslib_1.__generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                hasStorageProviderProperty = overrides && Object.prototype.hasOwnProperty.call(overrides, 'storageProvider');
                if (!(!hasStorageProviderProperty || overrides.storageProvider)) return [3 /*break*/, 9];
                _e.label = 1;
            case 1:
                _e.trys.push([1, 7, 8, 9]);
                _a = tslib_1.__values([overrides === null || overrides === void 0 ? void 0 : overrides.storageProvider, new local_storage_1.LocalStorage()]), _b = _a.next();
                _e.label = 2;
            case 2:
                if (!!_b.done) return [3 /*break*/, 6];
                storage = _b.value;
                _c = storage;
                if (!_c) return [3 /*break*/, 4];
                return [4 /*yield*/, storage.isEnabled()];
            case 3:
                _c = (_e.sent());
                _e.label = 4;
            case 4:
                if (_c) {
                    return [2 /*return*/, storage];
                }
                _e.label = 5;
            case 5:
                _b = _a.next();
                return [3 /*break*/, 2];
            case 6: return [3 /*break*/, 9];
            case 7:
                e_1_1 = _e.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 9];
            case 8:
                try {
                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 9: return [2 /*return*/, undefined];
        }
    });
}); };
exports.createEventsStorage = createEventsStorage;
var createDeviceId = function (idFromCookies, idFromOptions, idFromQueryParams) {
    return idFromOptions || idFromQueryParams || idFromCookies || (0, analytics_core_1.UUID)();
};
exports.createDeviceId = createDeviceId;
var createTransport = function (transport) {
    if (transport === analytics_types_1.TransportType.XHR) {
        return new xhr_1.XHRTransport();
    }
    if (transport === analytics_types_1.TransportType.SendBeacon) {
        return new send_beacon_1.SendBeaconTransport();
    }
    return (0, exports.getDefaultConfig)().transportProvider;
};
exports.createTransport = createTransport;
var getTopLevelDomain = function (url) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var host, parts, levels, storageKey, i, i, domain, options, storage, value;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new analytics_client_common_1.CookieStorage().isEnabled()];
            case 1:
                if (!(_a.sent()) || (!url && typeof location === 'undefined')) {
                    return [2 /*return*/, ''];
                }
                host = url !== null && url !== void 0 ? url : location.hostname;
                parts = host.split('.');
                levels = [];
                storageKey = 'AMP_TLDTEST';
                for (i = parts.length - 2; i >= 0; --i) {
                    levels.push(parts.slice(i).join('.'));
                }
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < levels.length)) return [3 /*break*/, 7];
                domain = levels[i];
                options = { domain: '.' + domain };
                storage = new analytics_client_common_1.CookieStorage(options);
                return [4 /*yield*/, storage.set(storageKey, 1)];
            case 3:
                _a.sent();
                return [4 /*yield*/, storage.get(storageKey)];
            case 4:
                value = _a.sent();
                if (!value) return [3 /*break*/, 6];
                return [4 /*yield*/, storage.remove(storageKey)];
            case 5:
                _a.sent();
                return [2 /*return*/, '.' + domain];
            case 6:
                i++;
                return [3 /*break*/, 2];
            case 7: return [2 /*return*/, ''];
        }
    });
}); };
exports.getTopLevelDomain = getTopLevelDomain;
//# sourceMappingURL=config.js.map