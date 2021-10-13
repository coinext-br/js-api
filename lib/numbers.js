"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coinPrice = exports.coinAmount = exports.cryptoAmount = exports.fiatAmount = void 0;
function truncate(value, precision) {
    var s = value.toFixed(precision + 4);
    var i = s.indexOf('.');
    if (i === -1) {
        return value;
    }
    else {
        var sx = s.substring(0, i + precision + 1);
        return Number(sx);
    }
}
function fiatAmount(value) {
    return truncate(value, 2);
}
exports.fiatAmount = fiatAmount;
function cryptoAmount(value, precision) {
    if (precision === void 0) { precision = 8; }
    return truncate(value, precision);
}
exports.cryptoAmount = cryptoAmount;
function coinAmount(value, coin, precision) {
    if (precision === void 0) { precision = 8; }
    if (value || value === 0) {
        return ['BRL', 'USDT'].includes(coin) ? fiatAmount(value) : cryptoAmount(value, precision);
    }
    else {
        return value;
    }
}
exports.coinAmount = coinAmount;
function coinPrice(value, coin) {
    return coin === 'USDT' ? truncate(value, 4) : truncate(value, 2);
}
exports.coinPrice = coinPrice;
