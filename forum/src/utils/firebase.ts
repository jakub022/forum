import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCx0Dly4RHMM8N94ttcbmzrgIwn-ib_8hg",
  authDomain: "forum-1ef6f.firebaseapp.com",
  projectId: "forum-1ef6f",
  storageBucket: "forum-1ef6f.firebasestorage.app",
  messagingSenderId: "28488281223",
  appId: "1:28488281223:web:aa49b445c10959969d9c22"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth};