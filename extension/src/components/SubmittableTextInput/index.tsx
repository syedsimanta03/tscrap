import React, { useState } from 'react';

export type SubmittableTextInputProps =
  StandardSubmittableTextProps | OverridableSubmittableTextProps

type StandardSubmittableTextProps = {
  labelText: string;
  submitFn: (newValue: string) => Promise<void>;
}

type OverridableSubmittableTextProps = {
  overrideValue: string;
  overrideChangeHandler: (newValue: string) => void;
} & StandardSubmittableTextProps

const SubmittableTextInput = (props: SubmittableTextInputProps): JSX.Element => {

  const isOverride = (props): props is OverridableSubmittableTextProps =>
    'overrideValue' in props;

  const [textInput, setTextInput] = useState<string>(() => (
    isOverride(props) ? props.overrideValue : ''
  ));

  return (
    <div>
      <label htmlFor={'primaryTextField'}>{props.labelText}</label>
      <input
        id={'primaryTextField'}
        type='text'
        value={isOverride(props) ? props.overrideValue : textInput}
        onChange={e => {
          setTextInput(e.target.value);
          if('overrideChangeHandler' in props) {
            props.overrideChangeHandler(e.target.value);
          }
        }}
      />
      <button onClick={() =>
        isOverride(props) ?
          props.submitFn(props.overrideValue) :
          props.submitFn(textInput)}>Submit</button>
    </div>
  );
};

export default SubmittableTextInput;
