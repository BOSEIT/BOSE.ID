import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- Tambahan untuk Firestore (db)

const firebaseConfig = {

  apiKey: "AIzaSyBOXDMIGsNN2mOgSR82ifw4sgl21YlrJGA",

  authDomain: "bose-4f566.firebaseapp.com",

  projectId: "bose-4f566",

  storageBucket: "bose-4f566.firebasestorage.app",

  messagingSenderId: "432800263295",

  appId: "1:432800263295:web:36b3d54a930a445184234a",

  measurementId: "G-YS0HYGZ8YG"

};

// Mencegah inisialisasi ganda di Next.js
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Inisialisasi layanan Firebase
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app); // <-- Inisialisasi Firestore

export { auth, googleProvider, db }; // <-- Export db agar bisa dipakai di halaman Account