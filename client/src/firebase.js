// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-31a9f.firebaseapp.com",
  projectId: "real-estate-31a9f",
  storageBucket: "real-estate-31a9f.appspot.com",
  messagingSenderId: "709719649209",
  appId: "1:709719649209:web:9d7a72db162fd2acc26468",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
