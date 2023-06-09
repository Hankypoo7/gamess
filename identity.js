Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityEventSender = void 0;
var tslib_1 = require("tslib");
var analytics_types_1 = require("@amplitude/analytics-types");
var analytics_connector_1 = require("../analytics-connector");
var IdentityEventSender = /** @class */ (function () {
    function IdentityEventSender() {
        this.name = 'identity';
        this.type = analytics_types_1.PluginType.BEFORE;
        this.identityStore = (0, analytics_connector_1.getAnalyticsConnector)().identityStore;
    }
    IdentityEventSender.prototype.execute = function (context) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var userProperties;
            return tslib_1.__generator(this, function (_a) {
                userProperties = context.user_properties;
                if (userProperties) {
                    this.identityStore.editIdentity().updateUserProperties(userProperties).commit();
                }
                return [2 /*return*/, context];
            });
        });
    };
    IdentityEventSender.prototype.setup = function (_) {
        return Promise.resolve(undefined);
    };
    return IdentityEventSender;
}());
exports.IdentityEventSender = IdentityEventSender;
//# sourceMappingURL=identity.js.map