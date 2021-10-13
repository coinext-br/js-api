"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forTimeout = void 0;
function forTimeout(timeout) {
    return new Promise(function (resolve) {
        setTimeout(function () { return resolve(true); }, timeout);
    });
}
exports.forTimeout = forTimeout;
