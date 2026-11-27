const toggle = document.getElementById("nav-toggle");
const sidebar = document.getElementById("sidebar");
const links = sidebar.querySelectorAll("nav a");

// ---- Mobile: open / close the sidebar ----
function setMenu(open) {
    sidebar.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

toggle.addEventListener("click", () => setMenu(!sidebar.classList.contains("open")));

// Clicking any entry (including Back to Top) scrolls there and closes the menu
sidebar.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
});

// ---- Highlight the section currently in view ----
const sections = [...links].map((a) => document.querySelector(a.getAttribute("href")));

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`)
        );
    });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach((s) => observer.observe(s));
