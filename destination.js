Object.defineProperty(exports, "__esModule", { value: true });
exports.Destination = void 0;
var tslib_1 = require("tslib");
var analytics_types_1 = require("@amplitude/analytics-types");
var messages_1 = require("../messages");
var constants_1 = require("../constants");
var chunk_1 = require("../utils/chunk");
var result_builder_1 = require("../utils/result-builder");
var config_1 = require("../config");
var Destination = /** @class */ (function () {
    function Destination() {
        this.name = 'amplitude';
        this.type = analytics_types_1.PluginType.DESTINATION;
        this.retryTimeout = 1000;
        this.throttleTimeout = 30000;
        this.storageKey = '';
        this.scheduled = null;
        this.queue = [];
    }
    Destination.prototype.setup = function (config) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var unsent;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.config = config;
                        this.storageKey = "".concat(constants_1.STORAGE_PREFIX, "_").concat(this.config.apiKey.substring(0, 10));
                        return [4 /*yield*/, ((_a = this.config.storageProvider) === null || _a === void 0 ? void 0 : _a.get(this.storageKey))];
                    case 1:
                        unsent = _b.sent();
                        this.saveEvents(); // sets storage to '[]'
                        if (unsent && unsent.length > 0) {
                            void Promise.all(unsent.map(function (event) { return _this.execute(event); })).catch();
                        }
                        return [2 /*return*/, Promise.resolve(undefined)];
                }
            });
        });
    };
    Destination.prototype.execute = function (event) {
        var _this = this;
        return new Promise(function (resolve) {
            var context = {
                event: event,
                attempts: 0,
                callback: function (result) { return resolve(result); },
                timeout: 0,
            };
            void _this.addToQueue(context);
        });
    };
    Destination.prototype.addToQueue = function () {
        var _this = this;
        var list = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            list[_i] = arguments[_i];
        }
        var tryable = list.filter(function (context) {
            if (context.attempts < _this.config.flushMaxRetries) {
                context.attempts += 1;
                return true;
            }
            void _this.fulfillRequest([context], 500, messages_1.MAX_RETRIES_EXCEEDED_MESSAGE);
            return false;
        });
        tryable.forEach(function (context) {
            _this.queue = _this.queue.concat(context);
            if (context.timeout === 0) {
                _this.schedule(_this.config.flushIntervalMillis);
                return;
            }
            setTimeout(function () {
                context.timeout = 0;
                _this.schedule(0);
            }, context.timeout);
        });
        this.saveEvents();
    };
    Destination.prototype.schedule = function (timeout) {
        var _this = this;
        if (this.scheduled)
            return;
        this.scheduled = setTimeout(function () {
            void _this.flush(true).then(function () {
                if (_this.queue.length > 0) {
                    _this.schedule(timeout);
                }
            });
        }, timeout);
    };
    Destination.prototype.flush = function (useRetry) {
        if (useRetry === void 0) { useRetry = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var list, later, batches;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        list = [];
                        later = [];
                        this.queue.forEach(function (context) { return (context.timeout === 0 ? list.push(context) : later.push(context)); });
                        this.queue = later;
                        if (this.scheduled) {
                            clearTimeout(this.scheduled);
                            this.scheduled = null;
                        }
                        batches = (0, chunk_1.chunk)(list, this.config.flushQueueSize);
                        return [4 /*yield*/, Promise.all(batches.map(function (batch) { return _this.send(batch, useRetry); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Destination.prototype.send = function (list, useRetry) {
        if (useRetry === void 0) { useRetry = true; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var payload, serverUrl, res, responseBody, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.apiKey) {
                            return [2 /*return*/, this.fulfillRequest(list, 400, messages_1.MISSING_API_KEY_MESSAGE)];
                        }
                        payload = {
                            api_key: this.config.apiKey,
                            events: list.map(function (context) {
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                var _a = context.event, extra = _a.extra, eventWithoutExtra = tslib_1.__rest(_a, ["extra"]);
                                return eventWithoutExtra;
                            }),
                            options: {
                                min_id_length: this.config.minIdLength,
                            },
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        serverUrl = (0, config_1.createServerConfig)(this.config.serverUrl, this.config.serverZone, this.config.useBatch).serverUrl;
                        return [4 /*yield*/, this.config.transportProvider.send(serverUrl, payload)];
                    case 2:
                        res = _a.sent();
                        if (res === null) {
                            this.fulfillRequest(list, 0, messages_1.UNEXPECTED_ERROR_MESSAGE);
                            return [2 /*return*/];
                        }
                        if (!useRetry) {
                            if ('body' in res) {
                                responseBody = '';
                                try {
                                    responseBody = JSON.stringify(res.body, null, 2);
                                }
                                catch (_b) {
                                    // to avoid crash, but don't care about the error, add comment to avoid empty block lint error
                                }
                                this.fulfillRequest(list, res.statusCode, "".concat(res.status, ": ").concat(responseBody));
                            }
                            else {
                                this.fulfillRequest(list, res.statusCode, res.status);
                            }
                            return [2 /*return*/];
                        }
                        this.handleReponse(res, list);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.fulfillRequest(list, 0, String(e_1));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Destination.prototype.handleReponse = function (res, list) {
        var status = res.status;
        switch (status) {
            case analytics_types_1.Status.Success:
                this.handleSuccessResponse(res, list);
                break;
            case analytics_types_1.Status.Invalid:
                this.handleInvalidResponse(res, list);
                break;
            case analytics_types_1.Status.PayloadTooLarge:
                this.handlePayloadTooLargeResponse(res, list);
                break;
            case analytics_types_1.Status.RateLimit:
                this.handleRateLimitResponse(res, list);
                break;
            default:
                this.handleOtherReponse(list);
        }
    };
    Destination.prototype.handleSuccessResponse = function (res, list) {
        this.fulfillRequest(list, res.statusCode, messages_1.SUCCESS_MESSAGE);
    };
    Destination.prototype.handleInvalidResponse = function (res, list) {
        var _this = this;
        if (res.body.missingField || res.body.error.startsWith(messages_1.INVALID_API_KEY)) {
            this.fulfillRequest(list, res.statusCode, res.body.error);
            return;
        }
        var dropIndex = tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(Object.values(res.body.eventsWithInvalidFields)), false), tslib_1.__read(Object.values(res.body.eventsWithMissingFields)), false), tslib_1.__read(Object.values(res.body.eventsWithInvalidIdLengths)), false), tslib_1.__read(res.body.silencedEvents), false).flat();
        var dropIndexSet = new Set(dropIndex);
        var retry = list.filter(function (context, index) {
            if (dropIndexSet.has(index)) {
                _this.fulfillRequest([context], res.statusCode, res.body.error);
                return;
            }
            return true;
        });
        this.addToQueue.apply(this, tslib_1.__spreadArray([], tslib_1.__read(retry), false));
    };
    Destination.prototype.handlePayloadTooLargeResponse = function (res, list) {
        if (list.length === 1) {
            this.fulfillRequest(list, res.statusCode, res.body.error);
            return;
        }
        this.config.flushQueueSize /= 2;
        this.addToQueue.apply(this, tslib_1.__spreadArray([], tslib_1.__read(list), false));
    };
    Destination.prototype.handleRateLimitResponse = function (res, list) {
        var _this = this;
        var dropUserIds = Object.keys(res.body.exceededDailyQuotaUsers);
        var dropDeviceIds = Object.keys(res.body.exceededDailyQuotaDevices);
        var throttledIndex = res.body.throttledEvents;
        var dropUserIdsSet = new Set(dropUserIds);
        var dropDeviceIdsSet = new Set(dropDeviceIds);
        var throttledIndexSet = new Set(throttledIndex);
        var retry = list.filter(function (context, index) {
            if ((context.event.user_id && dropUserIdsSet.has(context.event.user_id)) ||
                (context.event.device_id && dropDeviceIdsSet.has(context.event.device_id))) {
                _this.fulfillRequest([context], res.statusCode, res.body.error);
                return;
            }
            if (throttledIndexSet.has(index)) {
                context.timeout = _this.throttleTimeout;
            }
            return true;
        });
        this.addToQueue.apply(this, tslib_1.__spreadArray([], tslib_1.__read(retry), false));
    };
    Destination.prototype.handleOtherReponse = function (list) {
        var _this = this;
        this.addToQueue.apply(this, tslib_1.__spreadArray([], tslib_1.__read(list.map(function (context) {
            context.timeout = context.attempts * _this.retryTimeout;
            return context;
        })), false));
    };
    Destination.prototype.fulfillRequest = function (list, code, message) {
        this.saveEvents();
        list.forEach(function (context) { return context.callback((0, result_builder_1.buildResult)(context.event, code, message)); });
    };
    /**
     * Saves events to storage
     * This is called on
     * 1) new events are added to queue; or
     * 2) response comes back for a request
     */
    Destination.prototype.saveEvents = function () {
        if (!this.config.storageProvider) {
            return;
        }
        var events = Array.from(this.queue.map(function (context) { return context.event; }));
        void this.config.storageProvider.set(this.storageKey, events);
    };
    return Destination;
}());
exports.Destination = Destination;
//# sourceMappingURL=destination.js.map