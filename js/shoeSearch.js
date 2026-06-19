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

        // Remove product number from end of Flight Club URLs
        slug = slug.replace(/-\d+$/, "");

        let words = slug
            .split("-")
            .filter(function(word) {
                return word.trim() !== "";
            });

        // Remove common filler words that mess up the naming
        const fillerWords = [
    "retro",
    "high",
    "low",
    "mid",
    "og",
    "sp",
    "se",
    "mens",
    "womens",
    "men",
    "women",
    "reimagined"
];

        // Keep words like "low" only for shoes where you actually want them in model name
        // Model detection happens before filler cleanup.

        const lowerSlug = words.join("-").toLowerCase();

        let model = "";
        let modelWordsToRemove = [];

        if (lowerSlug.includes("air-jordan-1")) {
            model = "AIR JORDAN 1";
            modelWordsToRemove = ["air", "jordan", "1"];
        } else if (lowerSlug.includes("air-jordan-2")) {
            model = "AIR JORDAN 2";
            modelWordsToRemove = ["air", "jordan", "2"];
        } else if (lowerSlug.includes("air-jordan-3")) {
            model = "AIR JORDAN 3";
            modelWordsToRemove = ["air", "jordan", "3"];
        } else if (lowerSlug.includes("air-jordan-4")) {
            model = "AIR JORDAN 4";
            modelWordsToRemove = ["air", "jordan", "4"];
        } else if (lowerSlug.includes("air-jordan-5")) {
            model = "AIR JORDAN 5";
            modelWordsToRemove = ["air", "jordan", "5"];
        } else if (lowerSlug.includes("air-jordan-6")) {
            model = "AIR JORDAN 6";
            modelWordsToRemove = ["air", "jordan", "6"];
        } else if (lowerSlug.includes("air-jordan-11")) {
            model = "AIR JORDAN 11";
            modelWordsToRemove = ["air", "jordan", "11"];
        } else if (lowerSlug.includes("air-jordan-12")) {
            model = "AIR JORDAN 12";
            modelWordsToRemove = ["air", "jordan", "12"];
        } else if (lowerSlug.includes("air-force-1")) {
            model = "AIR FORCE 1";
            modelWordsToRemove = ["air", "force", "1"];
        } else if (lowerSlug.includes("dunk-low")) {
            model = "NIKE DUNK LOW";
            modelWordsToRemove = ["nike", "dunk", "low"];
        } else if (lowerSlug.includes("dunk-high")) {
            model = "NIKE DUNK HIGH";
            modelWordsToRemove = ["nike", "dunk", "high"];
        } else if (lowerSlug.includes("yeezy-750")) {
            model = "YEEZY 750";
            modelWordsToRemove = ["yeezy", "750"];
        }

        let remainingWords = words.filter(function(word) {
    const lower = word.toLowerCase();

    const isStyleCode = /^[a-z]{2}\d{4,}$/i.test(word);
    const isYear = /^(19|20)\d{2}$/.test(word);

    return !modelWordsToRemove.includes(lower) &&
           !fillerWords.includes(lower) &&
           !isStyleCode &&
           !isYear &&
           lower !== "reimagined";
});

        const collabs = [
            {
                name: "OFF WHITE",
                words: ["off", "white"]
            },
            {
                name: "TRAVIS SCOTT",
                words: ["travis", "scott"]
            },
            {
                name: "FRAGMENT",
                words: ["fragment"]
            },
            {
                name: "UNION LA",
                words: ["union", "la"]
            },
            {
                name: "A MA MANIERE",
                words: ["a", "ma", "maniere"]
            },
            {
                name: "DOERNBECHER",
                words: ["doernbecher"]
            },
            {
                name: "CONCEPTS",
                words: ["concepts"]
            },
            {
                name: "TROPHY ROOM",
                words: ["trophy", "room"]
            },
            {
                name: "DE LA SOUL",
                words: ["de", "la", "soul"]
            },
            {
                name: "SUPREME",
                words: ["supreme"]
            },
            {
                name: "AMM",
                words: ["amm"]
            }
        ];

        let foundCollabs = [];

        collabs.forEach(function(collab) {
            const hasCollab = collab.words.every(function(collabWord) {
                return remainingWords
                    .map(function(word) {
                        return word.toLowerCase();
                    })
                    .includes(collabWord);
            });

            if (hasCollab) {
                foundCollabs.push(collab.name);

                remainingWords = remainingWords.filter(function(word) {
                    return !collab.words.includes(word.toLowerCase());
                });
            }
        });

        let colorway = remainingWords
            .map(function(word) {
                return word.toUpperCase();
            })
            .join(" ");

        let finalNameParts = [];

        if (model !== "") {
            finalNameParts.push(model);
        }

        foundCollabs.forEach(function(collab) {
            finalNameParts.push(collab);
        });

        if (colorway !== "") {
            finalNameParts.push(colorway);
        }

        return finalNameParts.join(" ").trim();

    } catch (error) {
        console.error("URL name cleanup error:", error);
        return "";
    }
}