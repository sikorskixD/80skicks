import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const ADMIN_EMAIL = "adriangsikorski@gmail.com";

const shoesContainer = document.querySelector(".shoes");
const pageCategory = document.body.dataset.category;

let currentUser = null;

function sortShoes(shoes) {
    return shoes.sort((a, b) => {
        return a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: "base"
        });
    });
}

async function loadShoes() {
    const shoesQuery = query(
        collection(db, "shoes"),
        where("category", "==", pageCategory)
    );

    const querySnapshot = await getDocs(shoesQuery);

    let shoes = [];

    querySnapshot.forEach((document) => {
        shoes.push({
            id: document.id,
            ...document.data()
        });
    });

    shoes = sortShoes(shoes);

    shoesContainer.innerHTML = "";

    shoes.forEach((shoe) => {
        const shoeCard = document.createElement("div");
        shoeCard.classList.add("shoe");

        const moveToCategory = pageCategory === "collection" ? "future" : "collection";
        const moveButtonText = pageCategory === "collection"
            ? "MOVE TO FUTURE"
            : "MOVE TO COLLECTION";

        let adminButton = "";

        if (currentUser && currentUser.email === ADMIN_EMAIL) {
            adminButton = `
                <button class="move-shoe-btn" data-id="${shoe.id}" data-category="${moveToCategory}">
                    ${moveButtonText}
                </button>
            `;
        }

        shoeCard.innerHTML = `
            <a href="${shoe.stockxUrl}" target="_blank" class="shoe-image-box">
                <img src="${shoe.imageUrl}" alt="${shoe.name}">
            </a>
            <p>
                <a href="${shoe.stockxUrl}" target="_blank">${shoe.name}</a>
            </p>
            ${adminButton}
        `;

        shoesContainer.appendChild(shoeCard);
    });

    addMoveButtonEvents();
    animateShoes();
}

function addMoveButtonEvents() {
    const moveButtons = document.querySelectorAll(".move-shoe-btn");

    moveButtons.forEach((button) => {
        button.addEventListener("click", async function() {
            const shoeId = button.dataset.id;
            const newCategory = button.dataset.category;

            try {
                await updateDoc(doc(db, "shoes", shoeId), {
                    category: newCategory
                });

                loadShoes();

            } catch (error) {
                console.error("Error moving shoe:", error);
                alert("Could not move shoe. Check the console.");
            }
        });
    });
}

function animateShoes() {
    const shoeCards = document.querySelectorAll(".shoe");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show-shoe");
            }
        });
    }, {
        threshold: 0.15
    });

    shoeCards.forEach((card) => {
        observer.observe(card);
    });
}

onAuthStateChanged(auth, function(user) {
    currentUser = user;
    loadShoes();
});