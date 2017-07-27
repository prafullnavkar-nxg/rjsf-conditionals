import { isDevelopment, validateFields, toArray } from "../utils";
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
export default function replaceUi({ field, conf }, schema, uiSchema) {
  toArray(field).forEach(f => (uiSchema[f] = conf));
}

if (isDevelopment()) {
  replaceUi.propTypes = {
    field: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    conf: PropTypes.object.isRequired,
  };

  replaceUi.validate = validateFields("replaceUi");
}
