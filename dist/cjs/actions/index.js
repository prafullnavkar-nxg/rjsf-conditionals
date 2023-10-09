"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_ACTIONS = void 0;
exports.default = execute;
var _remove = _interopRequireDefault(require("./remove"));
var _require2 = _interopRequireDefault(require("./require"));
var _uiAppend = _interopRequireDefault(require("./uiAppend"));
var _uiReplace = _interopRequireDefault(require("./uiReplace"));
var _uiOverride = _interopRequireDefault(require("./uiOverride"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DEFAULT_ACTIONS = exports.DEFAULT_ACTIONS = {
  remove: _remove.default,
  require: _require2.default,
  uiAppend: _uiAppend.default,
  uiReplace: _uiReplace.default,
  uiOverride: _uiOverride.default
};
function execute(_ref, schema, uiSchema, formData) {
  let {
    type,
    params
  } = _ref;
  let extraActions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  let action = extraActions[type] ? extraActions[type] : DEFAULT_ACTIONS[type];
  action(params, schema, uiSchema, formData);
}