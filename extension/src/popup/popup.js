import React from 'react'
import ReactDOM from 'react-dom'
import App from '../components/App';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

window.onload = function() {
  const firebaseConfig = {
    apiKey: 'AIzaSyCUY5bnDpFKFrHh6btLHNt5MT6PHIZBSyk',
    authDomain: 'tube-hunt.firebaseapp.com',
    databaseURL: 'https://tube-hunt.firebaseio.com',
    projectId: 'tube-hunt',
    storageBucket: 'tube-hunt.appspot.com',
    messagingSenderId: '221785724000',
    appId: '1:221785724000:web:ddb952871d9a069d549f05',
    measurementId: 'G-H7E9TDZVNB'
  };

  firebase.initializeApp(firebaseConfig);
};

document.addEventListener(
  "DOMContentLoaded",
  function () {

    // entrypoint for React is here
    ReactDOM.render(<App />, document.getElementById("app"));

    let darkMode = document.getElementById("darkMode");
    // let getChannels = document.getElementById("getChannels");
    // darkMode.addEventListener("click", function () {
    //   console.log("Made dark!");
    // });
    // Removed For now since button is no longer required
    // getChannels.addEventListener("click", function (e) {
    // e.preventDefault();
    //   const baseURL =
    //     "https://us-central1-tube-hunt.cloudfunctions.net/app/api/channels";
    //   fetch(baseURL, {
    //     method: "GET",
    //   })
    //     .then((res) => {
    //       return res.text();
    //     })
    //     .then((text) => {
    //       let jsonData = JSON.parse(text);
    //       for (let i = 0; i < jsonData.length; i++) {
    //         let item = jsonData[i];
    //         console.log(item);
    //       }
    //     });
    // });
  },
  false
);
