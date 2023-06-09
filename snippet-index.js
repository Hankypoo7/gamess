Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var analytics_client_common_1 = require("@amplitude/analytics-client-common");
var amplitude = tslib_1.__importStar(require("./index"));
var snippet_helper_1 = require("./utils/snippet-helper");
// https://developer.mozilla.org/en-US/docs/Glossary/IIFE
(function () {
    var GlobalScope = (0, analytics_client_common_1.getGlobalScope)();
    if (!GlobalScope) {
        console.error('[Amplitude] Error: GlobalScope is not defined');
        return;
    }
    GlobalScope.amplitude = Object.assign(GlobalScope.amplitude || {}, amplitude);
    if (GlobalScope.amplitude.invoked) {
        var queue = GlobalScope.amplitude._q;
        GlobalScope.amplitude._q = [];
        (0, snippet_helper_1.runQueuedFunctions)(amplitude, queue);
        for (var i = 0; i < GlobalScope.amplitude._iq.length; i++) {
            var instance = Object.assign(GlobalScope.amplitude._iq[i], amplitude.createInstance());
            var queue_1 = instance._q;
            instance._q = [];
            (0, snippet_helper_1.runQueuedFunctions)(instance, queue_1);
        }
    }
})();
//# sourceMappingURL=snippet-index.js.map