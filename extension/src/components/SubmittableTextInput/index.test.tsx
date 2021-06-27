import React from 'react';
import SubmittableTextInput from './index';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom';
import { SubmittableTextInputProps } from './index';

describe('SubmittableTextInput', () => {
  const mockSubmitFn = jest.fn(input => Promise.resolve(input));
  const testLabel = 'foo';

  const testProps: SubmittableTextInputProps = {
    labelText: testLabel,
    submitFn: mockSubmitFn
  };

  test('displays passed in label', () => {
    const { getByLabelText } = render(
      <SubmittableTextInput {...testProps}/>
    );

    expect(getByLabelText(new RegExp(testProps.labelText))).toBeInTheDocument();
  });

  test('calls feedbackSubmissionFn with input text on click', () => {
    const { getByLabelText } = render(
      <SubmittableTextInput {...testProps} />
    );
    const testUserInput = 'my cool input';

    userEvent.type(getByLabelText(new RegExp(testProps.labelText)), testUserInput)
      .then(() => {
        userEvent.click(screen.getByText('Submit'));

        expect(mockSubmitFn).toHaveReturnedTimes(1);
        expect(mockSubmitFn).toHaveBeenCalledWith(testUserInput);
      });
  });
});
