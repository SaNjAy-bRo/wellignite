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

// Ingredients carousel — JS-driven auto-scroll + arrows + hover pause
const ingredientsTrack = document.querySelector('.ingredients-track');
const arrowLeft = document.querySelector('.carousel-arrow--left');
const arrowRight = document.querySelector('.carousel-arrow--right');

if (ingredientsTrack && arrowLeft && arrowRight) {
  let position = 0;
  let isPaused = false;
  const AUTO_SPEED = 0.6;     // auto-scroll: pixels per frame
  const ARROW_SPEED = 8;      // arrow slide: fixed pixels per frame (never changes)
  let remaining = 0;          // pixels left to travel for arrow animation
  let arrowDir = 0;           // -1 or +1
  let resumeTimer = null;

  const getHalfWidth = () => ingredientsTrack.scrollWidth / 2;

  const getCardStep = () => {
    const card = ingredientsTrack.querySelector('.ingredient-card');
    if (!card) return 320;
    const gap = parseFloat(getComputedStyle(ingredientsTrack).gap) || 32;
    return card.offsetWidth + gap;
  };

  // Pause on card hover/click
  const cards = ingredientsTrack.querySelectorAll('.ingredient-card');

  const updatePauseState = () => {
    const hasActiveCard = Array.from(cards).some(c => c.classList.contains('is-active'));
    isPaused = hasActiveCard; // This will stop auto-scroll in the tick loop
  };

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => { isPaused = true; });
    card.addEventListener('mouseleave', () => {
      const hasActiveCard = Array.from(cards).some(c => c.classList.contains('is-active'));
      if (!hasActiveCard) isPaused = false;
    });

    card.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent document click from firing immediately
      const wasActive = card.classList.contains('is-active');

      // Remove active from all others
      cards.forEach(c => c.classList.remove('is-active'));

      // Toggle current
      if (!wasActive) {
        card.classList.add('is-active');
      }

      updatePauseState();
    });
  });

  // Close active card when clicking outside
  document.addEventListener('click', () => {
    let changed = false;
    cards.forEach(c => {
      if (c.classList.contains('is-active')) {
        c.classList.remove('is-active');
        changed = true;
      }
    });
    if (changed) updatePauseState();
  });

  // Arrow click handlers
  arrowLeft.addEventListener('click', () => {
    remaining += getCardStep();  // accumulate if clicked again
    arrowDir = 1;                // move track right (scroll left)
    if (resumeTimer) clearTimeout(resumeTimer);
  });

  arrowRight.addEventListener('click', () => {
    remaining += getCardStep();  // accumulate if clicked again
    arrowDir = -1;               // move track left (scroll right)
    if (resumeTimer) clearTimeout(resumeTimer);
  });

  // Single animation loop
  const tick = () => {
    const halfW = getHalfWidth();

    if (remaining > 0) {
      // Arrow slide: move at constant fixed speed
      const step = Math.min(ARROW_SPEED, remaining);
      position += step * arrowDir;
      remaining -= step;

      // When arrow slide finishes, wait 1.5s then resume auto-scroll
      if (remaining <= 0) {
        remaining = 0;
        resumeTimer = setTimeout(() => { resumeTimer = null; }, 1500);
      }
    } else if (!isPaused && !resumeTimer) {
      // Normal auto-scroll at constant speed
      position -= AUTO_SPEED;
    }

    // Seamless loop
    if (position <= -halfW) position += halfW;
    if (position > 0) position -= halfW;

    ingredientsTrack.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
