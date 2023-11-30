"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var config_1 = __importDefault(require("../config"));
var subscriptions_1 = require("./subscriptions");
var types_1 = require("./types");
var CoinextWebSocket = /** @class */ (function () {
    function CoinextWebSocket(isTestEnvironment) {
        if (isTestEnvironment === void 0) { isTestEnvironment = false; }
        var _this = this;
        this.index = 2;
        this.minimumSystemIndexIncrement = 2;
        this.socket = null;
        this.isTestEnvironment = false;
        this.subscriptions = new subscriptions_1.APSubscriptions();
        this.connect = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var server = new ws_1.default(_this.isTestEnvironment ? "".concat(config_1.default.API_TEST_URL) : "".concat(config_1.default.API_V2_URL));
                            server.onopen = function () { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    this.socket = server;
                                    this.socket.on("message", function (frame) {
                                        // console.log(`New frame received ${frame}`);
                                        var _a = JSON.parse(frame), messageType = _a.m, functionName = _a.n, response = _a.o;
                                        if (messageType === types_1.SocketOperation.Event) {
                                            var callbackPayload = JSON.parse(response);
                                            _this.subscriptions.runCallbacks(functionName, callbackPayload);
                                        }
                                    });
                                    try {
                                        resolve(server);
                                    }
                                    catch (e) {
                                        reject(e);
                                    }
                                    return [2 /*return*/];
                                });
                            }); };
                            server.onerror = function (err) {
                                reject(err);
                            };
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.disconnect = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this.socket) === null || _a === void 0 ? void 0 : _a.close())];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.callExternalApi = function (apiServiceName, payload) {
            var thisRequestIndex = _this.index;
            var options = JSON.stringify(payload);
            var payloadRequest = {
                m: types_1.SocketOperation.Request,
                i: thisRequestIndex,
                n: apiServiceName,
                o: options,
            };
            var message = JSON.stringify(payloadRequest);
            _this.socket.send(message);
            _this.index += _this.minimumSystemIndexIncrement;
            return new Promise(function (resolve, reject) {
                var _a;
                var listener = function (reply) {
                    var _a, _b;
                    try {
                        var _c = JSON.parse(reply), responseType = _c.m, responseFunction = _c.n, response = _c.o, reponseIndex = _c.i;
                        if (responseType === types_1.SocketOperation.Error) {
                            reject(JSON.parse(response));
                            return;
                        }
                        if (responseType === types_1.SocketOperation.Reply) {
                            if (response.length === 0) {
                                reject({
                                    errorMessage: "Response body was empty from service ".concat(apiServiceName),
                                });
                                return;
                            }
                            if (responseFunction === apiServiceName) {
                                if (reponseIndex === thisRequestIndex) {
                                    (_a = _this.socket) === null || _a === void 0 ? void 0 : _a.removeListener("message", listener);
                                    resolve(JSON.parse(response));
                                }
                            }
                        }
                    }
                    catch (e) {
                        (_b = _this.socket) === null || _b === void 0 ? void 0 : _b.removeListener("message", listener);
                        reject({
                            errorMessage: "Unknown error ".concat(e),
                        });
                    }
                };
                (_a = _this.socket) === null || _a === void 0 ? void 0 : _a.on("message", listener);
            });
        };
        this.subscribeToEvent = function (apiServiceName, apiEventName, callback, payload) {
            return new Promise(function (resolve, reject) {
                _this.callExternalApi(apiServiceName, payload)
                    .then(function (firstResponse) {
                    var disposeSubscription = _this.subscriptions.addSubscription(apiEventName, callback);
                    resolve({
                        firstPayload: firstResponse,
                        dispose: disposeSubscription,
                    });
                })
                    .catch(function (e) {
                    console.log("Error captured while subscribing to service ".concat(apiServiceName));
                    reject(e);
                });
            });
        };
        this.unsubscribeToEvent = function (apiUnsubscribeServiceName, payload) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callExternalApi(apiUnsubscribeServiceName, payload)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.getNumberOfListeners = function (serviceName) {
            return _this.socket ? _this.socket.listenerCount(serviceName) : 0;
        };
        this.isTestEnvironment = isTestEnvironment;
    }
    return CoinextWebSocket;
}());
exports.default = CoinextWebSocket;
