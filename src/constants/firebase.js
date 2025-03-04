import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// const devConfig = {
//     apiKey: "AIzaSyDE_-dGUwJaNhYjRIj0H3CIamgppvUviLE",
//     authDomain: "experts-sm.firebaseapp.com",
//     databaseURL: "https://experts-sm.firebaseio.com",
//     projectId: "experts-sm",
//     storageBucket: "experts-sm.appspot.com",
//     messagingSenderId: "296690782042"
// };

const devConfig = {
  apiKey: "AIzaSyB-9sI2zff2kHF_V6fGpriD3FSTGb9AxL0",
  authDomain: "airmechcafm-training.firebaseapp.com",
  databaseURL: "https://airmechcafm-training.firebaseio.com",
  projectId: "airmechcafm-training",
  storageBucket: "airmechcafm-training.appspot.com",
  messagingSenderId: "623690321802"
};

const prodConfig = {
  apiKey: "AIzaSyB-9sI2zff2kHF_V6fGpriD3FSTGb9AxL0",
  authDomain: "airmechcafm-training.firebaseapp.com",
  databaseURL: "https://airmechcafm-training.firebaseio.com",
  projectId: "airmechcafm-training",
  storageBucket: "airmechcafm-training.appspot.com",
  messagingSenderId: "623690321802"
};

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();

export {
  auth, firebase
};