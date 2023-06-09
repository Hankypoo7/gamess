Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBridge = void 0;
var event_bridge_channel_1 = require("./event-bridge-channel");
var EventBridge = /** @class */ (function () {
    function EventBridge() {
        this.eventBridgeChannels = {};
    }
    EventBridge.prototype.sendEvent = function (channel, event) {
        if (!this.eventBridgeChannels[channel]) {
            this.eventBridgeChannels[channel] = new event_bridge_channel_1.EventBridgeChannel(channel);
        }
        this.eventBridgeChannels[channel].sendEvent(event);
    };
    EventBridge.prototype.setReceiver = function (channel, receiver) {
        if (!this.eventBridgeChannels[channel]) {
            this.eventBridgeChannels[channel] = new event_bridge_channel_1.EventBridgeChannel(channel);
        }
        this.eventBridgeChannels[channel].setReceiver(receiver);
    };
    return EventBridge;
}());
exports.EventBridge = EventBridge;
//# sourceMappingURL=event-bridge.js.map