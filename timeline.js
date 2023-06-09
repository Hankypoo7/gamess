Object.defineProperty(exports, "__esModule", { value: true });
exports.Timeline = void 0;
var tslib_1 = require("tslib");
var analytics_types_1 = require("@amplitude/analytics-types");
var result_builder_1 = require("./utils/result-builder");
var Timeline = /** @class */ (function () {
    function Timeline() {
        this.queue = [];
        // Flag to guarantee one schedule apply is running
        this.applying = false;
        // Flag indicates whether timeline is ready to process event
        // Events collected before timeline is ready will stay in the queue to be processed later
        this.plugins = [];
    }
    Timeline.prototype.register = function (plugin, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, plugin.setup(config)];
                    case 1:
                        _a.sent();
                        this.plugins.push(plugin);
                        return [2 /*return*/];
                }
            });
        });
    };
    Timeline.prototype.deregister = function (pluginName) {
        this.plugins.splice(this.plugins.findIndex(function (plugin) { return plugin.name === pluginName; }), 1);
        return Promise.resolve();
    };
    Timeline.prototype.reset = function () {
        this.applying = false;
        this.plugins = [];
    };
    Timeline.prototype.push = function (event) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.queue.push([event, resolve]);
            _this.scheduleApply(0);
        });
    };
    Timeline.prototype.scheduleApply = function (timeout) {
        var _this = this;
        if (this.applying)
            return;
        this.applying = true;
        setTimeout(function () {
            void _this.apply(_this.queue.shift()).then(function () {
                _this.applying = false;
                if (_this.queue.length > 0) {
                    _this.scheduleApply(0);
                }
            });
        }, timeout);
    };
    Timeline.prototype.apply = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, event, _b, resolve, before, before_1, before_1_1, plugin, e_1_1, enrichment, enrichment_1, enrichment_1_1, plugin, e_2_1, destination, executeDestinations;
            var e_1, _c, e_2, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!item) {
                            return [2 /*return*/];
                        }
                        _a = tslib_1.__read(item, 1), event = _a[0];
                        _b = tslib_1.__read(item, 2), resolve = _b[1];
                        before = this.plugins.filter(function (plugin) { return plugin.type === analytics_types_1.PluginType.BEFORE; });
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 8]);
                        before_1 = tslib_1.__values(before), before_1_1 = before_1.next();
                        _e.label = 2;
                    case 2:
                        if (!!before_1_1.done) return [3 /*break*/, 5];
                        plugin = before_1_1.value;
                        return [4 /*yield*/, plugin.execute(tslib_1.__assign({}, event))];
                    case 3:
                        event = _e.sent();
                        _e.label = 4;
                    case 4:
                        before_1_1 = before_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (before_1_1 && !before_1_1.done && (_c = before_1.return)) _c.call(before_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        enrichment = this.plugins.filter(function (plugin) { return plugin.type === analytics_types_1.PluginType.ENRICHMENT; });
                        _e.label = 9;
                    case 9:
                        _e.trys.push([9, 14, 15, 16]);
                        enrichment_1 = tslib_1.__values(enrichment), enrichment_1_1 = enrichment_1.next();
                        _e.label = 10;
                    case 10:
                        if (!!enrichment_1_1.done) return [3 /*break*/, 13];
                        plugin = enrichment_1_1.value;
                        return [4 /*yield*/, plugin.execute(tslib_1.__assign({}, event))];
                    case 11:
                        event = _e.sent();
                        _e.label = 12;
                    case 12:
                        enrichment_1_1 = enrichment_1.next();
                        return [3 /*break*/, 10];
                    case 13: return [3 /*break*/, 16];
                    case 14:
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 16];
                    case 15:
                        try {
                            if (enrichment_1_1 && !enrichment_1_1.done && (_d = enrichment_1.return)) _d.call(enrichment_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 16:
                        destination = this.plugins.filter(function (plugin) { return plugin.type === analytics_types_1.PluginType.DESTINATION; });
                        executeDestinations = destination.map(function (plugin) {
                            var eventClone = tslib_1.__assign({}, event);
                            return plugin.execute(eventClone).catch(function (e) { return (0, result_builder_1.buildResult)(eventClone, 0, String(e)); });
                        });
                        void Promise.all(executeDestinations).then(function (_a) {
                            var _b = tslib_1.__read(_a, 1), result = _b[0];
                            resolve(result);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Timeline.prototype.flush = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var queue, destination, executeDestinations;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queue = this.queue;
                        this.queue = [];
                        return [4 /*yield*/, Promise.all(queue.map(function (item) { return _this.apply(item); }))];
                    case 1:
                        _a.sent();
                        destination = this.plugins.filter(function (plugin) { return plugin.type === analytics_types_1.PluginType.DESTINATION; });
                        executeDestinations = destination.map(function (plugin) {
                            return plugin.flush && plugin.flush();
                        });
                        return [4 /*yield*/, Promise.all(executeDestinations)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Timeline;
}());
exports.Timeline = Timeline;
//# sourceMappingURL=timeline.js.map