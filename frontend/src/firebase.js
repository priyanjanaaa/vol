
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6lTHlrkk2lzpI0qw4koAiLWtI674WSwc",
  authDomain: "helper-e1bf6.firebaseapp.com",
  projectId: "helper-e1bf6",
  storageBucket: "helper-e1bf6.firebasestorage.app",
  messagingSenderId: "462424073870",
  appId: "1:462424073870:web:eea917fdceeda40be1cbdf",
  measurementId: "G-QX19E37XZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { auth,db };