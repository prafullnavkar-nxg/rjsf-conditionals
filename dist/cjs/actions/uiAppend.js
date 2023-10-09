"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uiAppend;
var _utils = require("../utils");
var _validateAction = require("./validateAction");
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Append original field in uiSchema with external configuration
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @param conf
 * @returns {{schema: *, uiSchema: *}}
 */
function doAppend(uiSchema, params) {
  Object.keys(params).forEach(field => {
    let appendVal = params[field];
    let fieldUiSchema = uiSchema[field];
    if (!fieldUiSchema) {
      uiSchema[field] = appendVal;
    } else if (Array.isArray(fieldUiSchema)) {
      (0, _utils.toArray)(appendVal).filter(v => !fieldUiSchema.includes(v)).forEach(v => fieldUiSchema.push(v));
    } else if (typeof appendVal === "object" && !Array.isArray(appendVal)) {
      doAppend(fieldUiSchema, appendVal);
    } else if (typeof fieldUiSchema === "string") {
      if (!fieldUiSchema.includes(appendVal)) {
        uiSchema[field] = fieldUiSchema + " " + appendVal;
      }
    } else {
      uiSchema[field] = appendVal;
    }
  });
}
function uiAppend(params, schema, uiSchema) {
  doAppend(uiSchema, params);
}
uiAppend.propTypes = _propTypes.default.object.isRequired;
uiAppend.validate = (0, _validateAction.validateFields)("uiAppend", function (params) {
  return Object.keys(params);
});