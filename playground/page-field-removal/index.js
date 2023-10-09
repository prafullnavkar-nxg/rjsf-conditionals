// import ReactDOM from "react-dom";
import ReactDOM from "react-dom/client";
import React from "react";
import form from "./form";
import applyRules from "../../src/applyRules";
import Form from "@rjsf/core";
import SchemaFormConfigPreview from "../js/SchemaFormConfigPreview";
import validator from "@rjsf/validator-ajv8";

let { schema, uiSchema, rules, rulesEngine, extraActions, formData } = form;

let FormToDisplay = applyRules(
  schema,
  uiSchema,
  rules,
  rulesEngine,
  extraActions
)(Form);

function App() {
  const [values, setValues] = React.useState(formData);

  const handleSubmit = () => window.alert("on submit");
  const handleChange = (changeEvent) => {
    setValues(changeEvent.formData);
    console.log("on change:", changeEvent);
  };
  const handleError = (errors) => console.log("errors:", errors);

  return (
    <div className="container mt-5 py-5">
      <div className="row">
        <div className="col-6">
          <p className="lead">
            Some of the fields here are conditional. Change values to see
            effects.
          </p>
          <FormToDisplay
            formData={formData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onError={handleError}
            validator={validator}
            showErrorList={true}
          />
        </div>

        <div className="col-6">
          <SchemaFormConfigPreview
            values={values}
            schema={schema}
            uiSchema={uiSchema}
            rules={rules}
            extraActions={extraActions}
          />
        </div>
      </div>
    </div>
  );
}

// ReactDOM.render(<App />, document.getElementById("app"));
const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
