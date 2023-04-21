Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = void 0;
var tslib_1 = require("tslib");
var analytics_client_common_1 = require("@amplitude/analytics-client-common");
var LocalStorage = /** @class */ (function () {
    function LocalStorage() {
    }
    LocalStorage.prototype.isEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var random, testStorage, testKey, value, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        /* istanbul ignore if */
                        if (!(0, analytics_client_common_1.getGlobalScope)()) {
                            return [2 /*return*/, false];
                        }
                        random = String(Date.now());
                        testStorage = new LocalStorage();
                        testKey = 'AMP_TEST';
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, 5, 7]);
                        return [4 /*yield*/, testStorage.set(testKey, random)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, testStorage.get(testKey)];
                    case 3:
                        value = _b.sent();
                        return [2 /*return*/, value === random];
                    case 4:
                        _a = _b.sent();
                        /* istanbul ignore next */
                        return [2 /*return*/, false];
                    case 5: return [4 /*yield*/, testStorage.remove(testKey)];
                    case 6:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    LocalStorage.prototype.get = function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var value, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getRaw(key)];
                    case 1:
                        value = _b.sent();
                        if (!value) {
                            return [2 /*return*/, undefined];
                        }
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        return [2 /*return*/, JSON.parse(value)];
                    case 2:
                        _a = _b.sent();
                        /* istanbul ignore next */
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LocalStorage.prototype.getRaw = function (key) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_b) {
                return [2 /*return*/, ((_a = (0, analytics_client_common_1.getGlobalScope)()) === null || _a === void 0 ? void 0 : _a.localStorage.getItem(key)) || undefined];
            });
        });
    };
    LocalStorage.prototype.set = function (key, value) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_b) {
                try {
                    (_a = (0, analytics_client_common_1.getGlobalScope)()) === null || _a === void 0 ? void 0 : _a.localStorage.setItem(key, JSON.stringify(value));
                }
                catch (_c) {
                    //
                }
                return [2 /*return*/];
            });
        });
    };
    LocalStorage.prototype.remove = function (key) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_b) {
                try {
                    (_a = (0, analytics_client_common_1.getGlobalScope)()) === null || _a === void 0 ? void 0 : _a.localStorage.removeItem(key);
                }
                catch (_c) {
                    //
                }
                return [2 /*return*/];
            });
        });
    };
    LocalStorage.prototype.reset = function () {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_b) {
                try {
                    (_a = (0, analytics_client_common_1.getGlobalScope)()) === null || _a === void 0 ? void 0 : _a.localStorage.clear();
                }
                catch (_c) {
                    //
                }
                return [2 /*return*/];
            });
        });
    };
    return LocalStorage;
}());
exports.LocalStorage = LocalStorage;
//# sourceMappingURL=local-storage.js.map