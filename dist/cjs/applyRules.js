"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormWithConditionals = void 0;
exports.default = applyRules;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utils = require("./utils");
var _rulesRunner = _interopRequireDefault(require("./rulesRunner"));
var _actions = require("./actions");
var _validateAction = _interopRequireDefault(require("./actions/validateAction"));
var _env = _interopRequireDefault(require("./env"));
const _excluded = ["formComponent", "forwardedRef", "rulesRunner", "initialSchema", "initialUiSchema"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/**
 * Intended to be used internally through applyRules(...)
 * but it also needs to be tested
 */
class FormWithConditionals extends _react.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.updateConf = this.updateConf.bind(this);
    this.updateConfCount = 0;
    this.updateConfHandler = null;
    this.state = {
      schema: props.initialSchema,
      uiSchema: props.initialUiSchema,
      formData: {}
    };
  }

  /**
   * Evaluate rules when mounted
   */
  componentDidMount() {
    this.updateConf(this.props.formData || {});
  }

  /**
   * Re-evaluate rules when form data prop changes
   * schema and uiSchema is not taken into account
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevData = prevProps.formData || {};
    const newData = this.props.formData || {};
    if (!(0, _utils.deepEquals)(prevData, newData)) {
      this.updateConf(newData);
    }
  }

  /**
   * Evaluate rules with given form data
   * which in turn can mutate schema, uiSchema, formData
   *
   * Run every update in sequence after previous promise
   * finishes
   *
   * @param formData {Object}
   * @param [changeHandler] {Function}
   */
  updateConf(formData, changeHandler) {
    this.updateConfCount += 1;

    // make sure last handler wins
    if (changeHandler != null) {
      this.updateConfHandler = changeHandler;
    }
    this.props.rulesRunner(formData).then(values => {
      this.updateConfCount -= 1;
      if (this.updateConfCount < 1) {
        if (!(0, _utils.deepEquals)(values, this.state)) {
          this.setState(values);
        }
        const maybeHandler = this.updateConfHandler;
        this.updateConfHandler = null;
        maybeHandler && maybeHandler(values);
      }
    });
  }

  /**
   * Evaluate form data changes after user input
   * https://react-jsonschema-form.readthedocs.io/en/latest/#form-data-changes
   * @param formChange {Object}
   */
  handleChange(formChange) {
    const {
      formData
    } = formChange;
    const {
      onChange
    } = this.props;
    if (!(0, _utils.deepEquals)(formData, this.state.formData)) {
      this.updateConf(formData, newValues => {
        if (onChange) {
          let updChange = _extends({}, formChange, newValues);
          onChange(updChange);
        }
      });
    } else {
      onChange && onChange(formChange);
    }
  }
  render() {
    const _this$props = this.props,
      {
        formComponent: FormComponent,
        forwardedRef,
        rulesRunner,
        initialSchema,
        initialUiSchema
      } = _this$props,
      renderProps = _objectWithoutProperties(_this$props, _excluded);

    // Assignment order is important
    let formConf = _extends({}, renderProps, this.state, {
      onChange: this.handleChange
    });
    return /*#__PURE__*/_react.default.createElement(FormComponent, _extends({
      ref: forwardedRef
    }, formConf));
  }
}
exports.FormWithConditionals = FormWithConditionals;
FormWithConditionals.propTypes = {
  formComponent: _propTypes.default.oneOfType([_propTypes.default.element, _propTypes.default.func, _propTypes.default.shape({
    render: _propTypes.default.func
  })]).isRequired,
  rulesRunner: _propTypes.default.func.isRequired,
  initialSchema: _propTypes.default.object.isRequired,
  initialUiSchema: _propTypes.default.object,
  forwardedRef: _propTypes.default.any
};

/**
 * Usage:
 * const ConditionalForm = applyRules(...)(RjsfFormComponent);
 * return <ConditionalForm formData={formData} onSubmit={handleSubmit} />
 * @param schema
 * @param uiSchema
 * @param rules
 * @param Engine
 * @param [extraActions]
 * @return {function(*): React.ForwardRefExoticComponent<React.PropsWithoutRef<{}> & React.RefAttributes<unknown>>}
 */
function applyRules(schema, uiSchema, rules, Engine) {
  let extraActions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  if (_env.default.isDevelopment()) {
    const propTypes = {
      Engine: _propTypes.default.func.isRequired,
      rules: _propTypes.default.arrayOf(_propTypes.default.shape({
        conditions: _propTypes.default.object.isRequired,
        order: _propTypes.default.number,
        event: _propTypes.default.oneOfType([_propTypes.default.shape({
          type: _propTypes.default.string.isRequired
        }), _propTypes.default.arrayOf(_propTypes.default.shape({
          type: _propTypes.default.string.isRequired
        }))])
      })).isRequired,
      extraActions: _propTypes.default.object
    };
    _propTypes.default.checkPropTypes(propTypes, {
      rules,
      Engine,
      extraActions
    }, 'props', 'rjsf-conditionals');
    rules.reduce((agg, _ref) => {
      let {
        event
      } = _ref;
      return agg.concat(event);
    }, []).forEach(_ref2 => {
      let {
        type,
        params
      } = _ref2;
      // Find associated action
      let action = extraActions[type] ? extraActions[type] : _actions.DEFAULT_ACTIONS[type];
      if (action === undefined) {
        (0, _utils.toError)(`Rule contains invalid action "${type}"`);
        return;
      }
      (0, _validateAction.default)(action, params, schema, uiSchema);
    });
  }
  const runRules = (0, _rulesRunner.default)(schema, uiSchema, rules, Engine, extraActions);
  return FormComponent => {
    return /*#__PURE__*/_react.default.forwardRef((props, ref) => {
      return /*#__PURE__*/_react.default.createElement(FormWithConditionals, _extends({
        forwardedRef: ref,
        formComponent: FormComponent,
        rulesRunner: runRules,
        initialSchema: schema,
        initialUiSchema: uiSchema
      }, props));
    });
  };
}