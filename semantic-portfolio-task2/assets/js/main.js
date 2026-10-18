// Progressive enhancements: current year, accessible theme switch, and demo form validation.
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

const root = document.documentElement;
const themeButton = document.querySelector("[data-theme-toggle]");
const storedTheme = (() => {
  try { return localStorage.getItem("portfolio-theme"); } catch { return null; }
})();
const preferredDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = storedTheme || (preferredDark ? "dark" : "light");

function setTheme(theme) {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  if (!themeButton) return;
  const dark = theme === "dark";
  themeButton.setAttribute("aria-pressed", String(dark));
  themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  const label = themeButton.querySelector("[data-theme-label]");
  const icon = themeButton.querySelector("[data-theme-icon]");
  if (label) label.textContent = dark ? "Light mode" : "Dark mode";
  if (icon) icon.textContent = dark ? "☀" : "☾";
}
setTheme(initialTheme);

if (themeButton) {
  themeButton.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("portfolio-theme", next); } catch { /* storage may be unavailable */ }
  });
}

const form = document.querySelector(".contact-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.querySelector("#form-status");
    if (!form.reportValidity()) {
      status.textContent = "Please check the highlighted fields and try again.";
      return;
    }
    status.textContent = "Thanks — this demo form is validated, but it is not connected to a message service yet.";
  });
}
