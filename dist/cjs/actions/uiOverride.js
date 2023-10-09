"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uiOverride;
var _validateAction = require("./validateAction");
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Override original field in uiSchema with defined configuration
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @param conf
 * @returns {{schema: *, uiSchema: *}}
 */
function doOverride(uiSchema, params) {
  Object.keys(params).forEach(field => {
    let appendVal = params[field];
    let fieldUiSchema = uiSchema[field];
    if (!fieldUiSchema) {
      uiSchema[field] = appendVal;
    } else if (typeof appendVal === "object" && !Array.isArray(appendVal)) {
      doOverride(fieldUiSchema, appendVal);
    } else {
      uiSchema[field] = appendVal;
    }
  });
}
function uiOverride(params, schema, uiSchema) {
  doOverride(uiSchema, params);
}
uiOverride.propTypes = _propTypes.default.object.isRequired;
uiOverride.validate = (0, _validateAction.validateFields)("uiOverride", function (params) {
  return Object.keys(params);
});