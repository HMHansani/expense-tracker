const KEY = "theme";
const root = document.documentElement;
const btn = document.getElementById("theme-toggle");

function apply(theme) {
  root.dataset.theme = theme;
  btn.textContent = theme === "dark" ? "☀️" : "🌙";
  document.dispatchEvent(new Event("themechange"));
}

let saved = null;
try {
  saved = localStorage.getItem(KEY);
} catch {}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
apply(saved || (prefersDark ? "dark" : "light"));

btn.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  apply(next);
  try {
    localStorage.setItem(KEY, next);
  } catch {}
});