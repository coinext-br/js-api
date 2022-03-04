"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSide = exports.OrderType = exports.SocketOperation = void 0;
var SocketOperation;
(function (SocketOperation) {
    SocketOperation[SocketOperation["Request"] = 0] = "Request";
    SocketOperation[SocketOperation["Reply"] = 1] = "Reply";
    SocketOperation[SocketOperation["SubscribeToEvent"] = 2] = "SubscribeToEvent";
    SocketOperation[SocketOperation["Event"] = 3] = "Event";
    SocketOperation[SocketOperation["UnSubscribeFromEvent"] = 4] = "UnSubscribeFromEvent";
    SocketOperation[SocketOperation["Error"] = 5] = "Error";
})(SocketOperation = exports.SocketOperation || (exports.SocketOperation = {}));
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
