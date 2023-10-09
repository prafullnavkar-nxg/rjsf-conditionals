import _Array$isArray from "@babel/runtime-corejs2/core-js/array/is-array";
import { extractRefSchema } from "json-rules-engine-simplified/lib/utils";
import env from "./env";
import isEqualWith from "lodash/isEqualWith";

/** Cloned from @rjsf/utils v5 to make it work in older rjsf versions
 *
 * @param a - The first element to compare
 * @param b - The second element to compare
 * @returns - True if the `a` and `b` are deeply equal, false otherwise
 */
export const deepEquals = (a, b) => {
  return isEqualWith(a, b, (obj, other) => {
    if (typeof obj === "function" && typeof other === "function") {
      // Assume all functions are equivalent
      // see https://github.com/rjsf-team/react-jsonschema-form/issues/255
      return true;
    }
    return undefined; // fallback to default isEquals behavior
  });
};

export const toArray = field => {
  if (_Array$isArray(field)) {
    return field;
  } else {
    return [field];
  }
};
export const toError = message => {
  if (env.isDevelopment()) {
    throw new ReferenceError(message);
  } else {
    logWarning(message);
  }
};
export const logWarning = message => {
  console.warn(message);
};

/**
 * Find relevant schema for the field
 * @returns { field: "string", schema: "object" } relevant field and schema
 */
export const findRelSchemaAndField = (field, schema) => {
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
    refSchema = extractRefSchema(parentField, schema);
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
export function findRelUiSchema(field, uiSchema) {
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