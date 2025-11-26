/* ------------------------------
   MOBILE NAVIGATION
------------------------------ */
const mobileToggle = document.getElementById("mobile-toggle");
const mobileDropdown = document.getElementById("mobile-dropdown");

mobileToggle.addEventListener("click", () => {
  const expanded = mobileToggle.getAttribute("aria-expanded") === "true" || false;
  mobileToggle.setAttribute("aria-expanded", !expanded);
  mobileDropdown.style.display = mobileDropdown.style.display === "block" ? "none" : "block";
});

/* ------------------------------
   THEME TOGGLE (DARK/LIGHT)
------------------------------ */
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  const icon = themeToggle.querySelector("i");
  if (document.body.classList.contains("light-mode")) {
    icon.classList.replace("fa-moon", "fa-sun");
  } else {
    icon.classList.replace("fa-sun", "fa-moon");
  }
});

/* ------------------------------
   REVEAL ANIMATIONS
------------------------------ */
const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  revealElements.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

/* ------------------------------
   REAL-TIME DATE & TIME
------------------------------ */
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  };

  document.getElementById("dateTimeValue").textContent =
    now.toLocaleString("en-US", options);
}

setInterval(updateDateTime, 1000);
updateDateTime();

// HAMBURGER ANIMATION
mobileToggle.addEventListener("click", () => {
  mobileToggle.classList.toggle("active");
});
