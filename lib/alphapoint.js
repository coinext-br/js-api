"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        while (_) try {
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
exports.ap = exports.websocketSubjects = void 0;
var rx_1 = __importDefault(require("rx"));
var config_1 = __importDefault(require("./config"));
var awaits_1 = require("./awaits");
var numbers_1 = require("./numbers");
var PUBLIC_USER = '_public';
var logger = console;
var nextIvalue = 2;
var RPCCall_ReplyWaitObjects = {};
exports.websocketSubjects = {
    instance: new rx_1.default.BehaviorSubject(null),
    connect: new rx_1.default.BehaviorSubject(null),
    close: new rx_1.default.BehaviorSubject(null),
    message: new rx_1.default.BehaviorSubject(null),
    error: new rx_1.default.BehaviorSubject(null),
};
var APError = /** @class */ (function (_super) {
    __extends(APError, _super);
    function APError(serviceName, response) {
        var _this = _super.call(this, "[" + serviceName + "] " + response.errormsg) || this;
        _this.serviceName = serviceName;
        _this.status = response.status;
        _this.errormsg = response.errormsg;
        _this.errorcode = response.errorcode;
        _this.detail = response.detail;
        _this.response = response;
        return _this;
    }
    return APError;
}(Error));
var AlphaPointService = /** @class */ (function () {
    function AlphaPointService() {
        this.ws = null;
    }
    AlphaPointService.prototype.connect = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = null;
                        if (username && username !== PUBLIC_USER) {
                            this.username = username;
                            this.password = password;
                            payload = { UserName: username, Password: password };
                        }
                        return [4 /*yield*/, this.connectUsingPayload(payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    AlphaPointService.prototype.reconnect = function (sessionToken) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connectUsingPayload({ SessionToken: sessionToken })];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, payload];
                }
            });
        });
    };
    // noinspection JSUnusedLocalSymbols
    AlphaPointService.prototype.connectUsingPayload = function (payload) {
        var _this = this;
        this.ws = new WebSocket(config_1.default.API_V2_URL);
        exports.websocketSubjects.instance.onNext(this.ws);
        return new Promise(function (resolve, reject) {
            if (!_this.ws) {
                logger.error('[ALPHAPOINT] ws === null?!');
                return;
            }
            _this.ws.onopen = function () {
                if (!_this.ws) {
                    logger.error('[ALPHAPOINT] ws === null?!');
                    return;
                }
                exports.websocketSubjects.connect.onNext({ kind: 'open' });
                _this.ws.onerror = function (e) {
                    logger.error(e);
                    exports.websocketSubjects.error.onNext(e);
                };
                _this.ws.onmessage = function (ev) {
                    exports.websocketSubjects.message.onNext({ data: ev.data });
                    var frame = JSON.parse(ev.data);
                    // if (!['SubscribeTicker', 'Level1UpdateEvent', 'SubscribeLevel2', 'Level2UpdateEvent', 'GetWithdrawTickets'].includes(frame.n)) {console.log(` <- ${ev.data}`);}
                    var cbs = RPCCall_ReplyWaitObjects[frame.n]
                        ? RPCCall_ReplyWaitObjects[frame.n]
                        : [RPCCall_ReplyWaitObjects[frame.i]];
                    if (cbs && cbs[0]) {
                        for (var _i = 0, cbs_1 = cbs; _i < cbs_1.length; _i++) {
                            var cb = cbs_1[_i];
                            // check cb.iValue, delete cb instead of cbs
                            if (!cb.isSubscription) {
                                delete RPCCall_ReplyWaitObjects[frame.i];
                            }
                            else if (frame.n !== cb.subscriptionName) {
                                console.warn("frame.n !== subscriptionName: " + frame.n + " !== " + cb.subscriptionName);
                            }
                            if (frame.m !== 5) {
                                try {
                                    var response = JSON.parse(frame.o);
                                    cb(null, response);
                                }
                                catch (e) {
                                    cb(e instanceof Error ? e : new Error("" + e), null);
                                }
                            }
                            else {
                                cb(new Error(frame.n + ": " + frame.o), null);
                            }
                        }
                    }
                    else {
                        console.log("Ignore: " + ev.data);
                    }
                };
                _this.ws.onclose = function () {
                    exports.websocketSubjects.close.onNext({ kind: 'close' });
                };
                if (!payload) {
                    resolve({});
                }
                else {
                    _this.callService('WebAuthenticateUser', payload)
                        .then(function (r) {
                        resolve(r);
                    })
                        .catch(function (e) {
                        reject(e);
                    });
                }
            };
            _this.ws.onerror = function (e) {
                logger.error(e);
                exports.websocketSubjects.error.onNext(e);
                reject(new Error("Can't connect to AP WebSocket: " + e));
            };
        });
    };
    AlphaPointService.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, key;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.ws) {
                            throw new Error('Not connected');
                        }
                        for (_i = 0, _a = Object.keys(RPCCall_ReplyWaitObjects); _i < _a.length; _i++) {
                            key = _a[_i];
                            delete RPCCall_ReplyWaitObjects[key];
                        }
                        if (![WebSocket.OPEN, WebSocket.CONNECTING].includes(this.ws.readyState)) return [3 /*break*/, 4];
                        this.ws.close();
                        _b.label = 1;
                    case 1:
                        if (!(this.ws.readyState !== WebSocket.CLOSED)) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, awaits_1.forTimeout)(100)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        this.ws = null;
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AlphaPointService.prototype.callService = function (serviceName, payload) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.ws) {
                logger.error('[ALPHAPOINT] callService: this.ws is null?!');
                return;
            }
            var payloadStr = payload ? JSON.stringify(payload) : '';
            var frame = {
                m: 0,
                i: nextIvalue,
                n: serviceName,
                o: payloadStr,
            };
            // console.log(` -> ${JSON.stringify(frame)}`);
            var cb = function (error, response) {
                if (error) {
                    reject(error);
                }
                else {
                    if (response && response.errorcode) {
                        var payloadMsg = serviceName === 'WebAuthenticateUser'
                            ? ''
                            : "Payload: " + payloadStr;
                        console.warn(serviceName + ": " + response.errormsg + ". " + payloadMsg);
                        reject(new APError(serviceName, response));
                    }
                    else {
                        resolve(response);
                    }
                }
            };
            cb.iValue = nextIvalue;
            RPCCall_ReplyWaitObjects[nextIvalue] = cb;
            nextIvalue += 2;
            _this.ws.send(JSON.stringify(frame));
        });
    };
    // noinspection JSMethodCanBeStatic, JSUnusedLocalSymbols
    AlphaPointService.prototype.subscribeService = function (serviceName, subscriptionNames, payload, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, subscriptionNames_1, subscriptionName, firstCallResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        for (_i = 0, subscriptionNames_1 = subscriptionNames; _i < subscriptionNames_1.length; _i++) {
                            subscriptionName = subscriptionNames_1[_i];
                            this.registerCallback(serviceName, subscriptionName, cb);
                        }
                        return [4 /*yield*/, this.callService(serviceName, payload)];
                    case 1:
                        firstCallResult = _a.sent();
                        cb(firstCallResult);
                        return [2 /*return*/, {
                                dispose: function () {
                                    for (var _i = 0, subscriptionNames_2 = subscriptionNames; _i < subscriptionNames_2.length; _i++) {
                                        var subscriptionName = subscriptionNames_2[_i];
                                        delete RPCCall_ReplyWaitObjects[subscriptionName];
                                    }
                                },
                            }];
                }
            });
        });
    };
    AlphaPointService.prototype.registerCallback = function (serviceName, subscriptionName, cb) {
        var observer = {
            next: function (value) { return cb(value, subscriptionName); },
            onerror: function (e) { return console.error(serviceName + ": " + e); },
        };
        var subscriptionCallback = function (error, response) {
            if (error) {
                console.warn(error);
                observer && observer.onerror(error);
            }
            else {
                if (response && response.errorcode) {
                    observer.onerror(new Error("[" + response.errormsg + "] " + response.errormsg + ": " + response.detail));
                }
                else {
                    observer.next(response);
                }
            }
        };
        subscriptionCallback.isSubscription = true;
        subscriptionCallback.subscriptionName = subscriptionName;
        var cbs = RPCCall_ReplyWaitObjects[subscriptionName];
        if (!cbs) {
            cbs = [];
            RPCCall_ReplyWaitObjects[subscriptionName] = cbs;
        }
        cbs.push(subscriptionCallback);
    };
    return AlphaPointService;
}());
var AlphaPoint = /** @class */ (function () {
    function AlphaPoint() {
        this.services = null;
    }
    AlphaPoint.prototype.connect = function (username, password) {
        if (username === void 0) { username = PUBLIC_USER; }
        if (password === void 0) { password = ''; }
        this.services = new AlphaPointService();
        return this.services.connect(username, password);
    };
    AlphaPoint.prototype.reconnect = function (sessionToken) {
        this.services = new AlphaPointService();
        return this.services.reconnect(sessionToken);
    };
    // noinspection JSUnusedGlobalSymbols
    AlphaPoint.prototype.disconnect = function () {
        if (!this.services) {
            throw new Error('[ALPHAPOINT] disconnect: this.services is null?!');
        }
        return this.services.disconnect();
    };
    AlphaPoint.prototype.registerNewUser = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var username, fullName, password, key, dob, affiliateTag, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        username = params.username, fullName = params.fullName, password = params.password, key = params.key, dob = params.dob, affiliateTag = params.affiliateTag;
                        _a = this.services;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.services.callService('RegisterNewUser', {
                                userInfo: {
                                    UserName: username,
                                    Email: username,
                                    PasswordHash: password,
                                },
                                OperatorId: 1,
                                AffiliateTag: affiliateTag,
                                UserConfig: [
                                    {
                                        Name: 'apexKey',
                                        Value: key,
                                    },
                                    {
                                        Name: 'fullName',
                                        Value: fullName,
                                    },
                                    {
                                        Name: 'dob',
                                        Value: dob,
                                    },
                                ],
                            })];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2: return [2 /*return*/, (_a)];
                }
            });
        });
    };
    AlphaPoint.prototype.getUserInfo = function (apUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.services.callService('GetUserInfo', { UserId: apUserId })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    AlphaPoint.prototype.enable2FA = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.services.callService('EnableGoogle2FA', {})];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response && response.ManualCode ? response.ManualCode : null];
                }
            });
        });
    };
    AlphaPoint.prototype.getUserConfigs = function (apUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.services &&
                            _this.services
                                .callService('GetUserConfig', {
                                UserId: apUserId,
                            })
                                .then(function (data) {
                                var ucData = data;
                                var result = {};
                                for (var _i = 0, ucData_1 = ucData; _i < ucData_1.length; _i++) {
                                    var entry = ucData_1[_i];
                                    result[entry.Key] = entry.Value;
                                }
                                resolve(result);
                            })
                                .catch(function (e) { return reject(e); });
                    })];
            });
        });
    };
    AlphaPoint.prototype.setUserConfig = function (apUserId, key, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.services) {
                    throw new Error('[ALPHAPOINT] setUserConfig: this.services is null?!');
                }
                return [2 /*return*/, this.services.callService('SetUserConfig', {
                        UserId: apUserId,
                        Config: [
                            {
                                Key: key,
                                Value: value,
                            },
                        ],
                    })];
            });
        });
    };
    AlphaPoint.prototype.removeUserConfig = function (apUserId, username, key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (this.services &&
                        this.services.callService('RemovetUserConfig', {
                            UserId: apUserId,
                            UserName: username,
                            Key: key,
                        }))];
            });
        });
    };
    AlphaPoint.prototype.getUserAccounts = function (apUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var accounts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.services) {
                            throw new Error('[ALPHAPOINT] getUserAccounts session is null?!');
                        }
                        return [4 /*yield*/, this.services.callService('GetUserAccounts', {
                                OMSId: 1,
                                UserId: apUserId,
                            })];
                    case 1:
                        accounts = _a.sent();
                        return [2 /*return*/, accounts];
                }
            });
        });
    };
    AlphaPoint.prototype.authenticate2FA = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.services) {
                            throw new Error('[ALPHAPOINT] authenticate2FA: services is null?!');
                        }
                        return [4 /*yield*/, this.services.callService('Authenticate2FA', {
                                Code: code,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    AlphaPoint.prototype.resetPassword = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.services) {
                            throw new Error('[ALPHAPOINT] resetPassword: this.services is null?!');
                        }
                        return [4 /*yield*/, this.services.callService('resetPassword', {
                                UserName: username,
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AlphaPoint.prototype.getAccountInfo = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.services) {
                            throw new Error('[ALPHAPOINT] getAccountInfo: this.services is null?!');
                        }
                        return [4 /*yield*/, this.services.callService('GetAccountInfo', {
                                OMSId: 1,
                                AccountId: accountId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    AlphaPoint.prototype.getProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var apProducts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.services) {
                            throw new Error('[ALPHAPOINT getProducts: this.services is null?!]');
                        }
                        return [4 /*yield*/, this.services.callService('GetProducts', {
                                OMSId: 1,
                            })];
                    case 1:
                        apProducts = _a.sent();
                        return [2 /*return*/, apProducts];
                }
            });
        });
    };
    AlphaPoint.prototype.getInstruments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var apPayload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.services) {
                            throw new Error('[ALPHAPOINT] getInstruments: services is null?!');
                        }
                        return [4 /*yield*/, this.services.callService('GetInstruments', {
                                OMSId: 1,
                            })];
                    case 1:
                        apPayload = _a.sent();
                        return [2 /*return*/, apPayload];
                }
            });
        });
    };
    AlphaPoint.prototype.getDepositKey = function (accountId, productId, generate) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.services) {
                            throw new Error('[ALPHAPOINT] getDepositKey: this.services is null?!');
                        }
                        return [4 /*yield*/, this.services.callService('GetDepositInfo', {
                                OMSId: 1,
                                ProductId: productId,
                                AccountId: accountId,
                                GenerateNewKey: generate,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // noinspection JSUnusedGlobalSymbols
    AlphaPoint.prototype.getL2Snapshot = function (instrumentId, depth) {
        if (depth === void 0) { depth = 100; }
        return (this.services &&
            this.services.callService('GetL2Snapshot', {
                OMSId: 1,
                InstrumentId: instrumentId,
                Depth: depth,
            }));
    };
    AlphaPoint.prototype.createDepositTicket = function (_a) {
        var accountId = _a.accountId, productId = _a.productId, currencyCode = _a.currencyCode, amount = _a.amount, depositInfo = _a.depositInfo;
        return (this.services &&
            this.services.callService('CreateDepositTicket', {
                OMSId: 1,
                OperatorId: 1,
                accountId: accountId,
                assetId: productId,
                assetName: currencyCode,
                amount: amount,
                RequestUser: accountId,
                Status: 'New',
                DepositInfo: depositInfo,
            }));
    };
    AlphaPoint.prototype.getWithdrawTemplateTypes = function (accountId, productId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.services) {
                            throw new Error('[ALPHAPOINT] getWithdrawTemplateTypes: this.services===null?!');
                        }
                        return [4 /*yield*/, this.services.callService('GetWithdrawTemplateTypes', {
                                OMSId: 1,
                                AccountId: accountId,
                                ProductId: productId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.TemplateTypes];
                }
            });
        });
    };
    AlphaPoint.prototype.createWithdrawTicket = function (_a) {
        var accountId = _a.accountId, productId = _a.productId, amount = _a.amount, formData = _a.formData;
        return __awaiter(this, void 0, void 0, function () {
            var templateTypes, templateType, form, payload, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.services) {
                            throw new Error('[ALPHAPOINT] createWithdrawTicket: this.services is null?!');
                        }
                        return [4 /*yield*/, this.getWithdrawTemplateTypes(accountId, productId)];
                    case 1:
                        templateTypes = _b.sent();
                        templateType = templateTypes[0].TemplateName;
                        form = __assign({ TemplateType: templateType }, formData);
                        payload = {
                            OMSId: 1,
                            AccountId: accountId,
                            ProductId: productId,
                            Amount: amount,
                            TemplateType: templateType,
                            TemplateForm: JSON.stringify(form),
                        };
                        return [4 /*yield*/, this.services.callService('CreateWithdrawTicket', payload)];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    AlphaPoint.prototype.createCryptoWithdrawTicket = function (_a) {
        var accountId = _a.accountId, productId = _a.productId, amount = _a.amount, address = _a.address, destinationTag = _a.destinationTag, memo = _a.memo;
        return __awaiter(this, void 0, void 0, function () {
            var formData;
            return __generator(this, function (_b) {
                formData = {
                    ExternalAddress: address,
                    Comment: '',
                };
                if (destinationTag) {
                    formData.DestinationTagNumber = destinationTag;
                }
                else if (memo) {
                    formData.Memo = memo;
                }
                return [2 /*return*/, this.createWithdrawTicket({ accountId: accountId, productId: productId, amount: amount, formData: formData })];
            });
        });
    };
    AlphaPoint.prototype.createFiatWithdrawTicket = function (_a) {
        var accountId = _a.accountId, productId = _a.productId, amount = _a.amount, fullName = _a.fullName, ssn = _a.ssn, account = _a.account;
        return __awaiter(this, void 0, void 0, function () {
            var bankAddress, bankAccountNumber, comment, a, a, formData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        comment = {};
                        if (account.type === 'pix') {
                            a = account;
                            bankAddress = "PIX - " + a.pixType;
                            bankAccountNumber = a.pixKey;
                            comment.Chave = a.pixKey;
                            comment.Tipo = a.pixType;
                        }
                        else {
                            a = account;
                            bankAddress = a.bankName + " - Ag\u00EAncia " + a.agency;
                            bankAccountNumber = a.account;
                            comment.Banco = a.bankName;
                            comment.Conta = a.account;
                            comment.Agencia = a.agency;
                            comment['Tipo de conta'] = a.type;
                        }
                        formData = {
                            fullName: fullName,
                            language: 'pt',
                            bankAddress: bankAddress,
                            bankAccountNumber: bankAccountNumber,
                            bankAccountName: ssn,
                            Comment: JSON.stringify(__assign(__assign({}, comment), { ssn: ssn })),
                        };
                        return [4 /*yield*/, this.createWithdrawTicket({
                                accountId: accountId,
                                productId: productId,
                                amount: amount,
                                formData: formData,
                            })];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    AlphaPoint.prototype.ping = function () {
        if (!this.services) {
            throw new Error('[ALPHAPOINT] ping: this.services is null?!');
        }
        return this.services.callService('Ping', {});
    };
    AlphaPoint.prototype.subscribeTicker = function (instrumentId, interval, count, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.services;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.services.subscribeService('SubscribeTicker', ['TickerDataUpdateEvent'], {
                                OMSId: 1,
                                InstrumentId: instrumentId,
                                Interval: interval,
                                IncludeLastCount: count,
                            }, function (response) {
                                var tickers = response;
                                if (tickers && tickers.length > 0 && tickers[0][8] === instrumentId) {
                                    cb(tickers);
                                }
                            })];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        return [2 /*return*/];
                }
            });
        });
    };
    AlphaPoint.prototype.subscribeLevel1 = function (instrumentId, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        payload = { OMSId: 1 };
                        if (instrumentId) {
                            payload.InstrumentId = instrumentId;
                        }
                        _a = this.services;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.services.subscribeService('SubscribeLevel1', ['Level1UpdateEvent'], payload, function (data) {
                                if (data.InstrumentId === instrumentId) {
                                    cb(data);
                                }
                            })];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        return [2 /*return*/];
                }
            });
        });
    };
    AlphaPoint.prototype.getAccountPositions = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, responsePayload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.services) {
                            throw new Error('[ALPHAPOINT] getAccountPositions this.services is null?!');
                        }
                        payload = { OMSId: 1, AccountId: accountId };
                        return [4 /*yield*/, this.services.callService('GetAccountPositions', payload)];
                    case 1:
                        responsePayload = _a.sent();
                        return [2 /*return*/, responsePayload];
                }
            });
        });
    };
    AlphaPoint.prototype.getOrderFee = function (_a) {
        var accountId = _a.accountId, buy = _a.buy, marketOrder = _a.marketOrder, instrumentId = _a.instrumentId, productId = _a.productId, quantity = _a.quantity, price = _a.price, maker = _a.maker;
        var payload = {
            OMSId: 1,
            AccountId: accountId,
            InstrumentId: instrumentId,
            ProductId: productId,
            Amount: quantity,
            OrderType: marketOrder ? 1 : 2,
            MakerTaker: maker ? 'Maker' : 'Taker',
            Side: buy ? 0 : 1,
            Price: price,
        };
        if (!buy) {
            payload.Quantity = quantity / price;
        }
        return this.services && this.services.callService('GetOrderFee', payload);
    };
    AlphaPoint.prototype.getUserAffiliateTag = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                payload = { OMSId: 1, UserId: userId };
                return [2 /*return*/, (this.services && this.services.callService('GetUserAffiliateTag', payload))];
            });
        });
    };
    AlphaPoint.prototype.addUserAffiliateTag = function (userId, tag) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                payload = {
                    OMSId: 1,
                    UserId: userId,
                    AffiliateTag: "" + tag,
                };
                return [2 /*return*/, (this.services && this.services.callService('AddUserAffiliateTag', payload))];
            });
        });
    };
    AlphaPoint.prototype.sendOrder = function (_a) {
        var accountId = _a.accountId, instrumentId = _a.instrumentId, marketOrder = _a.marketOrder, buy = _a.buy, quantity = _a.quantity, limitPrice = _a.limitPrice;
        return __awaiter(this, void 0, void 0, function () {
            var payload, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.services) {
                            throw new Error('[ALPHAPOINT] sendOrder: this.services is null?!');
                        }
                        payload = {
                            AccountId: accountId,
                            ClientOrderId: 0,
                            Side: buy ? 0 : 1,
                            Quantity: (0, numbers_1.cryptoAmount)(quantity),
                            OrderIdOCO: 0,
                            OrderType: marketOrder ? 1 : 2,
                            InstrumentId: instrumentId,
                            TimeInForce: 0,
                            OMSId: 1,
                            UseDisplayQuantity: false,
                        };
                        if (!marketOrder && limitPrice) {
                            payload.LimitPrice = +limitPrice;
                        }
                        return [4 /*yield*/, this.services.callService('SendOrder', payload)];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    AlphaPoint.prototype.cancelOrder = function (orderId) {
        if (!this.services) {
            throw new Error('[ALPHAPOINT] cancelOrder: this.services is null?!');
        }
        var payload = {
            OMSId: 1,
            OrderId: orderId,
        };
        return this.services.callService('CancelOrder', payload);
    };
    AlphaPoint.prototype.subscribeTrades = function (instrumentId, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        payload = {
                            OMSId: 1,
                            InstrumentId: instrumentId,
                            IncludeLastCount: 100,
                        };
                        _a = this.services;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.services.subscribeService('SubscribeTrades', ['TradeDataUpdateEvent'], payload, function (response) {
                                var tradeArray = response;
                                if (tradeArray &&
                                    tradeArray.length &&
                                    tradeArray[0][1] === instrumentId) {
                                    cb(tradeArray);
                                }
                            })];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        return [2 /*return*/];
                }
            });
        });
    };
    AlphaPoint.prototype.subscribeLevel2 = function (instrumentId, depth, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        instrumentId = Number(instrumentId); // better safe
                        _a = this.services;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.services.subscribeService('SubscribeLevel2', ['Level2UpdateEvent'], {
                                OMSId: 1,
                                InstrumentId: instrumentId,
                                Depth: depth,
                            }, function (response) {
                                var items = response;
                                if (items && items.length > 0) {
                                    var ordersInstrumentId = items[0][7];
                                    if (instrumentId === ordersInstrumentId) {
                                        cb(items);
                                    }
                                }
                            })];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        return [2 /*return*/];
                }
            });
        });
    };
    AlphaPoint.prototype.unsubscribeLevel1 = function (instrumentId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.services;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.services.callService('UnsubscribeLevel1', {
                                OMSId: 1,
                                InstrumentId: instrumentId,
                            })];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        return [2 /*return*/];
                }
            });
        });
    };
    AlphaPoint.prototype.unsubscribeLevel2 = function (instrumentId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.services;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.services.callService('UnsubscribeLevel2', {
                                OMSId: 1,
                                InstrumentId: instrumentId,
                            })];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        return [2 /*return*/];
                }
            });
        });
    };
    AlphaPoint.prototype.unsubscribeTicker = function (instrumentId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.services;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.services.callService('UnsubscribeTicker', {
                                OMSId: 1,
                                InstrumentId: instrumentId,
                            })];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        return [2 /*return*/];
                }
            });
        });
    };
    AlphaPoint.prototype.subscribeAccountEvents = function (accountId, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.services;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.services.subscribeService('SubscribeAccountEvents', [
                                'AccountPositionEvent',
                                'OrderStateEvent',
                                'OrderTradeEvent',
                                'PendingDepositUpdate',
                                'LogoutEvent',
                            ], {
                                OMSId: 1,
                                AccountId: accountId,
                            }, function (result, eventName) {
                                eventName && cb(result, eventName);
                            })];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2: return [2 /*return*/, (_a)];
                }
            });
        });
    };
    AlphaPoint.prototype.getOpenOrders = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.services) {
                            throw new Error('[ALPHAPOINT] getOpenOrders: this.services is null?!');
                        }
                        return [4 /*yield*/, this.services.callService('GetOpenOrders', {
                                OMSId: 1,
                                AccountId: accountId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    AlphaPoint.prototype.keepAlive = function (interval) {
        var _this = this;
        if (interval === void 0) { interval = 20000; }
        setInterval(function () {
            _this.ping();
        }, interval);
    };
    AlphaPoint.prototype.getAccountDepositTickets = function (apAccountId, startTimestamp) {
        if (startTimestamp === void 0) { startTimestamp = null; }
        var payload = {
            OMSId: 1,
            OperatorId: 1,
            AccountId: apAccountId,
        };
        if (startTimestamp) {
            payload.StartTimestamp = startTimestamp;
        }
        return (this.services &&
            this.services.callService('GetAllDepositTickets', payload));
    };
    AlphaPoint.prototype.getWithdrawTickets = function (apAccountId, limit) {
        if (limit === void 0) { limit = 40; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.services) {
                            throw new Error('[ALPHAPOINT] getWithdrawTickets: services is null!');
                        }
                        payload = {
                            OMSId: 1,
                            AccountId: apAccountId,
                            StartIndex: 0,
                            Limit: limit,
                        };
                        return [4 /*yield*/, this.services.callService('GetWithdrawTickets', payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    AlphaPoint.prototype.cancelWithdraw = function (userId, accountId, requestCode) {
        if (!this.services) {
            throw new Error('[ALPHAPOINT] cancelWithdraw: this.services is null?!');
        }
        var payload = {
            OMSId: 1,
            UserId: userId,
            AccountId: accountId,
            RequestCode: requestCode,
        };
        return this.services.callService('CancelWithdraw', payload);
    };
    return AlphaPoint;
}());
exports.ap = new AlphaPoint();
exports.default = AlphaPoint;
