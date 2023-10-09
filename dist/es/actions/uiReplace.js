import _Object$keys from "@babel/runtime-corejs2/core-js/object/keys";
import { validateFields } from "./validateAction";
import PropTypes from "prop-types";

/**
 * Replace original field in uiSchema with defined configuration
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @param conf
 * @returns {{schema: *, uiSchema: *}}
 */
export default function uiReplace(params, schema, uiSchema) {
  _Object$keys(params).forEach(f => {
    uiSchema[f] = params[f];
  });
}
uiReplace.propTypes = PropTypes.object.isRequired;
uiReplace.validate = validateFields("uiReplace", function (params) {
  return _Object$keys(params);
});