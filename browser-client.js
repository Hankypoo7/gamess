Object.defineProperty(exports, "__esModule", { value: true });
exports.createInstance = exports.AmplitudeBrowser = void 0;
var tslib_1 = require("tslib");
var analytics_core_1 = require("@amplitude/analytics-core");
var analytics_client_common_1 = require("@amplitude/analytics-client-common");
var snippet_helper_1 = require("./utils/snippet-helper");
var context_1 = require("./plugins/context");
var config_1 = require("./config");
var cookie_migration_1 = require("./cookie-migration");
var AmplitudeBrowser = /** @class */ (function (_super) {
    tslib_1.__extends(AmplitudeBrowser, _super);
    function AmplitudeBrowser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AmplitudeBrowser.prototype.init = function (apiKey, userId, options) {
        var _a, _b, _c;
        if (apiKey === void 0) { apiKey = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var oldCookies, browserOptions, isNewSession, connector;
            var _this = this;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // Step 0: Block concurrent initialization
                        if (this.initializing) {
                            return [2 /*return*/];
                        }
                        this.initializing = true;
                        return [4 /*yield*/, (0, cookie_migration_1.parseOldCookies)(apiKey, options)];
                    case 1:
                        oldCookies = _d.sent();
                        return [4 /*yield*/, (0, config_1.useBrowserConfig)(apiKey, userId || oldCookies.userId, tslib_1.__assign(tslib_1.__assign({}, options), { deviceId: (_a = oldCookies.deviceId) !== null && _a !== void 0 ? _a : options === null || options === void 0 ? void 0 : options.deviceId, sessionId: (_b = oldCookies.sessionId) !== null && _b !== void 0 ? _b : options === null || options === void 0 ? void 0 : options.sessionId, optOut: (_c = options === null || options === void 0 ? void 0 : options.optOut) !== null && _c !== void 0 ? _c : oldCookies.optOut, lastEventTime: oldCookies.lastEventTime }))];
                    case 2:
                        browserOptions = _d.sent();
                        return [4 /*yield*/, _super.prototype._init.call(this, browserOptions)];
                    case 3:
                        _d.sent();
                        isNewSession = !this.config.lastEventTime;
                        if (!this.config.sessionId ||
                            (this.config.lastEventTime && Date.now() - this.config.lastEventTime > this.config.sessionTimeout)) {
                            // Either
                            // 1) No previous session; or
                            // 2) Previous session expired
                            this.setSessionId(Date.now());
                            isNewSession = true;
                        }
                        connector = (0, analytics_client_common_1.getAnalyticsConnector)();
                        connector.eventBridge.setEventReceiver(function (event) {
                            void _this.track(event.eventType, event.eventProperties);
                        });
                        connector.identityStore.setIdentity({
                            userId: this.config.userId,
                            deviceId: this.config.deviceId,
                        });
                        // Step 4: Install plugins
                        // Do not track any events before this
                        return [4 /*yield*/, this.add(new context_1.Context())];
                    case 4:
                        // Step 4: Install plugins
                        // Do not track any events before this
                        _d.sent();
                        return [4 /*yield*/, this.add(new analytics_client_common_1.IdentityEventSender())];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, this.add(new analytics_core_1.Destination())];
                    case 6:
                        _d.sent();
                        this.initializing = false;
                        // Step 5: Track attributions
                        return [4 /*yield*/, this.runAttributionStrategy(browserOptions.attribution, isNewSession)];
                    case 7:
                        // Step 5: Track attributions
                        _d.sent();
                        // Step 6: Run queued dispatch functions
                        return [4 /*yield*/, this.runQueuedFunctions('dispatchQ')];
                    case 8:
                        // Step 6: Run queued dispatch functions
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmplitudeBrowser.prototype.runAttributionStrategy = function (attributionConfig, isNewSession) {
        if (isNewSession === void 0) { isNewSession = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var track, onNewCampaign, storage, campaignTracker;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        track = this.track.bind(this);
                        onNewCampaign = this.setSessionId.bind(this, Date.now());
                        return [4 /*yield*/, (0, config_1.createFlexibleStorage)(this.config)];
                    case 1:
                        storage = _a.sent();
                        campaignTracker = new analytics_client_common_1.CampaignTracker(this.config.apiKey, tslib_1.__assign(tslib_1.__assign({}, attributionConfig), { storage: storage, track: track, onNewCampaign: onNewCampaign }));
                        return [4 /*yield*/, campaignTracker.send(isNewSession)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmplitudeBrowser.prototype.getUserId = function () {
        var _a;
        return (_a = this.config) === null || _a === void 0 ? void 0 : _a.userId;
    };
    AmplitudeBrowser.prototype.setUserId = function (userId) {
        if (!this.config) {
            this.q.push(this.setUserId.bind(this, userId));
            return;
        }
        this.config.userId = userId;
    };
    AmplitudeBrowser.prototype.getDeviceId = function () {
        var _a;
        return (_a = this.config) === null || _a === void 0 ? void 0 : _a.deviceId;
    };
    AmplitudeBrowser.prototype.setDeviceId = function (deviceId) {
        if (!this.config) {
            this.q.push(this.setDeviceId.bind(this, deviceId));
            return;
        }
        this.config.deviceId = deviceId;
    };
    AmplitudeBrowser.prototype.reset = function () {
        this.setUserId(undefined);
        this.setDeviceId((0, analytics_core_1.UUID)());
    };
    AmplitudeBrowser.prototype.getSessionId = function () {
        var _a;
        return (_a = this.config) === null || _a === void 0 ? void 0 : _a.sessionId;
    };
    AmplitudeBrowser.prototype.setSessionId = function (sessionId) {
        if (!this.config) {
            this.q.push(this.setSessionId.bind(this, sessionId));
            return;
        }
        this.config.sessionId = sessionId;
        this.config.lastEventTime = undefined;
    };
    AmplitudeBrowser.prototype.setTransport = function (transport) {
        if (!this.config) {
            this.q.push(this.setTransport.bind(this, transport));
            return;
        }
        this.config.transportProvider = (0, config_1.createTransport)(transport);
    };
    AmplitudeBrowser.prototype.identify = function (identify, eventOptions) {
        if ((0, snippet_helper_1.isInstanceProxy)(identify)) {
            var queue = identify._q;
            identify._q = [];
            identify = (0, snippet_helper_1.convertProxyObjectToRealObject)(new analytics_core_1.Identify(), queue);
        }
        if (eventOptions === null || eventOptions === void 0 ? void 0 : eventOptions.user_id) {
            this.setUserId(eventOptions.user_id);
        }
        if (eventOptions === null || eventOptions === void 0 ? void 0 : eventOptions.device_id) {
            this.setDeviceId(eventOptions.device_id);
        }
        return _super.prototype.identify.call(this, identify, eventOptions);
    };
    AmplitudeBrowser.prototype.groupIdentify = function (groupType, groupName, identify, eventOptions) {
        if ((0, snippet_helper_1.isInstanceProxy)(identify)) {
            var queue = identify._q;
            identify._q = [];
            identify = (0, snippet_helper_1.convertProxyObjectToRealObject)(new analytics_core_1.Identify(), queue);
        }
        return _super.prototype.groupIdentify.call(this, groupType, groupName, identify, eventOptions);
    };
    AmplitudeBrowser.prototype.revenue = function (revenue, eventOptions) {
        if ((0, snippet_helper_1.isInstanceProxy)(revenue)) {
            var queue = revenue._q;
            revenue._q = [];
            revenue = (0, snippet_helper_1.convertProxyObjectToRealObject)(new analytics_core_1.Revenue(), queue);
        }
        return _super.prototype.revenue.call(this, revenue, eventOptions);
    };
    return AmplitudeBrowser;
}(analytics_core_1.AmplitudeCore));
exports.AmplitudeBrowser = AmplitudeBrowser;
var createInstance = function () {
    var client = new AmplitudeBrowser();
    return {
        init: (0, analytics_core_1.debugWrapper)((0, analytics_core_1.returnWrapper)(client.init.bind(client)), 'init', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config'])),
        add: (0, analytics_core_1.debugWrapper)((0, analytics_core_1.returnWrapper)(client.add.bind(client)), 'add', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config.apiKey', 'timeline.plugins'])),
        remove: (0, analytics_core_1.debugWrapper)((0, analytics_core_1.returnWrapper)(client.remove.bind(client)), 'remove', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config.apiKey', 'timeline.plugins'])),
        track: (0, analytics_core_1.debugWrapper)((0, analytics_core_1.returnWrapper)(client.track.bind(client)), 'track', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config.apiKey', 'timeline.queue.length'])),
        logEvent: (0, analytics_core_1.debugWrapper)((0, analytics_core_1.returnWrapper)(client.logEvent.bind(client)), 'logEvent', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config.apiKey', 'timeline.queue.length'])),
        identify: (0, analytics_core_1.debugWrapper)((0, analytics_core_1.returnWrapper)(client.identify.bind(client)), 'identify', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config.apiKey', 'timeline.queue.length'])),
        groupIdentify: (0, analytics_core_1.debugWrapper)((0, analytics_core_1.returnWrapper)(client.groupIdentify.bind(client)), 'groupIdentify', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config.apiKey', 'timeline.queue.length'])),
        setGroup: (0, analytics_core_1.debugWrapper)((0, analytics_core_1.returnWrapper)(client.setGroup.bind(client)), 'setGroup', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config.apiKey', 'timeline.queue.length'])),
        revenue: (0, analytics_core_1.debugWrapper)((0, analytics_core_1.returnWrapper)(client.revenue.bind(client)), 'revenue', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config.apiKey', 'timeline.queue.length'])),
        flush: (0, analytics_core_1.debugWrapper)((0, analytics_core_1.returnWrapper)(client.flush.bind(client)), 'flush', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config.apiKey', 'timeline.queue.length'])),
        getUserId: (0, analytics_core_1.debugWrapper)(client.getUserId.bind(client), 'getUserId', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config', 'config.userId'])),
        setUserId: (0, analytics_core_1.debugWrapper)(client.setUserId.bind(client), 'setUserId', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config', 'config.userId'])),
        getDeviceId: (0, analytics_core_1.debugWrapper)(client.getDeviceId.bind(client), 'getDeviceId', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config', 'config.deviceId'])),
        setDeviceId: (0, analytics_core_1.debugWrapper)(client.setDeviceId.bind(client), 'setDeviceId', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config', 'config.deviceId'])),
        reset: (0, analytics_core_1.debugWrapper)(client.reset.bind(client), 'reset', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config', 'config.userId', 'config.deviceId'])),
        getSessionId: (0, analytics_core_1.debugWrapper)(client.getSessionId.bind(client), 'getSessionId', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config'])),
        setSessionId: (0, analytics_core_1.debugWrapper)(client.setSessionId.bind(client), 'setSessionId', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config'])),
        setOptOut: (0, analytics_core_1.debugWrapper)(client.setOptOut.bind(client), 'setOptOut', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config'])),
        setTransport: (0, analytics_core_1.debugWrapper)(client.setTransport.bind(client), 'setTransport', (0, analytics_core_1.getClientLogConfig)(client), (0, analytics_core_1.getClientStates)(client, ['config'])),
    };
};
exports.createInstance = createInstance;
exports.default = (0, exports.createInstance)();
//# sourceMappingURL=browser-client.js.map