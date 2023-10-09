import _Object$keys from "@babel/runtime-corejs2/core-js/object/keys";
import _Array$isArray from "@babel/runtime-corejs2/core-js/array/is-array";
import { toArray } from "../utils";
import { validateFields } from "./validateAction";
import PropTypes from "prop-types";

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
  _Object$keys(params).forEach(field => {
    let appendVal = params[field];
    let fieldUiSchema = uiSchema[field];
    if (!fieldUiSchema) {
      uiSchema[field] = appendVal;
    } else if (_Array$isArray(fieldUiSchema)) {
      toArray(appendVal).filter(v => !fieldUiSchema.includes(v)).forEach(v => fieldUiSchema.push(v));
    } else if (typeof appendVal === "object" && !_Array$isArray(appendVal)) {
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
export default function uiAppend(params, schema, uiSchema) {
  doAppend(uiSchema, params);
}
uiAppend.propTypes = PropTypes.object.isRequired;
uiAppend.validate = validateFields("uiAppend", function (params) {
  return _Object$keys(params);
});