"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = requireFn;
var _utils = require("../utils");
var _validateAction = require("./validateAction");
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function doRequire(_ref) {
  let {
    field,
    schema
  } = _ref;
  if (!schema.required) {
    schema.required = [];
  }
  if (schema.required.indexOf(field) === -1) {
    schema.required.push(field);
  }
}

/**
 * Makes provided field required
 *
 * @param params
 * @param schema
 * @param uiSchema
 * @returns {{schema: *, uiSchema: *}}
 */
function requireFn(_ref2, schema) {
  let {
    field
  } = _ref2;
  let fieldArr = (0, _utils.toArray)(field);
  (0, _utils.toArray)(fieldArr).forEach(field => doRequire((0, _utils.findRelSchemaAndField)(field, schema)));
}
requireFn.propTypes = {
  field: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]).isRequired
};
requireFn.validate = (0, _validateAction.validateFields)("require", function (_ref3) {
  let {
    field
  } = _ref3;
  return field;
});