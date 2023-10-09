import _Object$keys from "@babel/runtime-corejs2/core-js/object/keys";
import _Array$isArray from "@babel/runtime-corejs2/core-js/array/is-array";
import { validateFields } from "./validateAction";
import PropTypes from "prop-types";

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
  _Object$keys(params).forEach(field => {
    let appendVal = params[field];
    let fieldUiSchema = uiSchema[field];
    if (!fieldUiSchema) {
      uiSchema[field] = appendVal;
    } else if (typeof appendVal === "object" && !_Array$isArray(appendVal)) {
      doOverride(fieldUiSchema, appendVal);
    } else {
      uiSchema[field] = appendVal;
    }
  });
}
export default function uiOverride(params, schema, uiSchema) {
  doOverride(uiSchema, params);
}
uiOverride.propTypes = PropTypes.object.isRequired;
uiOverride.validate = validateFields("uiOverride", function (params) {
  return _Object$keys(params);
});