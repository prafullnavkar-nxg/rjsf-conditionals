"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rulesRunner;
exports.normRules = normRules;
var _actions = _interopRequireDefault(require("./actions"));
var _deepcopy = _interopRequireDefault(require("deepcopy"));
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function doRunRules(engine, formData, schema, uiSchema) {
  let extraActions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  let schemaCopy = (0, _deepcopy.default)(schema);
  let uiSchemaCopy = (0, _deepcopy.default)(uiSchema);
  let formDataCopy = (0, _deepcopy.default)(formData);
  let res = engine.run(formData).then(result => {
    let events;
    if (Array.isArray(result)) {
      events = result;
    } else if (typeof result === 'object' && result.events && Array.isArray(result.events)) {
      events = result.events;
    } else {
      throw new Error("Unrecognized result from rules engine");
    }
    events.forEach(event => (0, _actions.default)(event, schemaCopy, uiSchemaCopy, formDataCopy, extraActions));
  });
  return res.then(() => {
    return {
      schema: schemaCopy,
      uiSchema: uiSchemaCopy,
      formData: formDataCopy
    };
  });
}
function normRules(rules) {
  return rules.sort(function (a, b) {
    if (a.order === undefined) {
      return b.order === undefined ? 0 : 1;
    }
    return b.order === undefined ? -1 : a.order - b.order;
  });
}
function rulesRunner(schema, uiSchema, rules, engine, extraActions) {
  engine = typeof engine === "function" ? new engine([], schema) : engine;
  normRules(rules).forEach(rule => engine.addRule(rule));
  return formData => {
    if (formData === undefined || formData === null) {
      return Promise.resolve({
        schema,
        uiSchema,
        formData
      });
    }
    return doRunRules(engine, formData, schema, uiSchema, extraActions).then(conf => {
      if ((0, _utils.deepEquals)(conf.formData, formData)) {
        return conf;
      } else {
        return doRunRules(engine, conf.formData, schema, uiSchema, extraActions);
      }
    });
  };
}