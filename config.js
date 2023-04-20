Object.defineProperty(exports, "__esModule", { value: true });
exports.createServerConfig = exports.getServerUrl = exports.Config = exports.getDefaultConfig = void 0;
var analytics_types_1 = require("@amplitude/analytics-types");
var constants_1 = require("./constants");
var logger_1 = require("./logger");
var getDefaultConfig = function () { return ({
    flushMaxRetries: 12,
    flushQueueSize: 200,
    flushIntervalMillis: 10000,
    logLevel: analytics_types_1.LogLevel.Warn,
    loggerProvider: new logger_1.Logger(),
    optOut: false,
    serverUrl: constants_1.AMPLITUDE_SERVER_URL,
    serverZone: analytics_types_1.ServerZone.US,
    useBatch: false,
}); };
exports.getDefaultConfig = getDefaultConfig;
var Config = /** @class */ (function () {
    function Config(options) {
        var _a, _b, _c;
        this._optOut = false;
        var defaultConfig = (0, exports.getDefaultConfig)();
        this.apiKey = options.apiKey;
        this.flushIntervalMillis = options.flushIntervalMillis || defaultConfig.flushIntervalMillis;
        this.flushMaxRetries = options.flushMaxRetries || defaultConfig.flushMaxRetries;
        this.flushQueueSize = options.flushQueueSize || defaultConfig.flushQueueSize;
        this.loggerProvider = options.loggerProvider || defaultConfig.loggerProvider;
        this.logLevel = (_a = options.logLevel) !== null && _a !== void 0 ? _a : defaultConfig.logLevel;
        this.minIdLength = options.minIdLength;
        this.plan = options.plan;
        this.ingestionMetadata = options.ingestionMetadata;
        this.optOut = (_b = options.optOut) !== null && _b !== void 0 ? _b : defaultConfig.optOut;
        this.serverUrl = options.serverUrl;
        this.serverZone = options.serverZone || defaultConfig.serverZone;
        this.storageProvider = options.storageProvider;
        this.transportProvider = options.transportProvider;
        this.useBatch = (_c = options.useBatch) !== null && _c !== void 0 ? _c : defaultConfig.useBatch;
        this.loggerProvider.enable(this.logLevel);
        var serverConfig = (0, exports.createServerConfig)(options.serverUrl, options.serverZone, options.useBatch);
        this.serverZone = serverConfig.serverZone;
        this.serverUrl = serverConfig.serverUrl;
    }
    Object.defineProperty(Config.prototype, "optOut", {
        get: function () {
            return this._optOut;
        },
        set: function (optOut) {
            this._optOut = optOut;
        },
        enumerable: false,
        configurable: true
    });
    return Config;
}());
exports.Config = Config;
var getServerUrl = function (serverZone, useBatch) {
    if (serverZone === analytics_types_1.ServerZone.EU) {
        return useBatch ? constants_1.EU_AMPLITUDE_BATCH_SERVER_URL : constants_1.EU_AMPLITUDE_SERVER_URL;
    }
    return useBatch ? constants_1.AMPLITUDE_BATCH_SERVER_URL : constants_1.AMPLITUDE_SERVER_URL;
};
exports.getServerUrl = getServerUrl;
var createServerConfig = function (serverUrl, serverZone, useBatch) {
    if (serverUrl === void 0) { serverUrl = ''; }
    if (serverZone === void 0) { serverZone = (0, exports.getDefaultConfig)().serverZone; }
    if (useBatch === void 0) { useBatch = (0, exports.getDefaultConfig)().useBatch; }
    if (serverUrl) {
        return { serverUrl: serverUrl, serverZone: undefined };
    }
    var _serverZone = [analytics_types_1.ServerZone.US, analytics_types_1.ServerZone.EU].includes(serverZone) ? serverZone : (0, exports.getDefaultConfig)().serverZone;
    return {
        serverZone: _serverZone,
        serverUrl: (0, exports.getServerUrl)(_serverZone, useBatch),
    };
};
exports.createServerConfig = createServerConfig;
//# sourceMappingURL=config.js.map