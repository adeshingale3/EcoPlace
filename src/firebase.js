// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZJqrhbcZXOFbT2n8zD75DDXCaF_9JItw",
  authDomain: "ecoplace-2c4aa.firebaseapp.com",
  projectId: "ecoplace-2c4aa",
  storageBucket: "ecoplace-2c4aa.firebasestorage.app",
  messagingSenderId: "734328699590",
  appId: "1:734328699590:web:31237bf68eab404d7835c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };