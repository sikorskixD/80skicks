const searchFlightClubBtn = document.getElementById("searchFlightClubBtn");
const preciseFlightClubBtn = document.getElementById("preciseFlightClubBtn");
const shoeSearchInput = document.getElementById("shoeSearchInput");

const flightClubProductUrl = document.getElementById("flightClubProductUrl");
const autoFillFlightClubBtn = document.getElementById("autoFillFlightClubBtn");
const autoFillMessage = document.getElementById("autoFillMessage");

const shoeNameInput = document.getElementById("shoeName");
const imageUrlInput = document.getElementById("imageUrl");
const shoeUrlInput = document.getElementById("shoeUrl");

if (searchFlightClubBtn && shoeSearchInput) {
    searchFlightClubBtn.addEventListener("click", function () {
        const searchText = shoeSearchInput.value.trim();

        if (searchText === "") {
            alert("Type in a shoe name first.");
            return;
        }

        const flightClubUrl = "https://www.flightclub.com/catalogsearch/result?q=" + encodeURIComponent(searchText);

        window.open(flightClubUrl, "_blank");
    });

    shoeSearchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchFlightClubBtn.click();
        }
    });
}

if (preciseFlightClubBtn && shoeSearchInput) {
    preciseFlightClubBtn.addEventListener("click", function () {
        const searchText = shoeSearchInput.value.trim();

        if (searchText === "") {
            alert("Type in a shoe name first.");
            return;
        }

        const preciseSearch = `site:flightclub.com ${searchText}`;
        const googleUrl = "https://www.google.com/search?q=" + encodeURIComponent(preciseSearch);

        window.open(googleUrl, "_blank");
    });
}

if (autoFillFlightClubBtn && flightClubProductUrl) {
    autoFillFlightClubBtn.addEventListener("click", async function () {
        const productUrl = flightClubProductUrl.value.trim();

        if (productUrl === "") {
            alert("Paste a Flight Club product URL first.");
            return;
        }

        if (!productUrl.includes("flightclub.com")) {
            alert("Please paste a Flight Club URL.");
            return;
        }

        if (shoeUrlInput) {
            shoeUrlInput.value = productUrl;
        }

        if (autoFillMessage) {
            autoFillMessage.textContent = "Trying to pull shoe info...";
        }

        try {
            const apiUrl = "https://api.microlink.io/?url=" + encodeURIComponent(productUrl);
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data || data.status !== "success") {
                throw new Error("Could not pull page data.");
            }

            const title = data.data.title || "";
            const image = data.data.image?.url || "";

            if (title && shoeNameInput) {
                shoeNameInput.value = cleanFlightClubTitle(title);
            }

            if (image && imageUrlInput) {
                imageUrlInput.value = image;
            }

            if (autoFillMessage) {
                autoFillMessage.textContent = "Auto-fill complete. Check the fields before adding.";
            }

        } catch (error) {
            console.error("Auto-fill error:", error);

            if (autoFillMessage) {
                autoFillMessage.textContent = "Shoe link was filled, but name/image could not be pulled automatically.";
            }
        }
    });
}

function cleanFlightClubTitle(title) {
    return title
        .replace("| Flight Club", "")
        .replace("- Flight Club", "")
        .replace("Flight Club", "")
        .trim();
}