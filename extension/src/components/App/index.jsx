import React from 'react';
import FeedbackButton from '../FeedbackButton';
import SignInButton from '../SignInButton';
import ChannelSubmitButton from '../ChannelSubmitButton';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { authToFirebase } from '../authentication';

const submitFeedbackFn = (userUID, feedbackString) =>
  firebase.firestore()
    .doc(`feedback/${userUID}`)
    .set({
      feedbackMessage: feedbackString,
      submissionTime: new firebase.firestore.Timestamp.now()
    });

const submitChannel = newChannelUrl => {
  return new Promise((resolve, reject) => {
    if (newChannelUrl) {
      console.log('Received new channel submission: ', newChannelUrl);

      const myHeaders = new Headers({
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      });
      const baseURL =
        'https://us-central1-tube-hunt.cloudfunctions.net/app/api/channel/submit';

      fetch(baseURL, {
        method: 'post',
        headers: myHeaders,
        body: `url=${newChannelUrl}`,
      })
        .then(JSON)
        .then(function (data) {
          if (data.status === 200) {
            console.log('Channel submit successful', data);
            resolve();
          } else {
            console.log('Channel submit failed', data);
            reject();
          }
        })
        .catch(function (error) {
          console.log('Request Failed', error);
          reject();
        });
    }
  });
};

const getCurrentChromeTabUrl = (callback) => {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    tabs => {
      const currentTabUrl = tabs[0].url;
      callback(currentTabUrl);
    }
  );
};

const App = () => (
  <div>
    <SignInButton authFn={authToFirebase} />
    <ChannelSubmitButton
      getCurrentTabUrlFn={getCurrentChromeTabUrl}
      channelSubmitFn={submitChannel}/>
    <FeedbackButton handleFeedbackSubmitFn={submitFeedbackFn} />
  </div>
);

export default App;
