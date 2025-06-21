// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { get } from "react-hook-form";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getEnv } from "./getEnv"; // Adjust the import path as necessary

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API'),
  authDomain: "mern-blog-87a5b.firebaseapp.com",
  projectId: "mern-blog-87a5b",
  storageBucket: "mern-blog-87a5b.firebasestorage.app",
  messagingSenderId: "543433321813",
  appId: "1:543433321813:web:1848b419782391858f53dc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export  { auth, provider };

