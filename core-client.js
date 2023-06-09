Object.defineProperty(exports, "__esModule", { value: true });
exports.AmplitudeCore = void 0;
var tslib_1 = require("tslib");
var event_builder_1 = require("./utils/event-builder");
var timeline_1 = require("./timeline");
var result_builder_1 = require("./utils/result-builder");
var messages_1 = require("./messages");
var AmplitudeCore = /** @class */ (function () {
    function AmplitudeCore(name) {
        if (name === void 0) { name = '$default'; }
        this.initializing = false;
        this.q = [];
        this.dispatchQ = [];
        this.logEvent = this.track.bind(this);
        this.timeline = new timeline_1.Timeline();
        this.name = name;
    }
    AmplitudeCore.prototype._init = function (config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.config = config;
                        this.timeline.reset();
                        return [4 /*yield*/, this.runQueuedFunctions('q')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmplitudeCore.prototype.runQueuedFunctions = function (queueName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var queuedFunctions, queuedFunctions_1, queuedFunctions_1_1, queuedFunction, e_1_1;
            var e_1, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        queuedFunctions = this[queueName];
                        this[queueName] = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        queuedFunctions_1 = tslib_1.__values(queuedFunctions), queuedFunctions_1_1 = queuedFunctions_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!queuedFunctions_1_1.done) return [3 /*break*/, 5];
                        queuedFunction = queuedFunctions_1_1.value;
                        return [4 /*yield*/, queuedFunction()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        queuedFunctions_1_1 = queuedFunctions_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (queuedFunctions_1_1 && !queuedFunctions_1_1.done && (_a = queuedFunctions_1.return)) _a.call(queuedFunctions_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    AmplitudeCore.prototype.track = function (eventInput, eventProperties, eventOptions) {
        var event = (0, event_builder_1.createTrackEvent)(eventInput, eventProperties, eventOptions);
        return this.dispatch(event);
    };
    AmplitudeCore.prototype.identify = function (identify, eventOptions) {
        var event = (0, event_builder_1.createIdentifyEvent)(identify, eventOptions);
        return this.dispatch(event);
    };
    AmplitudeCore.prototype.groupIdentify = function (groupType, groupName, identify, eventOptions) {
        var event = (0, event_builder_1.createGroupIdentifyEvent)(groupType, groupName, identify, eventOptions);
        return this.dispatch(event);
    };
    AmplitudeCore.prototype.setGroup = function (groupType, groupName, eventOptions) {
        var event = (0, event_builder_1.createGroupEvent)(groupType, groupName, eventOptions);
        return this.dispatch(event);
    };
    AmplitudeCore.prototype.revenue = function (revenue, eventOptions) {
        var event = (0, event_builder_1.createRevenueEvent)(revenue, eventOptions);
        return this.dispatch(event);
    };
    AmplitudeCore.prototype.add = function (plugin) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (!this.config) {
                    this.q.push(this.add.bind(this, plugin));
                    return [2 /*return*/];
                }
                return [2 /*return*/, this.timeline.register(plugin, this.config)];
            });
        });
    };
    AmplitudeCore.prototype.remove = function (pluginName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (!this.config) {
                    this.q.push(this.remove.bind(this, pluginName));
                    return [2 /*return*/];
                }
                return [2 /*return*/, this.timeline.deregister(pluginName)];
            });
        });
    };
    AmplitudeCore.prototype.dispatchWithCallback = function (event, callback) {
        if (!this.config) {
            return callback((0, result_builder_1.buildResult)(event, 0, messages_1.CLIENT_NOT_INITIALIZED));
        }
        void this.process(event).then(callback);
    };
    AmplitudeCore.prototype.dispatch = function (event) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                if (!this.config) {
                    return [2 /*return*/, new Promise(function (resolve) {
                            _this.dispatchQ.push(_this.dispatchWithCallback.bind(_this, event, resolve));
                        })];
                }
                return [2 /*return*/, this.process(event)];
            });
        });
    };
    AmplitudeCore.prototype.process = function (event) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, e_2, message, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // skip event processing if opt out
                        if (this.config.optOut) {
                            return [2 /*return*/, (0, result_builder_1.buildResult)(event, 0, messages_1.OPT_OUT_MESSAGE)];
                        }
                        return [4 /*yield*/, this.timeline.push(event)];
                    case 1:
                        result = _a.sent();
                        result.code === 200
                            ? this.config.loggerProvider.log(result.message)
                            : this.config.loggerProvider.error(result.message);
                        return [2 /*return*/, result];
                    case 2:
                        e_2 = _a.sent();
                        message = String(e_2);
                        this.config.loggerProvider.error(message);
                        result = (0, result_builder_1.buildResult)(event, 0, message);
                        return [2 /*return*/, result];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AmplitudeCore.prototype.setOptOut = function (optOut) {
        if (!this.config) {
            this.q.push(this.setOptOut.bind(this, Boolean(optOut)));
            return;
        }
        this.config.optOut = Boolean(optOut);
    };
    AmplitudeCore.prototype.flush = function () {
        return this.timeline.flush();
    };
    return AmplitudeCore;
}());
exports.AmplitudeCore = AmplitudeCore;
//# sourceMappingURL=core-client.js.map