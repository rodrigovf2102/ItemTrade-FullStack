"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultError = void 0;
function defaultError(detail) {
    return {
        name: "Error",
        message: "Unhable to proceed",
        detail,
    };
}
exports.defaultError = defaultError;
