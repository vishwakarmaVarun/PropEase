// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mern-estate-7cb2d.firebaseapp.com",
  projectId: "mern-estate-7cb2d",
  storageBucket: "mern-estate-7cb2d.appspot.com",
  messagingSenderId: "631033126736",
  appId: "1:631033126736:web:a63863ba93f5b820b59655"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);