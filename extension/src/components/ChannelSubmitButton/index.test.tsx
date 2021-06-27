import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ChannelSubmitButton from './index';

describe('ChannelSubmitButton', () => {

  const buildMockSubmitFn = () => jest.fn(input => Promise.resolve(input));
  const buildMockGetCurrentTabUrlFn = (resultCurrentUrl: string) => jest.fn(
    (mockCallback) => mockCallback(resultCurrentUrl)
  );

  it('submits channel when clicked', async () => {
    const mockSubmitFn = buildMockSubmitFn();
    const mockGetCurrentTabUrlFn = buildMockGetCurrentTabUrlFn('www.foo.com');

    const { getByLabelText } = render(
      <ChannelSubmitButton
        channelSubmitFn={mockSubmitFn}
        getCurrentTabUrlFn={mockGetCurrentTabUrlFn}
      />
    );

    const testUserInput = 'my input channel';

    await userEvent.type(getByLabelText(new RegExp(/Channel URL/)), testUserInput);

    await act(async () => {
      userEvent.click(await screen.findByText('Submit'));
    });

    expect(mockSubmitFn).toHaveReturnedTimes(1);
    expect(mockSubmitFn).toBeCalledWith(testUserInput);
  });

  it('autofills input to youtube channel if on channel page', async () => {
    const youtubeChannelUrl = 'https://www.youtube.com/c/yousuckatcooking';

    const mockSubmitFn = buildMockSubmitFn();
    const mockGetCurrentTabUrlFn = buildMockGetCurrentTabUrlFn(youtubeChannelUrl);

    const { getByLabelText } = render(
      <ChannelSubmitButton
        channelSubmitFn={mockSubmitFn}
        getCurrentTabUrlFn={mockGetCurrentTabUrlFn}
      />
    );

    expect(screen.getByDisplayValue(youtubeChannelUrl)).toBeInTheDocument();

    await act(async () => {
      userEvent.click(await screen.findByText('Submit'));
    });

    expect(mockSubmitFn).toHaveReturnedTimes(1);
    expect(mockSubmitFn).toBeCalledWith(youtubeChannelUrl);
  });
});
