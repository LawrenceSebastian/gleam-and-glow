import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, inMemoryPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpd6-UqtYsa-HeTnA1tgw833Fxd5Bsacw",
  authDomain: "lilac-bloom.firebaseapp.com",
  projectId: "lilac-bloom",
  storageBucket: "lilac-bloom.firebasestorage.app",
  messagingSenderId: "360441557357",
  appId: "1:360441557357:web:2935de2d2914ca5ccf2a64",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔒 Make auth session last only until tab is closed
setPersistence(auth, inMemoryPersistence);

export { auth, db };
