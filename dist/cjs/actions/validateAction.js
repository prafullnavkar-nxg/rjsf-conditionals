"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validateAction;
exports.validateFields = void 0;
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utils = require("../utils");
var _utils2 = require("json-rules-engine-simplified/lib/utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const hasField = (field, schema) => {
  let separator = field.indexOf(".");
  if (separator === -1) {
    return schema.properties[field] !== undefined;
  } else {
    let parentField = field.substr(0, separator);
    let refSchema = (0, _utils2.extractRefSchema)(parentField, schema);
    return refSchema ? hasField(field.substr(separator + 1), refSchema) : false;
  }
};
const validateFields = (action, fetchFields) => {
  if (!fetchFields) {
    (0, _utils.toError)("validateFields requires fetchFields function");
    return;
  }
  return (params, schema) => {
    let relFields = (0, _utils.toArray)(fetchFields(params));
    relFields.filter(field => !hasField(field, schema)).forEach(field => (0, _utils.toError)(`Field "${field}" is missing from schema on "${action}"`));
  };
};
exports.validateFields = validateFields;
function validateAction(action, params, schema, uiSchema) {
  if (action.propTypes !== undefined && action.propTypes !== null) {
    _propTypes.default.checkPropTypes(action.propTypes, params, "prop", action);
  }
  if (action.validate && typeof action.validate === "function") {
    action.validate(params, schema, uiSchema);
  }
}