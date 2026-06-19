const searchFlightClubBtn = document.getElementById("searchFlightClubBtn");
const preciseFlightClubBtn = document.getElementById("preciseFlightClubBtn");
const shoeSearchInput = document.getElementById("shoeSearchInput");

const flightClubProductUrl = document.getElementById("flightClubProductUrl");
const autoFillFlightClubBtn = document.getElementById("autoFillFlightClubBtn");
const autoFillMessage = document.getElementById("autoFillMessage");

const shoeNameInput = document.getElementById("shoeName");
const imageUrlInput = document.getElementById("imageUrl");
const shoeUrlInput = document.getElementById("shoeUrl");

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

            const badTitle =
                title.toLowerCase().includes("attention required") ||
                title.toLowerCase().includes("cloudflare");

            if (title && !badTitle && shoeNameInput) {
                shoeNameInput.value = cleanFlightClubTitle(title);
            } else if (shoeNameInput) {
                shoeNameInput.value = makeNameFromFlightClubUrl(productUrl);
            }

            if (image && imageUrlInput) {
                imageUrlInput.value = image;
                autoFillMessage.textContent = "Auto-fill complete. Check the fields before adding.";
            } else {
                autoFillMessage.textContent = "Shoe name/link filled, but image could not be pulled because Flight Club blocked the page preview.";
            }

        } catch (error) {
            console.error("Auto-fill error:", error);

            if (shoeNameInput) {
                shoeNameInput.value = makeNameFromFlightClubUrl(productUrl);
            }

            if (autoFillMessage) {
                autoFillMessage.textContent = "Shoe name/link filled, but image could not be pulled automatically.";
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

function makeNameFromFlightClubUrl(url) {
    try {
        const urlObject = new URL(url);
        let slug = urlObject.pathname.split("/").filter(Boolean).pop();

        if (!slug) {
            return "";
        }

        slug = slug.replace(/-\d+$/, "");

        return slug
            .split("-")
            .map(function (word) {
                if (word.toLowerCase() === "og") return "OG";
                if (word.toLowerCase() === "ps") return "PS";
                if (word.toLowerCase() === "gs") return "GS";
                if (word.toLowerCase() === "td") return "TD";
                if (word.toLowerCase() === "air") return "Air";
                if (word.toLowerCase() === "jordan") return "Jordan";

                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
    } catch (error) {
        console.error("URL name cleanup error:", error);
        return "";
    }
}