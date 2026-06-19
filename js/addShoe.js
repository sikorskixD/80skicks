import { db, auth, provider } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const ADMIN_EMAIL = "adriangsikorski@gmail.com";

const shoeForm = document.querySelector("#shoeForm");
const formMessage = document.querySelector("#formMessage");
const loginButton = document.querySelector("#loginButton");
const logoutButton = document.querySelector("#logoutButton");
const adminStatus = document.querySelector("#adminStatus");

loginButton.addEventListener("click", async function() {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login error:", error);
        adminStatus.textContent = "Login failed. Check the console.";
    }
});

logoutButton.addEventListener("click", async function() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout error:", error);
    }
});

onAuthStateChanged(auth, function(user) {
    if (user && user.email === ADMIN_EMAIL) {
        shoeForm.classList.remove("hidden");
        loginButton.style.display = "none";
        logoutButton.style.display = "inline-block";
        adminStatus.textContent = "Signed in as admin.";
    } else {
        shoeForm.classList.add("hidden");
        loginButton.style.display = "inline-block";
        logoutButton.style.display = "none";

        if (user) {
            adminStatus.textContent = "You are signed in, but this account is not allowed to add shoes.";
        } else {
            adminStatus.textContent = "You must sign in to add shoes.";
        }
    }
});

shoeForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const user = auth.currentUser;

    if (!user || user.email !== ADMIN_EMAIL) {
        formMessage.textContent = "You are not allowed to add shoes.";
        return;
    }

    const shoeName = document.querySelector("#shoeName").value.trim();
    const imageUrl = document.querySelector("#imageUrl").value.trim();
    const shoeUrl = document.querySelector("#shoeUrl").value.trim();
    const category = document.querySelector("#category").value;

    try {
        await addDoc(collection(db, "shoes"), {
            name: shoeName,
            imageUrl: imageUrl,
            stockxUrl: shoeUrl,
            category: category,
            createdAt: serverTimestamp()
        });

        formMessage.textContent = "Shoe added successfully.";
        shoeForm.reset();

    } catch (error) {
        console.error("Error adding shoe:", error);
        formMessage.textContent = "Something went wrong. Check the console.";
    }
});
