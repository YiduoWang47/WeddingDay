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

// ---- Countdown ----
// The moment the ceremony starts. The part after the time is the UTC offset
// where the wedding is held: +10:00 for Sydney standard time, +11:00 for
// Sydney daylight saving (roughly October to April).
const WEDDING_TIME = new Date("2027-02-20T14:20:00+11:00");   // placeholder, change me

const countdownEl = document.getElementById("countdown");
const countdownDoneEl = document.getElementById("countdown-done");
const cdDays = document.getElementById("cd-days");
const cdHours = document.getElementById("cd-hours");
const cdMinutes = document.getElementById("cd-minutes");
const cdSeconds = document.getElementById("cd-seconds");

const pad = (n) => String(n).padStart(2, "0");   // 5 -> "05"

// Returns true while there is still time left to count down
function updateCountdown() {
    const msLeft = WEDDING_TIME - Date.now();

    if (Number.isNaN(msLeft)) {            // date typed wrongly: hide it rather than show "NaN"
        countdownEl.hidden = true;
        return false;
    }
    if (msLeft <= 0) {                     // the day has arrived
        countdownEl.hidden = true;
        countdownDoneEl.hidden = false;
        return false;
    }

    const totalSeconds = Math.floor(msLeft / 1000);
    cdDays.textContent = Math.floor(totalSeconds / 86400);
    cdHours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
    cdMinutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
    cdSeconds.textContent = pad(totalSeconds % 60);
    return true;
}

function tick() {
    if (updateCountdown()) {
        // Wake up exactly at the next whole second of the clock, so the
        // display never drifts or skips
        setTimeout(tick, 1000 - (Date.now() % 1000));
    }
}
tick();

// ---- TEMPORARY: size readout for experimenting. Delete this whole block when done. ----
(function () {
    const badge = document.createElement("div");
    badge.style.cssText =
        "position:fixed; bottom:8px; left:50%; transform:translateX(-50%);" +
        "padding:6px 12px; border-radius:6px; background:rgba(0,0,0,0.75);" +
        "color:#fff; font:13px/1.4 monospace; z-index:99999; pointer-events:none;" +
        "white-space:nowrap;";
    document.body.appendChild(badge);

    // The same conditions your CSS uses, so the label matches what the CSS is doing
    const landscapePhone = window.matchMedia("(orientation: landscape)");
    const computer = window.matchMedia("(min-width: 801px)");

    function update() {
        let mode = "phone portrait";
        if (landscapePhone.matches) mode = "phone landscape"; 
        if (computer.matches) mode = "computer";

        const orientation = window.innerHeight >= window.innerWidth ? "portrait" : "landscape";
        badge.textContent =
            `${window.innerWidth} x ${window.innerHeight}px | ${orientation} | ${mode}`;
    }

    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
})();