import { toArray, findRelSchemaAndField } from "../utils";
import { validateFields } from "./validateAction";
import PropTypes from "prop-types";
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
export default function requireFn(_ref2, schema) {
  let {
    field
  } = _ref2;
  let fieldArr = toArray(field);
  toArray(fieldArr).forEach(field => doRequire(findRelSchemaAndField(field, schema)));
}
requireFn.propTypes = {
  field: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired
};
requireFn.validate = validateFields("require", function (_ref3) {
  let {
    field
  } = _ref3;
  return field;
});