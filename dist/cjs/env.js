"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const isDevelopment = () => {
  return process.env.NODE_ENV !== "production";
};
var _default = exports.default = {
  isDevelopment
};