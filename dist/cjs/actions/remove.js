"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = remove;
var _utils = require("../utils");
var _validateAction = require("./validateAction");
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function doRemove(_ref, uiSchema) {
  let {
    field,
    schema
  } = _ref;
  let requiredIndex = schema.required ? schema.required.indexOf(field) : -1;
  if (requiredIndex !== -1) {
    schema.required.splice(requiredIndex, 1);
  }
  delete schema.properties[field];
  delete uiSchema[field];
  let fieldIndex = (uiSchema["ui:order"] ? uiSchema["ui:order"] : []).indexOf(field);
  if (fieldIndex !== -1) {
    uiSchema["ui:order"].splice(fieldIndex, 1);
  }
}

/**
 * Remove specified field both from uiSchema and schema
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @returns {{schema: *, uiSchema: *}}
 */
function remove(_ref2, schema, uiSchema) {
  let {
    field
  } = _ref2;
  let fieldArr = (0, _utils.toArray)(field);
  fieldArr.forEach(field => doRemove((0, _utils.findRelSchemaAndField)(field, schema), (0, _utils.findRelUiSchema)(field, uiSchema)));
}
remove.propTypes = {
  field: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]).isRequired
};
remove.validate = (0, _validateAction.validateFields)("remove", function (_ref3) {
  let {
    field
  } = _ref3;
  return field;
});