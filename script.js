/* =========================================================
   SM GAMING
   Main JavaScript
========================================================= */

"use strict";

/* =========================================================
   GAME DATA
========================================================= */

const games = [
  {
    title: "Neon Drift",
    slug: "neon-drift",
    category: "Racing",
    icon: "🏎️",
    description:
      "Push your reflexes to the limit and master high-speed neon racing."
  },
  {
    title: "Space Defender",
    slug: "space-defender",
    category: "Action",
    icon: "🚀",
    description:
      "Defend your ship and survive waves of enemies from deep space."
  },
  {
    title: "Block Blast",
    slug: "block-blast",
    category: "Puzzle",
    icon: "🧱",
    description:
      "Clear blocks, create combos and challenge your puzzle-solving skills."
  },
  {
    title: "Ninja Dash",
    slug: "ninja-dash",
    category: "Arcade",
    icon: "🥷",
    description:
      "Run, jump and dodge obstacles in a fast arcade adventure."
  },
  {
    title: "Goal Master",
    slug: "goal-master",
    category: "Sports",
    icon: "⚽",
    description:
      "Take your best shots and become the master of the goal."
  },
  {
    title: "Candy Match",
    slug: "candy-match",
    category: "Puzzle",
    icon: "🍬",
    description:
      "Match colorful candies and complete satisfying puzzle challenges."
  },
  {
    title: "Tower Guard",
    slug: "tower-guard",
    category: "Strategy",
    icon: "🏰",
    description:
      "Defend your tower, plan your moves and stop incoming enemies."
  },
  {
    title: "Zombie Escape",
    slug: "zombie-escape",
    category: "Action",
    icon: "🧟",
    description:
      "Escape dangerous zombies and survive as long as you can."
  },
  {
    title: "Speed Racer",
    slug: "speed-racer",
    category: "Racing",
    icon: "🏁",
    description:
      "Race through challenging tracks and chase your fastest time."
  },
  {
    title: "Galaxy Shooter",
    slug: "galaxy-shooter",
    category: "Action",
    icon: "👾",
    description:
      "Blast enemies and protect the galaxy in this classic shooter."
  },
  {
    title: "Color Switch",
    slug: "color-switch",
    category: "Arcade",
    icon: "🎨",
    description:
      "React quickly and switch through colors without making mistakes."
  },
  {
    title: "Word Quest",
    slug: "word-quest",
    category: "Puzzle",
    icon: "🔤",
    description:
      "Solve words, discover hidden answers and complete each challenge."
  },
  {
    title: "Penalty Pro",
    slug: "penalty-pro",
    category: "Sports",
    icon: "🥅",
    description:
      "Step up for the penalty and try to score the perfect goal."
  },
  {
    title: "Merge Kingdom",
    slug: "merge-kingdom",
    category: "Strategy",
    icon: "👑",
    description:
      "Build and expand your kingdom by combining useful resources."
  },
  {
    title: "Fruit Slice",
    slug: "fruit-slice",
    category: "Arcade",
    icon: "🍉",
    description:
      "Slice falling fruit and test your speed and reaction time."
  },
  {
    title: "Car Rush",
    slug: "car-rush",
    category: "Racing",
    icon: "🚗",
    description:
      "Drive fast, avoid obstacles and survive the endless road."
  },
  {
    title: "Bubble Pop",
    slug: "bubble-pop",
    category: "Puzzle",
    icon: "🫧",
    description:
      "Pop matching bubbles and clear the board with clever moves."
  },
  {
    title: "Battle Arena",
    slug: "battle-arena",
    category: "Action",
    icon: "⚔️",
    description:
      "Enter the arena and take on challenging opponents."
  },
  {
    title: "Basketball Shot",
    slug: "basketball-shot",
    category: "Sports",
    icon: "🏀",
    description:
      "Aim carefully and score as many basketball shots as possible."
  },
  {
    title: "Memory Match",
    slug: "memory-match",
    category: "Puzzle",
    icon: "🧠",
    description:
      "Remember the cards and find matching pairs."
  },
  {
    title: "Highway Chase",
    slug: "highway-chase",
    category: "Racing",
    icon: "🚓",
    description:
      "Chase through traffic and survive the high-speed highway."
  },
  {
    title: "Dungeon Run",
    slug: "dungeon-run",
    category: "Adventure",
    icon: "🗝️",
    description:
      "Explore a dangerous dungeon and find your way through."
  },
  {
    title: "Chess Lite",
    slug: "chess-lite",
    category: "Strategy",
    icon: "♟️",
    description:
      "Enjoy a simple chess experience and think several moves ahead."
  },
  {
    title: "Flappy Rocket",
    slug: "flappy-rocket",
    category: "Arcade",
    icon: "🚀",
    description:
      "Fly your rocket through obstacles and chase a new high score."
  },
  {
    title: "Hexa Stack",
    slug: "hexa-stack",
    category: "Puzzle",
    icon: "🔷",
    description:
      "Place and combine shapes to clear the board."
  },
  {
    title: "Tank Strike",
    slug: "tank-strike",
    category: "Action",
    icon: "🛡️",
    description:
      "Take control of your tank and defeat incoming targets."
  },
  {
    title: "Skate Rush",
    slug: "skate-rush",
    category: "Sports",
    icon: "🛹",
    description:
      "Skate through obstacles and keep your run alive."
  },
  {
    title: "Island Builder",
    slug: "island-builder",
    category: "Strategy",
    icon: "🏝️",
    description:
      "Build your own island and carefully manage its resources."
  },
  {
    title: "Word Master",
    slug: "word-master",
    category: "Puzzle",
    icon: "📚",
    description:
      "Challenge your vocabulary and complete word-based puzzles."
  },
  {
    title: "Pixel Runner",
    slug: "pixel-runner",
    category: "Arcade",
    icon: "🏃",
    description:
      "Run through a pixel world, dodge obstacles and survive."
  },
  {
    title: "Drift King",
    slug: "drift-king",
    category: "Racing",
    icon: "🏎️",
    description:
      "Master sharp corners and become the ultimate drift king."
  },
  {
    title: "Alien Attack",
    slug: "alien-attack",
    category: "Action",
    icon: "👽",
    description:
      "Defend your world against a relentless alien invasion."
  },
  {
    title: "Pool Master",
    slug: "pool-master",
    category: "Sports",
    icon: "🎱",
    description:
      "Aim your shots and clear the table like a pool master."
  },
  {
    title: "Farm Match",
    slug: "farm-match",
    category: "Casual",
    icon: "🌾",
    description:
      "Match farm items and enjoy a relaxing casual puzzle."
  },
  {
    title: "Castle Defense",
    slug: "castle-defense",
    category: "Strategy",
    icon: "🏯",
    description:
      "Protect your castle and stop enemies from reaching the gates."
  },
  {
    title: "Maze Escape",
    slug: "maze-escape",
    category: "Puzzle",
    icon: "🌀",
    description:
      "Find your way through the maze and reach the exit."
  }
];

/* =========================================================
   STATE
========================================================= */

const FAVORITES_KEY = "sm_gaming_favorites";

let activeFilter = "all";
let searchTerm = "";
let showFavoritesOnly = false;

/* =========================================================
   DOM
========================================================= */

const gameGrid =
  document.getElementById("gameGrid");

const gameSearch =
  document.getElementById("gameSearch");

const clearSearch =
  document.getElementById("clearSearch");

const emptyGames =
  document.getElementById("emptyGames");

const resetGames =
  document.getElementById("resetGames");

const filterWrap =
  document.getElementById("filterWrap");

const mobileFilterBtn =
  document.getElementById("mobileFilterBtn");

const favoritesBtn =
  document.getElementById("favoritesBtn");

const favoriteCount =
  document.getElementById("favoriteCount");

const activeFilterInfo =
  document.getElementById("activeFilterInfo");

const navToggle =
  document.getElementById("navToggle");

const navLinks =
  document.getElementById("navLinks");

const modal =
  document.getElementById("gameModal");

const modalOverlay =
  document.getElementById("modalOverlay");

const modalClose =
  document.getElementById("modalClose");

const modalIcon =
  document.getElementById("modalIcon");

const modalCategory =
  document.getElementById("modalCategory");

const modalTitle =
  document.getElementById("modalTitle");

const modalDescription =
  document.getElementById("modalDescription");

const modalPlay =
  document.getElementById("modalPlay");

const modalFavorite =
  document.getElementById("modalFavorite");

const backToTop =
  document.getElementById("backToTop");

/* =========================================================
   FAVORITES
========================================================= */

function getFavorites() {
  try {
    const saved =
      localStorage.getItem(FAVORITES_KEY);

    if (!saved) {
      return [];
    }

    const parsed =
      JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    return [];
  }
}

function saveFavorites(favorites) {
  try {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites)
    );
  } catch (error) {
    console.warn(
      "Could not save favorites.",
      error
    );
  }
}

function isFavorite(slug) {
  return getFavorites().includes(slug);
}

function toggleFavorite(slug) {
  const favorites =
    getFavorites();

  const index =
    favorites.indexOf(slug);

  if (index === -1) {
    favorites.push(slug);
  } else {
    favorites.splice(index, 1);
  }

  saveFavorites(favorites);

  updateFavoriteCount();
  renderGames();
  updateModalFavorite(slug);
}

/* =========================================================
   FAVORITE COUNT
========================================================= */

function updateFavoriteCount() {
  const count =
    getFavorites().length;

  if (favoriteCount) {
    favoriteCount.textContent = count;
    favoriteCount.hidden = count === 0;
  }
}

/* =========================================================
   FILTER GAMES
========================================================= */

function getFilteredGames() {
  const favorites =
    getFavorites();

  const query =
    searchTerm
      .trim()
      .toLowerCase();

  return games.filter((game) => {
    const categoryMatch =
      activeFilter === "all" ||
      game.category === activeFilter;

    const favoriteMatch =
      !showFavoritesOnly ||
      favorites.includes(game.slug);

    const searchMatch =
      !query ||
      game.title
        .toLowerCase()
        .includes(query) ||
      game.category
        .toLowerCase()
        .includes(query) ||
      game.description
        .toLowerCase()
        .includes(query);

    return (
      categoryMatch &&
      favoriteMatch &&
      searchMatch
    );
  });
}

/* =========================================================
   CREATE GAME CARD
========================================================= */

function createGameCard(game) {
  const favorite =
    isFavorite(game.slug);

  const article =
    document.createElement("article");

  article.className = "game-card";
  article.dataset.game = game.slug;

  article.innerHTML = `
    <div class="game-card-visual">

      <span class="game-category">
        ${escapeHTML(game.category)}
      </span>

      <button
        type="button"
        class="game-favorite ${favorite ? "active" : ""}"
        data-favorite="${escapeHTML(game.slug)}"
        aria-label="${favorite ? "Remove from favorites" : "Add to favorites"}"
        aria-pressed="${favorite}"
      >
        <i
          class="${favorite ? "fas" : "far"} fa-heart"
          aria-hidden="true"
        ></i>
      </button>

      <span
        class="game-icon"
        aria-hidden="true"
      >
        ${game.icon}
      </span>

    </div>

    <div class="game-card-body">

      <h3>
        ${escapeHTML(game.title)}
      </h3>

      <p>
        ${escapeHTML(game.description)}
      </p>

      <div class="game-card-footer">

        <span class="game-play">
          <i
            class="fas fa-play"
            aria-hidden="true"
          ></i>
          Play Now
        </span>

        <span class="game-type">
          ${escapeHTML(game.category)}
        </span>

      </div>

    </div>
  `;

  return article;
}

/* =========================================================
   RENDER GAMES
========================================================= */

function renderGames() {
  if (!gameGrid) {
    return;
  }

  const filteredGames =
    getFilteredGames();

  gameGrid.innerHTML = "";

  filteredGames.forEach((game) => {
    gameGrid.appendChild(
      createGameCard(game)
    );
  });

  if (emptyGames) {
    emptyGames.hidden =
      filteredGames.length !== 0;
  }

  updateActiveFilterUI();
  updateActiveFilterInfo();
}

/* =========================================================
   ACTIVE FILTER UI
========================================================= */

function updateActiveFilterUI() {
  const buttons =
    document.querySelectorAll(
      ".filter-btn"
    );

  buttons.forEach((button) => {
    const filter =
      button.dataset.filter;

    button.classList.toggle(
      "active",
      !showFavoritesOnly &&
      filter === activeFilter
    );
  });

  if (favoritesBtn) {
    favoritesBtn.classList.toggle(
      "active",
      showFavoritesOnly
    );

    favoritesBtn.setAttribute(
      "aria-pressed",
      String(showFavoritesOnly)
    );
  }
}

/* =========================================================
   ACTIVE FILTER INFO
========================================================= */

function updateActiveFilterInfo() {
  if (!activeFilterInfo) {
    return;
  }

  if (showFavoritesOnly) {
    activeFilterInfo.hidden = false;
    activeFilterInfo.textContent =
      "Showing your favorite games";
    return;
  }

  if (searchTerm.trim()) {
    activeFilterInfo.hidden = false;
    activeFilterInfo.textContent =
      `Search results for "${searchTerm.trim()}"`;
    return;
  }

  if (activeFilter !== "all") {
    activeFilterInfo.hidden = false;
    activeFilterInfo.textContent =
      `Showing ${activeFilter} games`;
    return;
  }

  activeFilterInfo.hidden = true;
}

/* =========================================================
   SET FILTER
========================================================= */

function setFilter(filter) {
  activeFilter =
    filter || "all";

  showFavoritesOnly = false;

  renderGames();
}

/* =========================================================
   OPEN GAME MODAL
========================================================= */

function openGameModal(slug) {
  const game =
    games.find(
      (item) =>
        item.slug === slug
    );

  if (!game || !modal) {
    return;
  }

  if (modalIcon) {
    modalIcon.textContent =
      game.icon;
  }

  if (modalCategory) {
    modalCategory.textContent =
      game.category.toUpperCase();
  }

  if (modalTitle) {
    modalTitle.textContent =
      game.title;
  }

  if (modalDescription) {
    modalDescription.textContent =
      game.description;
  }

  if (modalPlay) {
    modalPlay.href =
      `games/${game.slug}/index.html`;

    modalPlay.dataset.slug =
      game.slug;
  }

  updateModalFavorite(game.slug);

  modal.classList.add("open");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

  setTimeout(() => {
    if (modalClose) {
      modalClose.focus();
    }
  }, 50);
}

/* =========================================================
   MODAL FAVORITE
========================================================= */

function updateModalFavorite(slug) {
  if (!modalFavorite) {
    return;
  }

  const favorite =
    isFavorite(slug);

  modalFavorite.dataset.slug =
    slug;

  modalFavorite.innerHTML = `
    <i
      class="${favorite ? "fas" : "far"} fa-heart"
      aria-hidden="true"
    ></i>
    ${favorite ? "Favorited" : "Favorite"}
  `;

  modalFavorite.setAttribute(
    "aria-pressed",
    String(favorite)
  );
}

/* =========================================================
   CLOSE MODAL
========================================================= */

function closeGameModal() {
  if (!modal) {
    return;
  }

  modal.classList.remove("open");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";
}

/* =========================================================
   NAVIGATION
========================================================= */

function toggleMobileNav() {
  if (!navLinks || !navToggle) {
    return;
  }

  const open =
    navLinks.classList.toggle("show");

  navToggle.setAttribute(
    "aria-expanded",
    String(open)
  );

  navToggle.setAttribute(
    "aria-label",
    open
      ? "Close menu"
      : "Open menu"
  );

  navToggle.innerHTML = open
    ? `<i class="fas fa-xmark" aria-hidden="true"></i>`
    : `<i class="fas fa-bars" aria-hidden="true"></i>`;
}

function closeMobileNav() {
  if (!navLinks || !navToggle) {
    return;
  }

  navLinks.classList.remove("show");

  navToggle.setAttribute(
    "aria-expanded",
    "false"
  );

  navToggle.setAttribute(
    "aria-label",
    "Open menu"
  );

  navToggle.innerHTML =
    `<i class="fas fa-bars" aria-hidden="true"></i>`;
}

/* =========================================================
   SEARCH
========================================================= */

function handleSearch() {
  searchTerm =
    gameSearch
      ? gameSearch.value
      : "";

  if (clearSearch) {
    clearSearch.hidden =
      !searchTerm.length;
  }

  renderGames();
}

/* =========================================================
   RESET
========================================================= */

function resetGamesView() {
  activeFilter = "all";
  searchTerm = "";
  showFavoritesOnly = false;

  if (gameSearch) {
    gameSearch.value = "";
  }

  if (clearSearch) {
    clearSearch.hidden = true;
  }

  if (filterWrap) {
    filterWrap.classList.remove("open");
  }

  renderGames();
}

/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================================================
   EVENT DELEGATION - GAME GRID
========================================================= */

if (gameGrid) {
  gameGrid.addEventListener(
    "click",
    (event) => {
      const favoriteButton =
        event.target.closest(
          "[data-favorite]"
        );

      if (favoriteButton) {
        event.stopPropagation();

        toggleFavorite(
          favoriteButton.dataset.favorite
        );

        return;
      }

      const card =
        event.target.closest(
          ".game-card"
        );

      if (card) {
        openGameModal(
          card.dataset.game
        );
      }
    }
  );
}

/* =========================================================
   FILTER BUTTONS
========================================================= */

document
  .querySelectorAll(".filter-btn")
  .forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        setFilter(
          button.dataset.filter
        );

        if (filterWrap) {
          filterWrap.classList.remove(
            "open"
          );
        }
      }
    );
  });

/* =========================================================
   CATEGORY BUTTONS
========================================================= */

document
  .querySelectorAll("[data-category]")
  .forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        const category =
          button.dataset.category;

        setFilter(category);

        const gamesSection =
          document.getElementById("games");

        if (gamesSection) {
          gamesSection.scrollIntoView({
            behavior: "smooth"
          });
        }
      }
    );
  });

/* =========================================================
   FEATURED GAME
========================================================= */

document
  .querySelectorAll("[data-game]")
  .forEach((element) => {
    if (
      element.classList.contains(
        "game-card"
      )
    ) {
      return;
    }

    element.addEventListener(
      "click",
      () => {
        openGameModal(
          element.dataset.game
        );
      }
    );
  });

/* =========================================================
   MODAL EVENTS
========================================================= */

if (modalClose) {
  modalClose.addEventListener(
    "click",
    closeGameModal
  );
}

if (modalOverlay) {
  modalOverlay.addEventListener(
    "click",
    closeGameModal
  );
}

if (modalFavorite) {
  modalFavorite.addEventListener(
    "click",
    () => {
      const slug =
        modalFavorite.dataset.slug;

      if (slug) {
        toggleFavorite(slug);
      }
    }
  );
}

if (modalPlay) {
  modalPlay.addEventListener(
    "click",
    () => {
      closeGameModal();
    }
  );
}

/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      closeGameModal();
      closeMobileNav();
    }
  }
);

/* =========================================================
   MOBILE NAV
========================================================= */

if (navToggle) {
  navToggle.addEventListener(
    "click",
    toggleMobileNav
  );
}

document
  .querySelectorAll("#navLinks a")
  .forEach((link) => {
    link.addEventListener(
      "click",
      closeMobileNav
    );
  });

/* =========================================================
   FAVORITES NAV
========================================================= */

if (favoritesBtn) {
  favoritesBtn.addEventListener(
    "click",
    () => {
      showFavoritesOnly =
        !showFavoritesOnly;

      if (showFavoritesOnly) {
        activeFilter = "all";
      }

      renderGames();

      const gamesSection =
        document.getElementById("games");

      if (
        gamesSection &&
        showFavoritesOnly
      ) {
        gamesSection.scrollIntoView({
          behavior: "smooth"
        });
      }
    }
  );
}

/* =========================================================
   SEARCH EVENTS
========================================================= */

if (gameSearch) {
  gameSearch.addEventListener(
    "input",
    handleSearch
  );
}

if (clearSearch) {
  clearSearch.addEventListener(
    "click",
    () => {
      if (gameSearch) {
        gameSearch.value = "";
      }

      handleSearch();

      if (gameSearch) {
        gameSearch.focus();
      }
    }
  );
}

/* =========================================================
   MOBILE FILTER
========================================================= */

if (mobileFilterBtn) {
  mobileFilterBtn.addEventListener(
    "click",
    () => {
      if (filterWrap) {
        filterWrap.classList.toggle(
          "open"
        );
      }
    }
  );
}

/* =========================================================
   RESET BUTTON
========================================================= */

if (resetGames) {
  resetGames.addEventListener(
    "click",
    resetGamesView
  );
}

/* =========================================================
   BACK TO TOP
========================================================= */

window.addEventListener(
  "scroll",
  () => {
    if (!backToTop) {
      return;
    }

    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  },
  {
    passive: true
  }
);

if (backToTop) {
  backToTop.addEventListener(
    "click",
    () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  );
}

/* =========================================================
   INITIALIZE
========================================================= */

updateFavoriteCount();
renderGames();
