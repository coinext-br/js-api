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
exports.Coinext = exports.OrderSide = exports.OrderType = void 0;
var ws_1 = __importDefault(require("ws"));
var config_1 = __importDefault(require("./config"));
var crypto_1 = __importDefault(require("crypto"));
var SocketOperation;
(function (SocketOperation) {
    SocketOperation[SocketOperation["Request"] = 0] = "Request";
    SocketOperation[SocketOperation["Reply"] = 1] = "Reply";
    SocketOperation[SocketOperation["SubscribeToEvent"] = 2] = "SubscribeToEvent";
    SocketOperation[SocketOperation["Event"] = 3] = "Event";
    SocketOperation[SocketOperation["UnSubscribeFromEvent"] = 4] = "UnSubscribeFromEvent";
    SocketOperation[SocketOperation["Error"] = 5] = "Error";
})(SocketOperation || (SocketOperation = {}));
var ProductId;
(function (ProductId) {
    ProductId[ProductId["Blr"] = 1] = "Blr";
    ProductId[ProductId["Btc"] = 2] = "Btc";
    ProductId[ProductId["Ltc"] = 3] = "Ltc";
    ProductId[ProductId["Eth"] = 4] = "Eth";
    ProductId[ProductId["Xrp"] = 5] = "Xrp";
    ProductId[ProductId["Bch"] = 6] = "Bch";
    ProductId[ProductId["Ustd"] = 7] = "Ustd";
    ProductId[ProductId["Link"] = 8] = "Link";
    ProductId[ProductId["Doge"] = 9] = "Doge";
    ProductId[ProductId["Ada"] = 10] = "Ada";
    ProductId[ProductId["Eos"] = 11] = "Eos";
    ProductId[ProductId["Xlm"] = 12] = "Xlm";
})(ProductId || (ProductId = {}));
var OrderType;
(function (OrderType) {
    OrderType[OrderType["New"] = 1] = "New";
    OrderType[OrderType["Update"] = 2] = "Update";
    OrderType[OrderType["Delete"] = 3] = "Delete";
})(OrderType = exports.OrderType || (exports.OrderType = {}));
var OrderSide;
(function (OrderSide) {
    OrderSide[OrderSide["Buy"] = 0] = "Buy";
    OrderSide[OrderSide["Sell"] = 1] = "Sell";
    OrderSide[OrderSide["Short"] = 2] = "Short";
    OrderSide[OrderSide["Unknown"] = 3] = "Unknown";
})(OrderSide = exports.OrderSide || (exports.OrderSide = {}));
var Coinext = /** @class */ (function () {
    function Coinext() {
        var _this = this;
        this.index = 2;
        this.omsId = 1;
        this.minimumSystemIndexIncrement = 2;
        this.socket = null;
        this.products = [];
        this.instruments = [];
        this.connect = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var server = new ws_1.default("" + config_1.default.API_V2_URL);
                            server.onopen = function () { return __awaiter(_this, void 0, void 0, function () {
                                var e_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            this.socket = server;
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, this.refreshProductsAndInstruments()];
                                        case 2:
                                            _a.sent();
                                            resolve(server);
                                            return [3 /*break*/, 4];
                                        case 3:
                                            e_1 = _a.sent();
                                            reject(e_1);
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
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
        this.getCoins = function () {
            return _this.products.map(function (p) { return p.Product; });
        };
        this.getInstruments = function () {
            return _this.instruments.filter(function (i) { return !i.IsDisable; });
        };
        this.refreshProductsAndInstruments = function () { return __awaiter(_this, void 0, void 0, function () {
            var instrumentsResponse, productsResponse, pr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callExternalApi('GetInstruments', { OMSId: this.omsId })];
                    case 1:
                        instrumentsResponse = _a.sent();
                        this.instruments = instrumentsResponse;
                        return [4 /*yield*/, this.callExternalApi('GetProducts', { OMSId: this.omsId })];
                    case 2:
                        productsResponse = _a.sent();
                        pr = productsResponse;
                        this.products = pr.map(function (p) { return ({ ProductId: Number(p.ProductId), Product: p.Product }); });
                        return [2 /*return*/];
                }
            });
        }); };
        this.callExternalApi = function (apiServiceName, payload) {
            var thisRequestIndex = _this.index;
            var options = JSON.stringify(payload);
            var payloadRequest = {
                m: SocketOperation.Request,
                i: thisRequestIndex,
                n: apiServiceName,
                o: options,
            };
            var message = JSON.stringify(payloadRequest);
            _this.socket.send(message);
            _this.index += _this.minimumSystemIndexIncrement;
            return new Promise(function (resolve, reject) {
                var _a;
                (_a = _this.socket) === null || _a === void 0 ? void 0 : _a.on('message', function (reply) {
                    try {
                        var _a = JSON.parse(reply), responseType = _a.m, responseFunction = _a.n, response = _a.o, reponseIndex = _a.i;
                        if (responseType === SocketOperation.Error) {
                            reject(JSON.parse(response));
                            return;
                        }
                        if (responseType === SocketOperation.Reply) {
                            if (response.length === 0) {
                                reject({
                                    errorMessage: "Response body was empty from service " + apiServiceName,
                                });
                                return;
                            }
                            if (responseFunction === apiServiceName) {
                                if (reponseIndex === thisRequestIndex) {
                                    resolve(JSON.parse(response));
                                }
                            }
                        }
                    }
                    catch (e) {
                        reject({
                            errorMessage: "Unknown error " + e,
                        });
                    }
                });
            });
        };
        this.login = function (username, password) { return __awaiter(_this, void 0, void 0, function () {
            var apiResponse, errorMessage, authenticated, isAuthenticatorEnabled, sessionToken, user, userId, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.callExternalApi('AuthenticateUser', {
                                UserName: username || '',
                                Password: password || '',
                            })];
                    case 1:
                        apiResponse = _a.sent();
                        errorMessage = apiResponse.errormsg, authenticated = apiResponse.Authenticated, isAuthenticatorEnabled = apiResponse.Requires2FA, sessionToken = apiResponse.SessionToken, user = apiResponse.User;
                        userId = user ? user['UserId'] : 0;
                        return [2 /*return*/, {
                                authenticated: authenticated,
                                isAuthenticatorEnabled: isAuthenticatorEnabled,
                                token: sessionToken,
                                userId: userId,
                                errorMessage: errorMessage,
                            }];
                    case 2:
                        e_2 = _a.sent();
                        console.log(e_2);
                        return [2 /*return*/, {
                                authenticated: false,
                                isAuthenticatorEnabled: false,
                                token: '',
                                userId: 0,
                                errorMessage: 'Unknown login error',
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.loginBySecret = function () { return __awaiter(_this, void 0, void 0, function () {
            var authenticationPayload, apiResponse, errorMessage, _a, errormsg, authenticated, accountId, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        authenticationPayload = Coinext.authPayload("" + config_1.default.AP_USER, "" + config_1.default.AP_KEY, "" + config_1.default.AP_SECRET);
                        return [4 /*yield*/, this.callExternalApi('AuthenticateUser', authenticationPayload)];
                    case 1:
                        apiResponse = _b.sent();
                        errorMessage = apiResponse.errormsg;
                        if (errorMessage) {
                            return [2 /*return*/, Promise.resolve({
                                    accountId: -1,
                                    authenticated: false,
                                    errorMessage: errorMessage,
                                })];
                        }
                        _a = apiResponse, errormsg = _a.errormsg, authenticated = _a.Authenticated, accountId = _a.User.AccountId;
                        return [2 /*return*/, Promise.resolve({
                                accountId: accountId,
                                authenticated: authenticated,
                                errorMessage: errormsg,
                            })];
                    case 2:
                        e_3 = _b.sent();
                        return [2 /*return*/, Promise.resolve({
                                accountId: -1,
                                authenticated: false,
                                errorMessage: 'Unknown login error',
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getCurrencyDepositAddress = function (accountId, productName) { return __awaiter(_this, void 0, void 0, function () {
            var ProductId, apiResponse, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ProductId = this.products.filter(function (product) { return product.Product === productName; })[0].ProductId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.callExternalApi('GetDepositInfo', {
                                OMSId: this.omsId,
                                AccountId: accountId || '',
                                ProductId: ProductId || '',
                                GenerateNewKey: false,
                            })];
                    case 2:
                        apiResponse = (_a.sent());
                        return [2 /*return*/, Promise.resolve({
                                currencyDepositAddress: JSON.parse(apiResponse.DepositInfo),
                                errorMessage: '',
                            })];
                    case 3:
                        e_4 = _a.sent();
                        return [2 /*return*/, Promise.resolve({
                                currencyDepositAddress: [],
                                errorMessage: 'Unknown error getting currency deposity address',
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.subscribeToAccountEvents = function (_a) {
            var accountId = _a.accountId;
            return __awaiter(_this, void 0, void 0, function () {
                var apiResponse, subscriptionStatus, e_5;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.callExternalApi('SubscribeAccountEvents', {
                                    OMSId: this.omsId,
                                    AccountId: accountId,
                                })];
                        case 1:
                            apiResponse = _b.sent();
                            subscriptionStatus = apiResponse;
                            return [2 /*return*/, Promise.resolve({
                                    subscribed: subscriptionStatus.Subscribed,
                                    errorMessage: '',
                                })];
                        case 2:
                            e_5 = _b.sent();
                            return [2 /*return*/, Promise.resolve({
                                    subscribed: false,
                                    errorMessage: 'Unknown error subscribing into account events',
                                })];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        this.getBookOrders = function (_a) {
            var instrumentId = _a.instrumentId, howMany = _a.howMany, side = _a.side;
            return __awaiter(_this, void 0, void 0, function () {
                var apiResponse, orders, bookOrders_1, e_6;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.callExternalApi('GetL2Snapshot', {
                                    OMSId: this.omsId,
                                    InstrumentId: instrumentId,
                                    Depth: howMany,
                                })];
                        case 1:
                            apiResponse = _b.sent();
                            orders = apiResponse;
                            bookOrders_1 = [];
                            orders.map(function (order) {
                                var bookOrder = {
                                    updateId: order[0],
                                    uniqueAccountsQuantity: order[1],
                                    posixActionDateTime: order[2],
                                    type: order[3],
                                    lastTradePrice: order[4],
                                    numberOfOrders: order[5],
                                    price: order[6],
                                    instrumentId: order[7],
                                    quantity: order[8],
                                    side: order[9],
                                };
                                bookOrders_1.push(bookOrder);
                            });
                            bookOrders_1 = bookOrders_1.filter(function (bo) { return bo.side === side; });
                            return [2 /*return*/, Promise.resolve({
                                    orders: bookOrders_1,
                                    errorMessage: '',
                                    isEmpty: bookOrders_1.length === 0,
                                })];
                        case 2:
                            e_6 = _b.sent();
                            return [2 /*return*/, Promise.resolve({
                                    orders: [],
                                    isEmpty: true,
                                    errorMessage: 'Unknown error getting book orders',
                                })];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        this.getInstrumentIdBySymbol = function (instrumentSymbol) { return __awaiter(_this, void 0, void 0, function () {
            var apiResponse, instruments, instrument, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.callExternalApi('GetInstruments', { omsId: this.omsId })];
                    case 1:
                        apiResponse = _a.sent();
                        instruments = apiResponse;
                        instrument = instruments.find(function (i) { return i.Symbol === instrumentSymbol; });
                        return [2 /*return*/, instrument
                                ? Promise.resolve({
                                    instrumentId: instrument.InstrumentId,
                                    errorMessage: '',
                                })
                                : Promise.resolve({
                                    instrumentId: -1,
                                    errorMessage: "cannot quote " + instrumentSymbol,
                                })];
                    case 2:
                        e_7 = _a.sent();
                        return [2 /*return*/, Promise.resolve({
                                instrumentId: -1,
                                errorMessage: 'Unknown error getting instrument id',
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getTickerHistory = function (coin, intervalInSeconds, fromDate, toDate) { return __awaiter(_this, void 0, void 0, function () {
            var instrument, _a, response, errorMessage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        instrument = this.instrumentForCoin(coin);
                        if (!instrument) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.safeCall('GetTickerHistory', {
                                OMSId: 1,
                                InstrumentId: instrument.InstrumentId,
                                Interval: intervalInSeconds,
                                FromDate: fromDate.toISOString(),
                                ToDate: toDate.toISOString()
                            })];
                    case 1:
                        _a = _b.sent(), response = _a.response, errorMessage = _a.errorMessage;
                        return [2 /*return*/, { history: response, errorMessage: errorMessage }];
                    case 2: return [2 /*return*/, { history: [], errorMessage: "Instrument not found: " + coin + "/BRL" }];
                }
            });
        }); };
        this.getDeposits = function (accountId) { return __awaiter(_this, void 0, void 0, function () {
            var deposits, apiResponse, e_8;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deposits = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.callExternalApi('GetDeposits', {
                                OMSId: this.omsId,
                                AccountId: accountId || '',
                            })];
                    case 2:
                        apiResponse = (_a.sent());
                        apiResponse.forEach(function (deposit) {
                            var Product = _this.products.filter(function (product) { return product.ProductId === deposit.ProductId; })[0].Product;
                            deposit.DepositInfo = JSON.parse(deposit.DepositInfo.toString());
                            deposits.push({
                                productId: deposit.ProductId,
                                amount: deposit.Amount,
                                assetName: Product,
                                toAddress: deposit.DepositInfo.ToAddress,
                                ticketStatus: deposit.TicketStatus,
                            });
                        });
                        return [2 /*return*/, Promise.resolve({
                                deposits: deposits,
                                isEmpty: deposits.length === 0,
                                errorMessage: '',
                            })];
                    case 3:
                        e_8 = _a.sent();
                        return [2 /*return*/, Promise.resolve({
                                deposits: deposits,
                                isEmpty: deposits.length === 0,
                                errorMessage: "Unknown error getting deposits for accountId " + accountId,
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.transferFunds = function (senderAccountId, productName, receiverUsername, amount, notes) { return __awaiter(_this, void 0, void 0, function () {
            var ProductId, apiResponse, result, errormsg, detail, retorno, details, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ProductId = this.products.filter(function (product) { return product.Product === productName; })[0].ProductId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.callExternalApi('TransferFunds', {
                                OMSId: this.omsId,
                                ProductId: ProductId || '',
                                SenderAccountId: senderAccountId || '',
                                ReceiverUsername: receiverUsername || '',
                                Amount: amount || 0,
                                Notes: notes || '',
                            })];
                    case 2:
                        apiResponse = (_a.sent());
                        result = apiResponse.result, errormsg = apiResponse.errormsg, detail = apiResponse.detail;
                        retorno = {
                            success: result,
                            details: null,
                            errorMessage: errormsg,
                        };
                        if (result && detail !== null) {
                            details = JSON.parse(detail);
                            retorno = {
                                success: result,
                                details: {
                                    transferId: details.TransferId,
                                    senderAccountId: details.SenderAccountId,
                                    senderUserName: details.SenderUserName,
                                    receiverAccountId: details.ReceiverAccountId,
                                    receiverUserName: details.ReceiverUserName,
                                    productId: details.ProductId,
                                    amount: details.Amount,
                                    notes: details.Notes,
                                    omsId: details.OMSId,
                                    reason: details.Reason,
                                    transferState: details.TransferState,
                                    createdTimeInTicks: details.CreatedTimeInTicks,
                                    lastUpdatedTimeInTicks: details.LastUpdatedTimeInTicks,
                                },
                                errorMessage: errormsg,
                            };
                        }
                        return [2 /*return*/, Promise.resolve(retorno)];
                    case 3:
                        e_9 = _a.sent();
                        return [2 /*return*/, Promise.resolve({
                                success: false,
                                details: null,
                                errorMessage: "Unknown error transfering funds from accountId " + senderAccountId + " to " + receiverUsername,
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
    }
    Coinext.createSha256Signature = function (secret, message) {
        var hmac = crypto_1.default.createHmac('sha256', secret);
        hmac.update(message);
        return hmac.digest('hex');
    };
    Coinext.authPayload = function (userId, apiKey, apiSecret) {
        var nonce = new Date().getTime();
        var signature = Coinext.createSha256Signature(apiSecret, "" + nonce + userId + apiKey);
        return {
            APIKey: apiKey,
            Signature: signature,
            UserId: "" + userId,
            Nonce: "" + nonce,
        };
    };
    Coinext.prototype.safeCall = function (serviceName, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.callExternalApi(serviceName, payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, { response: response, errorMessage: '' }];
                    case 2:
                        e_10 = _a.sent();
                        console.error(e_10);
                        return [2 /*return*/, { errorMessage: "" + e_10 }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Coinext.prototype.instrumentForCoin = function (coin) {
        var symbol = coin.toUpperCase() + "BRL";
        return this.getInstruments().find(function (i) { return i.Symbol === symbol; });
    };
    return Coinext;
}());
exports.Coinext = Coinext;
