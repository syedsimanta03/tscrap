import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { act } from 'react-dom/test-utils';
import FeedbackButton from './index';

describe('FeedbackButton', () => {
  const feedbackCta = 'Got some feedback for us? We\'d love to hear it!';

  test('shows input area when clicked', () => {
    const { getByTestId, getByText } = render(
      <FeedbackButton
        handleFeedbackSubmitFn={() => Promise.resolve() }
      />
    );

    userEvent.click(getByTestId('feedback-icon'));

    expect(getByText(feedbackCta)).toBeInTheDocument();
  });

  test('submits feedback and closes input area after submitted', async () => {
    const mockSubmitFn = jest.fn(input => Promise.resolve(input));
    const { findByTestId, queryByText } = render(
      <FeedbackButton
        handleFeedbackSubmitFn={mockSubmitFn}
      />
    );

    await act(async () => {
      userEvent.click(await findByTestId('feedback-icon'));
      userEvent.click(await screen.findByText('Submit'));
    });

    expect(queryByText(feedbackCta)).toBeNull();
    expect(mockSubmitFn).toHaveReturnedTimes(1);
  });
});
