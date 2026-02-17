// Offcanvas menu toggle
const menuToggle = document.getElementById("menuToggle");
const menuOverlay = document.getElementById("menuOverlay");
const offcanvasMenu = document.getElementById("offcanvasMenu");

const openMenu = () => {
  menuOverlay.classList.remove("hidden");
  offcanvasMenu.classList.remove("hidden");
};

const closeMenu = () => {
  menuOverlay.classList.add("hidden");
  offcanvasMenu.classList.add("hidden");
};

if (menuToggle) menuToggle.addEventListener("click", openMenu);
if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);

// Hero pack selector pricing
const packSelector = document.getElementById("packSelector");
const heroPrice = document.getElementById("heroPrice");
if (packSelector && heroPrice) {
  const cards = Array.from(packSelector.querySelectorAll(".pack-card"));
  const setSelected = (card) => {
    cards.forEach((btn) => {
      const isActive = btn === card;
      btn.classList.toggle("is-selected", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
    const nextPrice = card.getAttribute("data-price");
    if (nextPrice) heroPrice.textContent = nextPrice;
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => setSelected(card));
  });
}

// Auto-scroll ingredient cards
const scrollContainer = document.querySelector(".ingredients-scroll.auto-scroll");
if (scrollContainer) {
  let isPaused = false;

  scrollContainer.addEventListener("mouseenter", () => (isPaused = true));
  scrollContainer.addEventListener("mouseleave", () => (isPaused = false));

  const step = () => {
    if (!isPaused) {
      scrollContainer.scrollLeft += 1;
      if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 2) {
        scrollContainer.scrollLeft = 0;
      }
    }
    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}
