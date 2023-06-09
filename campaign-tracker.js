Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignTracker = void 0;
var tslib_1 = require("tslib");
var analytics_core_1 = require("@amplitude/analytics-core");
var cookie_name_1 = require("../cookie-name");
var campaign_parser_1 = require("./campaign-parser");
var constants_1 = require("./constants");
var CampaignTracker = /** @class */ (function () {
    function CampaignTracker(apiKey, options) {
        var _a, _b;
        this.storage = options.storage;
        this.storageKey = (0, cookie_name_1.getCookieName)(apiKey, constants_1.MKTG);
        this.parser = new campaign_parser_1.CampaignParser();
        this.track = options.track;
        this.onNewCampaign = options.onNewCampaign;
        this.disabled = Boolean(options.disabled);
        this.trackNewCampaigns = Boolean(options.trackNewCampaigns);
        this.trackPageViews = Boolean(options.trackPageViews);
        this.excludeReferrers = (_a = options.excludeReferrers) !== null && _a !== void 0 ? _a : [];
        if (typeof location !== 'undefined') {
            this.excludeReferrers.unshift(location.hostname);
        }
        this.initialEmptyValue = (_b = options.initialEmptyValue) !== null && _b !== void 0 ? _b : constants_1.EMPTY_VALUE;
    }
    CampaignTracker.prototype.isNewCampaign = function (current, previous, ignoreSubdomainInReferrer) {
        if (ignoreSubdomainInReferrer === void 0) { ignoreSubdomainInReferrer = false; }
        var referrer = current.referrer, referring_domain = current.referring_domain, currentCampaign = tslib_1.__rest(current, ["referrer", "referring_domain"]);
        var _a = previous || {}, _previous_referrer = _a.referrer, prevReferringDomain = _a.referring_domain, previousCampaign = tslib_1.__rest(_a, ["referrer", "referring_domain"]);
        if (current.referring_domain && this.excludeReferrers.includes(current.referring_domain)) {
            return false;
        }
        var hasNewCampaign = JSON.stringify(currentCampaign) !== JSON.stringify(previousCampaign);
        var hasNewDomain = ignoreSubdomainInReferrer
            ? domainWithoutSubdomain(referring_domain || '') !== domainWithoutSubdomain(prevReferringDomain || '')
            : referring_domain !== prevReferringDomain;
        return !previous || hasNewCampaign || hasNewDomain;
    };
    CampaignTracker.prototype.saveCampaignToStorage = function (campaign) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.set(this.storageKey, campaign)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CampaignTracker.prototype.getCampaignFromStorage = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.get(this.storageKey)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CampaignTracker.prototype.createCampaignEvent = function (campaign) {
        var _this = this;
        var campaignParameters = tslib_1.__assign(tslib_1.__assign({}, constants_1.BASE_CAMPAIGN), campaign);
        var identifyEvent = Object.entries(campaignParameters).reduce(function (identify, _a) {
            var _b = tslib_1.__read(_a, 2), key = _b[0], value = _b[1];
            identify.setOnce("initial_".concat(key), value || _this.initialEmptyValue);
            if (value) {
                return identify.set(key, value);
            }
            return identify.unset(key);
        }, new analytics_core_1.Identify());
        var pageViewEvent = {
            event_type: 'Page View',
            event_properties: {
                page_title: /* istanbul ignore next */ (typeof document !== 'undefined' && document.title) || '',
                page_location: /* istanbul ignore next */ (typeof location !== 'undefined' && location.href) || '',
                page_path: /* istanbul ignore next */ (typeof location !== 'undefined' && location.pathname) || '',
            },
        };
        return tslib_1.__assign(tslib_1.__assign({}, (0, analytics_core_1.createIdentifyEvent)(identifyEvent)), (this.trackPageViews && pageViewEvent));
    };
    CampaignTracker.prototype.send = function (isNewSession) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var currentCampaign, previousCampaign;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.disabled) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.parser.parse()];
                    case 1:
                        currentCampaign = _a.sent();
                        return [4 /*yield*/, this.getCampaignFromStorage()];
                    case 2:
                        previousCampaign = _a.sent();
                        if (!isNewSession) {
                            if (!this.trackNewCampaigns || !this.isNewCampaign(currentCampaign, previousCampaign)) {
                                return [2 /*return*/];
                            }
                            this.onNewCampaign(currentCampaign);
                        }
                        return [4 /*yield*/, this.track(this.createCampaignEvent(currentCampaign))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.saveCampaignToStorage(currentCampaign)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return CampaignTracker;
}());
exports.CampaignTracker = CampaignTracker;
var domainWithoutSubdomain = function (domain) {
    var parts = domain.split('.');
    if (parts.length <= 2) {
        return domain;
    }
    return parts.slice(parts.length - 2, parts.length).join('.');
};
//# sourceMappingURL=campaign-tracker.js.map