Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
var tslib_1 = require("tslib");
var analytics_types_1 = require("@amplitude/analytics-types");
var ua_parser_js_1 = tslib_1.__importDefault(require("@amplitude/ua-parser-js"));
var analytics_core_1 = require("@amplitude/analytics-core");
var analytics_client_common_1 = require("@amplitude/analytics-client-common");
var version_1 = require("../version");
var BROWSER_PLATFORM = 'Web';
var IP_ADDRESS = '$remote';
var Context = /** @class */ (function () {
    function Context() {
        this.name = 'context';
        this.type = analytics_types_1.PluginType.BEFORE;
        this.eventId = 0;
        this.library = "amplitude-ts/".concat(version_1.VERSION);
        var agent;
        /* istanbul ignore else */
        if (typeof navigator !== 'undefined') {
            agent = navigator.userAgent;
        }
        this.uaResult = new ua_parser_js_1.default(agent).getResult();
    }
    Context.prototype.setup = function (config) {
        this.config = config;
        return Promise.resolve(undefined);
    };
    Context.prototype.execute = function (context) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var time, osName, osVersion, deviceModel, deviceVendor, event;
            return tslib_1.__generator(this, function (_a) {
                /**
                 * Manages user session triggered by new events
                 */
                if (!this.isSessionValid()) {
                    // Creates new session
                    this.config.sessionId = Date.now();
                } // else use previously creates session
                // Updates last event time to extend time-based session
                this.config.lastEventTime = Date.now();
                time = new Date().getTime();
                osName = this.uaResult.browser.name;
                osVersion = this.uaResult.browser.version;
                deviceModel = this.uaResult.device.model || this.uaResult.os.name;
                deviceVendor = this.uaResult.device.vendor;
                event = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({ user_id: this.config.userId, device_id: this.config.deviceId, session_id: this.config.sessionId, time: time }, (this.config.appVersion && { app_version: this.config.appVersion })), (this.config.trackingOptions.platform && { platform: BROWSER_PLATFORM })), (this.config.trackingOptions.osName && { os_name: osName })), (this.config.trackingOptions.osVersion && { os_version: osVersion })), (this.config.trackingOptions.deviceManufacturer && { device_manufacturer: deviceVendor })), (this.config.trackingOptions.deviceModel && { device_model: deviceModel })), (this.config.trackingOptions.language && { language: (0, analytics_client_common_1.getLanguage)() })), (this.config.trackingOptions.ipAddress && { ip: IP_ADDRESS })), { insert_id: (0, analytics_core_1.UUID)(), partner_id: this.config.partnerId, plan: this.config.plan }), (this.config.ingestionMetadata && {
                    ingestion_metadata: {
                        source_name: this.config.ingestionMetadata.sourceName,
                        source_version: this.config.ingestionMetadata.sourceVersion,
                    },
                })), context), { event_id: this.eventId++, library: this.library });
                return [2 /*return*/, event];
            });
        });
    };
    Context.prototype.isSessionValid = function () {
        var lastEventTime = this.config.lastEventTime || Date.now();
        var timeSinceLastEvent = Date.now() - lastEventTime;
        return timeSinceLastEvent < this.config.sessionTimeout;
    };
    return Context;
}());
exports.Context = Context;
//# sourceMappingURL=context.js.map