// src/services/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBD3NchEw-qJcMFQeIpO2EkMri0ul3pHgE",
  authDomain: "martialmarket-e1bcf.firebaseapp.com",
  projectId: "martialmarket-e1bcf",
  storageBucket: "martialmarket-e1bcf.firebasestorage.app",
  messagingSenderId: "649072722584",
  appId: "1:649072722584:web:299bfb7db7e45b8eee06ed",
  measurementId: "G-RFVLPP2V0K",
};

// Inicializa Firebase solo si no hay ninguna app inicializada
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Inicializa Firestore
const db = getFirestore(app);

// Inicializa Analytics solo si la app es nueva (opcional)
const analytics = !getApps().length ? getAnalytics(app) : null;

export { db, analytics };
