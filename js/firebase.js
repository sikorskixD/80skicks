import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAln8N9nwUBlFMM1Pw-IygBZUyDEpiqvBQ",
    authDomain: "website-17f5f.firebaseapp.com",
    projectId: "website-17f5f",
    storageBucket: "website-17f5f.firebasestorage.app",
    messagingSenderId: "71041950507",
    appId: "1:71041950507:web:45ad6eaa4073fc45a61b6e",
    measurementId: "G-N19SS25B2F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };