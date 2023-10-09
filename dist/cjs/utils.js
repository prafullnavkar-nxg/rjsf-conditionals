"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findRelSchemaAndField = exports.deepEquals = void 0;
exports.findRelUiSchema = findRelUiSchema;
exports.toError = exports.toArray = exports.logWarning = void 0;
var _utils = require("json-rules-engine-simplified/lib/utils");
var _env = _interopRequireDefault(require("./env"));
var _isEqualWith = _interopRequireDefault(require("lodash/isEqualWith"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** Cloned from @rjsf/utils v5 to make it work in older rjsf versions
 *
 * @param a - The first element to compare
 * @param b - The second element to compare
 * @returns - True if the `a` and `b` are deeply equal, false otherwise
 */
const deepEquals = (a, b) => {
  return (0, _isEqualWith.default)(a, b, (obj, other) => {
    if (typeof obj === "function" && typeof other === "function") {
      // Assume all functions are equivalent
      // see https://github.com/rjsf-team/react-jsonschema-form/issues/255
      return true;
    }
    return undefined; // fallback to default isEquals behavior
  });
};
exports.deepEquals = deepEquals;
const toArray = field => {
  if (Array.isArray(field)) {
    return field;
  } else {
    return [field];
  }
};
exports.toArray = toArray;
const toError = message => {
  if (_env.default.isDevelopment()) {
    throw new ReferenceError(message);
  } else {
    logWarning(message);
  }
};
exports.toError = toError;
const logWarning = message => {
  console.warn(message);
};

/**
 * Find relevant schema for the field
 * @returns { field: "string", schema: "object" } relevant field and schema
 */
exports.logWarning = logWarning;
const findRelSchemaAndField = (field, schema) => {
  let separator = field.indexOf(".");
  if (separator === -1) {
    return {
      field,
      schema
    };
  }
  let parentField = field.substr(0, separator);
  let refSchema;
  try {
    refSchema = (0, _utils.extractRefSchema)(parentField, schema);
  } catch (e) {
    refSchema = null;
  }
  if (refSchema) {
    return findRelSchemaAndField(field.substr(separator + 1), refSchema);
  }
  logWarning(`Failed to retrieve nested schema with key ${field}`);
  return {
    field,
    schema
  };
};
exports.findRelSchemaAndField = findRelSchemaAndField;
function findRelUiSchema(field, uiSchema) {
  let separator = field.indexOf(".");
  if (separator === -1) {
    return uiSchema;
  }
  let parentField = field.substr(0, separator);
  let refUiSchema = uiSchema[parentField];
  if (!refUiSchema) {
    return uiSchema;
  } else {
    return findRelUiSchema(field.substr(separator + 1), refUiSchema);
  }
}