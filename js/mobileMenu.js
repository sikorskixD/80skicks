const hamburgerBtn = document.querySelector("#hamburgerBtn");
const primaryNav = document.querySelector(".primary-nav");

if (hamburgerBtn && primaryNav) {
    hamburgerBtn.addEventListener("click", function() {
        hamburgerBtn.classList.toggle("active");
        primaryNav.classList.toggle("menu-open");
        document.body.classList.toggle("menu-is-open");
    });
}