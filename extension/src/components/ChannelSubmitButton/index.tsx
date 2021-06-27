import React from 'react';
import SubmittableTextInput from '../SubmittableTextInput';
import { useEffect, useState } from 'react';

export interface ChannelSubmitButtonProps {
  channelSubmitFn(s: string): Promise<void>;
  getCurrentTabUrlFn(callback: (currentUrl: string) => void): void;
}

const ChannelSubmitButton = ({
  channelSubmitFn,
  getCurrentTabUrlFn
}: ChannelSubmitButtonProps): JSX.Element => {
  const [currentTabUrl, setCurrentTabUrl] = useState<string>('');

  const handleChannelSubmit = async (str: string): Promise<void> => {
    try {
      console.log(`INFO: Submitting channel: ${str}`);
      await channelSubmitFn(str);
    } catch (err) {
      console.log(`ERROR: Something went wrong submitting channel ${str}: ${err}`);
    }
  };

  useEffect(() => {
    getCurrentTabUrlFn((currentTabURL: string) => {
      const isYoutubeChannelPage = (str: string) =>
        str.match(/https:\/\/www\.youtube\.com\/(channel|c)\/.*$/);

      if (currentTabURL && isYoutubeChannelPage(currentTabURL)) {
        setCurrentTabUrl(currentTabURL);
      }
    });
  }, []);

  return (
    <div>
      <SubmittableTextInput
        labelText={'Channel URL'}
        submitFn={handleChannelSubmit}
        overrideValue={currentTabUrl}
        overrideChangeHandler={setCurrentTabUrl}
      />
    </div>
  );
};

export default ChannelSubmitButton;
