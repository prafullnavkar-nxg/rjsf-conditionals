import remove from "./remove";
import require from "./require";
import uiAppend from "./uiAppend";
import uiReplace from "./uiReplace";
import uiOverride from "./uiOverride";
export const DEFAULT_ACTIONS = {
  remove,
  require,
  uiAppend,
  uiReplace,
  uiOverride
};
export default function execute(_ref, schema, uiSchema, formData) {
  let {
    type,
    params
  } = _ref;
  let extraActions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  let action = extraActions[type] ? extraActions[type] : DEFAULT_ACTIONS[type];
  action(params, schema, uiSchema, formData);
}