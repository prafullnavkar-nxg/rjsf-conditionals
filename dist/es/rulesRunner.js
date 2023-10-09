import _Array$isArray from "@babel/runtime-corejs2/core-js/array/is-array";
import _Promise from "@babel/runtime-corejs2/core-js/promise";
import execute from "./actions";
import deepcopy from "deepcopy";
import { deepEquals } from './utils';
function doRunRules(engine, formData, schema, uiSchema) {
  let extraActions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  let schemaCopy = deepcopy(schema);
  let uiSchemaCopy = deepcopy(uiSchema);
  let formDataCopy = deepcopy(formData);
  let res = engine.run(formData).then(result => {
    let events;
    if (_Array$isArray(result)) {
      events = result;
    } else if (typeof result === 'object' && result.events && _Array$isArray(result.events)) {
      events = result.events;
    } else {
      throw new Error("Unrecognized result from rules engine");
    }
    events.forEach(event => execute(event, schemaCopy, uiSchemaCopy, formDataCopy, extraActions));
  });
  return res.then(() => {
    return {
      schema: schemaCopy,
      uiSchema: uiSchemaCopy,
      formData: formDataCopy
    };
  });
}
export function normRules(rules) {
  return rules.sort(function (a, b) {
    if (a.order === undefined) {
      return b.order === undefined ? 0 : 1;
    }
    return b.order === undefined ? -1 : a.order - b.order;
  });
}
export default function rulesRunner(schema, uiSchema, rules, engine, extraActions) {
  engine = typeof engine === "function" ? new engine([], schema) : engine;
  normRules(rules).forEach(rule => engine.addRule(rule));
  return formData => {
    if (formData === undefined || formData === null) {
      return _Promise.resolve({
        schema,
        uiSchema,
        formData
      });
    }
    return doRunRules(engine, formData, schema, uiSchema, extraActions).then(conf => {
      if (deepEquals(conf.formData, formData)) {
        return conf;
      } else {
        return doRunRules(engine, conf.formData, schema, uiSchema, extraActions);
      }
    });
  };
}