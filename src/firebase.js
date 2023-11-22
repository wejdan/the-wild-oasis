// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
const firebaseConfig = {
  apiKey: "AIzaSyDg_z1IXwDXzwirQ-RZHr3Oq_dmEGUavWM",
  authDomain: "the-wild-oasis-ea54c.firebaseapp.com",
  projectId: "the-wild-oasis-ea54c",
  storageBucket: "the-wild-oasis-ea54c.appspot.com",
  messagingSenderId: "805326384045",
  appId: "1:805326384045:web:257d0d3490fb4013438f24",
  measurementId: "G-4RCJFFP7T4",
};

const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);
export const database = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const auth = getAuth(app);
