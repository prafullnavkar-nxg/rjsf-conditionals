import React from 'react';
import Form from '@rjsf/core';
import Engine from 'json-rules-engine-simplified';
import applyRules from '../src';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { fireEvent, render } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import rulesRunner from '../src/rulesRunner';
import { FormWithConditionals } from '../src/applyRules';

/* eslint-disable no-unused-vars */

configure({ adapter: new Adapter() });

const schema = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    name: { type: 'string' }
  }
};

const RULES = [
  {
    conditions: {
      firstName: 'empty'
    },
    event: {
      type: 'remove',
      params: {
        field: ['lastName', 'name']
      }
    }
  }
];

test('Re render on rule change', async () => {

  const runRules = rulesRunner(schema, {}, RULES, Engine);

  const handleChangeSpy = sinon.spy(FormWithConditionals.prototype, 'handleChange');
  const updateConfSpy = sinon.spy(FormWithConditionals.prototype, 'updateConf');
  const setStateSpy = sinon.spy(FormWithConditionals.prototype, 'setState');

  const { container } = render(<FormWithConditionals formComponent={Form} initialSchema={schema} rulesRunner={runRules}
                                                     formData={{ firstName: 'A' }}/>);

  expect(updateConfSpy.calledOnce).toEqual(true);
  await waitFor(() => {
    // componentDidMount called updateConfSpy which will update state
    expect(setStateSpy.callCount).toEqual(1);
  });
  expect(handleChangeSpy.notCalled).toEqual(true);

  const firstNameInput = container.querySelector('[id=\'root_firstName\']');
  expect(firstNameInput).not.toBeNull();
  expect(firstNameInput.value).toEqual('A');

  fireEvent.change(firstNameInput, { target: { value: '' } });

  await waitFor(() => {
    expect(handleChangeSpy.callCount).toEqual(1);
  });
  expect(updateConfSpy.callCount).toEqual(2);
  await waitFor(() => {
    expect(setStateSpy.callCount).toEqual(2);
  });

  FormWithConditionals.prototype.handleChange.restore();
  FormWithConditionals.prototype.updateConf.restore();
  FormWithConditionals.prototype.setState.restore();
});

test('onChange called with corrected schema', () => {
  let ResForm = applyRules(schema, {}, RULES, Engine)(Form);
  const onChangeSpy = sinon.spy(() => {});
  const wrapper = mount(
    <ResForm formData={{ firstName: 'A' }} onChange={onChangeSpy}/>
  );

  wrapper
    .find('#root_firstName')
    .find('input')
    .simulate('change', { target: { value: '' } });

  return new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
    const expSchema = {
      type: 'object',
      properties: {
        firstName: { type: 'string' }
      }
    };

    expect(onChangeSpy.calledOnce).toEqual(true);
    expect(onChangeSpy.getCall(0).args[0].schema).toEqual(expSchema);
  });
});

test('chain of changes processed', async () => {

  /* eslint-disable jest/valid-expect */

  let ResForm = applyRules(schema, {}, RULES, Engine)(Form);
  const onChangeSpy = sinon.spy(() => {});
  const { container } = render(
    <ResForm formData={{ firstName: 'first' }} onChange={onChangeSpy}/>
  );
  await waitFor(() => expect(onChangeSpy.calledOnce));

  const firstNameInput = container.querySelector('[id=\'root_firstName\']');
  expect(firstNameInput).not.toBeNull();
  expect(firstNameInput.value).toEqual('first');
  const chainOfChanges = ['fir', 'fi', 'f', ''];
  chainOfChanges.forEach((inputValue) => {
    fireEvent.change(firstNameInput, {
      target: { value: inputValue }
    });
    fireEvent.blur(firstNameInput);
  });
  await waitFor(() => {
    const lastCall = onChangeSpy.getCall(-1);
    const formData = lastCall.args[0].formData || {};
    expect(formData.firstName).toBeUndefined();
  });

  expect(onChangeSpy.getCall(-1).args[0].schema).toStrictEqual({
    properties: { firstName: { type: 'string' } },
    type: 'object'
  });

  expect(firstNameInput.value).toEqual('');
});

test('can submit with forwarded ref', async () => {
  let ResForm = applyRules(schema, {}, RULES, Engine)(Form);
  const onSubmitSpy = sinon.spy(() => {});
  let formRef;
  const { container } = render(
    <ResForm formData={{ firstName: 'first' }} onSubmit={onSubmitSpy} ref={form => {formRef = form;}}/>
  );
  const firstNameInput = container.querySelector('[id=\'root_firstName\']');
  await waitFor(() => {
    expect(firstNameInput.value).toEqual('first');
  });

  formRef.submit();

  expect(onSubmitSpy.calledOnce).toEqual(true);
});

test('changes propagated in sequence regardless of function execution timings', async () => {

  const runRules = rulesRunner({
    type: 'object',
    properties: {
      a: { type: 'number' },
      b: { type: 'number' },
      c: { type: 'string' }
    }
  }, {}, [{
    conditions: { a: { greater: 0 } },
    event: { type: 'firstCall' }
  }, {
    conditions: { b: { greater: 10 } },
    event: { type: 'secondCall' }
  }], Engine, {
    firstCall: function (a, b, c, d) {
      var iterations = 10000;
      var val = 0;
      for (var i = 0; i < iterations; i++) {
        for (var j = 0; j < iterations; j++) {
          val += i * j;
        }
      }
      d.c = 'first';
    },
    secondCall: function (a, b, c, d) { d.c = 'second'; }
  });

  const handleChangeSpy = sinon.spy(FormWithConditionals.prototype, 'handleChange');
  const updateConfSpy = sinon.spy(FormWithConditionals.prototype, 'updateConf');
  const setStateSpy = sinon.spy(FormWithConditionals.prototype, 'setState');
  const onChangeSpy = sinon.spy(() => {});

  const { container } = render(<FormWithConditionals
    formComponent={Form}
    initialSchema={schema}
    rulesRunner={runRules}
    formData={{
      a: 0,
      b: 0
    }}
    onChange={onChangeSpy}
  />);

  await waitFor(() => {
    expect(updateConfSpy.callCount).toEqual(1);
  });
  expect(updateConfSpy.getCall(0).args).toEqual([{ 'a': 0, 'b': 0 }]);
  expect(setStateSpy.callCount).toEqual(1);
  expect(handleChangeSpy.notCalled).toEqual(true);

  const inputA = container.querySelector('[id=\'root_a\']');
  const inputB = container.querySelector('[id=\'root_b\']');
  const inputC = container.querySelector('[id=\'root_c\']');
  expect(inputA.value).toEqual('0');
  expect(inputB.value).toEqual('0');
  expect(inputC.value).toEqual('');

  fireEvent.change(inputA, { target: { value: '5' } });
  fireEvent.change(inputA, { target: { value: '0' } });
  fireEvent.change(inputB, { target: { value: '50' } });

  await waitFor(() => {
    expect(updateConfSpy.callCount).toEqual(3);
  });
  expect(updateConfSpy.getCall(1).args).toEqual([{ 'a': 5, 'b': 0 }, expect.anything()]);
  expect(updateConfSpy.getCall(2).args).toEqual([{ 'a': 0, 'b': 50 }, expect.anything()]);

  expect(setStateSpy.callCount).toEqual(2);

  expect(inputC.value).toEqual('second');

  expect(onChangeSpy.callCount).toEqual(2);
  expect(onChangeSpy.getCall(0).args[0].formData).toEqual({ 'a': 0, 'b': 0 });
  expect(onChangeSpy.getCall(1).args[0].formData).toEqual({ 'a': 0, 'b': 50, c: 'second' });

  FormWithConditionals.prototype.handleChange.restore();
  FormWithConditionals.prototype.updateConf.restore();
  FormWithConditionals.prototype.setState.restore();
});
