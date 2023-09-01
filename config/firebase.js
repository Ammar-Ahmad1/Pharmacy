// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDEsCFXv3gzYlg72L9Jipctzoukk6K05s",
  authDomain: "pharmacy-delivery-55ee4.firebaseapp.com",
  projectId: "pharmacy-delivery-55ee4",
  storageBucket: "pharmacy-delivery-55ee4.appspot.com",
  messagingSenderId: "645352436548",
  appId: "1:645352436548:web:fab199b9563179d6179d11",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;

// export const auth = firebase.auth();
// export const provider = new GoogleAuthProvider();
// export const FBprovider = new FacebookAuthProvider();