// src/auth/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBD3NchEw-qJcMFQeIpO2EkMri0ul3pHgE",
  authDomain: "martialmarket-e1bcf.firebaseapp.com",
  projectId: "martialmarket-e1bcf",
  storageBucket: "martialmarket-e1bcf.appspot.com",
  messagingSenderId: "649072722584",
  appId: "1:649072722584:web:299bfb7db7e45b8eee06ed",
  measurementId: "G-RFVLPP2V0K"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app); 

export { auth, googleProvider, db };
