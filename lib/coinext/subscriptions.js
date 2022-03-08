"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APSubscriptions = void 0;
var APSubscriptions = /** @class */ (function () {
    function APSubscriptions() {
        var _this = this;
        this.addSubscription = function (eventName, callback) {
            _this.advanceNextSubscriptionId();
            var subscriptionId = APSubscriptions.nextId;
            if (!_this.subscriptions.has(eventName)) {
                _this.subscriptions.set(eventName, new Map());
            }
            var eventSubscriptions = _this.subscriptions.get(eventName);
            eventSubscriptions.set(subscriptionId, callback);
            return function () {
                eventSubscriptions.delete(subscriptionId);
            };
        };
        this.runCallbacks = function (eventName, payload) {
            var e_1, _a;
            if (_this.subscriptions.has(eventName)) {
                try {
                    for (var _b = __values(_this.subscriptions.get(eventName).values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var callback = _c.value;
                        callback(payload);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        };
        this.advanceNextSubscriptionId = function () {
            APSubscriptions.nextId++;
        };
        this.subscriptions = new Map();
    }
    APSubscriptions.nextId = 0;
    return APSubscriptions;
}());
exports.APSubscriptions = APSubscriptions;
