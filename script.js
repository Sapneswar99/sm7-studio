/* =====================================================
   SM GAMING
   MAIN JAVASCRIPT
===================================================== */

"use strict";


/* =====================================================
   GAME DATA
===================================================== */

const games = [

  {
    id: "neon-drift",
    title: "Neon Drift",
    category: "Racing",
    rating: 4.9,
    plays: "18K",
    icon: "🏎️",
    tag: "HOT",
    description:
      "Race through a glowing neon world and master your drift through challenging tracks.",
    path: "games/neon-drift/index.html"
  },

  {
    id: "space-defender",
    title: "Space Defender",
    category: "Action",
    rating: 4.8,
    plays: "16K",
    icon: "🚀",
    tag: "POPULAR",
    description:
      "Defend your ship from waves of incoming enemies in a fast arcade space battle.",
    path: "games/space-defender/index.html"
  },

  {
    id: "block-blast",
    title: "Block Blast",
    category: "Puzzle",
    rating: 4.8,
    plays: "22K",
    icon: "🧱",
    tag: "TOP",
    description:
      "Place colorful blocks, complete lines and aim for the highest score.",
    path: "games/block-blast/index.html"
  },

  {
    id: "ninja-dash",
    title: "Ninja Dash",
    category: "Arcade",
    rating: 4.7,
    plays: "14K",
    icon: "🥷",
    tag: "NEW",
    description:
      "Dash through dangerous obstacles, collect rewards and see how far you can go.",
    path: "games/ninja-dash/index.html"
  },

  {
    id: "goal-master",
    title: "Goal Master",
    category: "Sports",
    rating: 4.8,
    plays: "12K",
    icon: "⚽",
    tag: "SPORT",
    description:
      "Take the perfect shot and beat the goalkeeper in this quick football challenge.",
    path: "games/goal-master/index.html"
  },

  {
    id: "candy-match",
    title: "Candy Match",
    category: "Puzzle",
    rating: 4.6,
    plays: "11K",
    icon: "🍬",
    tag: "FUN",
    description:
      "Match colorful candies and complete increasingly challenging puzzle levels.",
    path: "games/candy-match/index.html"
  },

  {
    id: "tower-guard",
    title: "Tower Guard",
    category: "Strategy",
    rating: 4.8,
    plays: "9K",
    icon: "🏰",
    tag: "STRATEGY",
    description:
      "Build your defenses and protect your base from incoming enemies.",
    path: "games/tower-guard/index.html"
  },

  {
    id: "zombie-escape",
    title: "Zombie Escape",
    category: "Action",
    rating: 4.7,
    plays: "15K",
    icon: "🧟",
    tag: "HOT",
    description:
      "Escape the zombie zone while avoiding enemies and searching for a safe route.",
    path: "games/zombie-escape/index.html"
  },

  {
    id: "speed-racer",
    title: "Speed Racer",
    category: "Racing",
    rating: 4.7,
    plays: "13K",
    icon: "🏁",
    tag: "RACE",
    description:
      "Drive at high speed, avoid traffic and try to set a new distance record.",
    path: "games/speed-racer/index.html"
  },

  {
    id: "galaxy-shooter",
    title: "Galaxy Shooter",
    category: "Action",
    rating: 4.9,
    plays: "20K",
    icon: "👾",
    tag: "TOP",
    description:
      "Take control of your spacecraft and shoot your way through an alien invasion.",
    path: "games/galaxy-shooter/index.html"
  },

  {
    id: "color-switch",
    title: "Color Switch",
    category: "Arcade",
    rating: 4.5,
    plays: "8K",
    icon: "🎨",
    tag: "CASUAL",
    description:
      "Time your movement carefully and pass through obstacles with matching colors.",
    path: "games/color-switch/index.html"
  },

  {
    id: "word-quest",
    title: "Word Quest",
    category: "Puzzle",
    rating: 4.6,
    plays: "7K",
    icon: "🔤",
    tag: "BRAIN",
    description:
      "Find hidden words and complete vocabulary challenges across different levels.",
    path: "games/word-quest/index.html"
  },

  {
    id: "penalty-pro",
    title: "Penalty Pro",
    category: "Sports",
    rating: 4.7,
    plays: "10K",
    icon: "🥅",
    tag: "SPORT",
    description:
      "Step up for the penalty and try to score against the goalkeeper.",
    path: "games/penalty-pro/index.html"
  },

  {
    id: "merge-kingdom",
    title: "Merge Kingdom",
    category: "Strategy",
    rating: 4.8,
    plays: "8K",
    icon: "👑",
    tag: "NEW",
    description:
      "Merge resources, expand your kingdom and build a powerful empire.",
    path: "games/merge-kingdom/index.html"
  },

  {
    id: "fruit-slice",
    title: "Fruit Slice",
    category: "Arcade",
    rating: 4.6,
    plays: "13K",
    icon: "🍉",
    tag: "FUN",
    description:
      "Slice fruit quickly and avoid dangerous objects in this fast-paced arcade game.",
    path: "games/fruit-slice/index.html"
  },

  {
    id: "car-rush",
    title: "Car Rush",
    category: "Racing",
    rating: 4.6,
    plays: "9K",
    icon: "🚗",
    tag: "RACE",
    description:
      "Rush through traffic, dodge obstacles and survive as long as possible.",
    path: "games/car-rush/index.html"
  },

  {
    id: "bubble-pop",
    title: "Bubble Pop",
    category: "Puzzle",
    rating: 4.5,
    plays: "10K",
    icon: "🫧",
    tag: "CASUAL",
    description:
      "Pop groups of colorful bubbles and complete fun puzzle challenges.",
    path: "games/bubble-pop/index.html"
  },

  {
    id: "battle-arena",
    title: "Battle Arena",
    category: "Action",
    rating: 4.8,
    plays: "17K",
    icon: "⚔️",
    tag: "HOT",
    description:
      "Enter the arena and survive intense battles against challenging opponents.",
    path: "games/battle-arena/index.html"
  },

  {
    id: "basketball-shot",
    title: "Basketball Shot",
    category: "Sports",
    rating: 4.6,
    plays: "8K",
    icon: "🏀",
    tag: "SPORT",
    description:
      "Aim your shot carefully and score as many baskets as you can.",
    path: "games/basketball-shot/index.html"
  },

  {
    id: "memory-match",
    title: "Memory Match",
    category: "Puzzle",
    rating: 4.7,
    plays: "6K",
    icon: "🧠",
    tag: "BRAIN",
    description:
      "Test your memory by matching pairs of hidden cards.",
    path: "games/memory-match/index.html"
  },

  {
    id: "highway-chase",
    title: "Highway Chase",
    category: "Racing",
    rating: 4.7,
    plays: "11K",
    icon: "🚓",
    tag: "HOT",
    description:
      "Race through busy highways while avoiding traffic and dangerous obstacles.",
    path: "games/highway-chase/index.html"
  },

  {
    id: "dungeon-run",
    title: "Dungeon Run",
    category: "Action",
    rating: 4.7,
    plays: "9K",
    icon: "🗡️",
    tag: "ADVENTURE",
    description:
      "Explore a dangerous dungeon, avoid traps and survive mysterious enemies.",
    path: "games/dungeon-run/index.html"
  },

  {
    id: "chess-lite",
    title: "Chess Lite",
    category: "Strategy",
    rating: 4.9,
    plays: "12K",
    icon: "♟️",
    tag: "BRAIN",
    description:
      "Enjoy a clean and simple chess experience for quick strategic matches.",
    path: "games/chess-lite/index.html"
  },

  {
    id: "flappy-rocket",
    title: "Flappy Rocket",
    category: "Arcade",
    rating: 4.4,
    plays: "15K",
    icon: "🚀",
    tag: "FUN",
    description:
      "Guide your rocket through obstacles and see how long you can survive.",
    path: "games/flappy-rocket/index.html"
  },

  {
    id: "hexa-stack",
    title: "Hexa Stack",
    category: "Puzzle",
    rating: 4.6,
    plays: "7K",
    icon: "🔷",
    tag: "NEW",
    description:
      "Arrange colorful hexagons and solve increasingly challenging board puzzles.",
    path: "games/hexa-stack/index.html"
  },

  {
    id: "tank-strike",
    title: "Tank Strike",
    category: "Action",
    rating: 4.8,
    plays: "13K",
    icon: "💥",
    tag: "ACTION",
    description:
      "Control your tank, aim carefully and defeat opponents across the battlefield.",
    path: "games/tank-strike/index.html"
  },

  {
    id: "skate-rush",
    title: "Skate Rush",
    category: "Sports",
    rating: 4.5,
    plays: "6K",
    icon: "🛹",
    tag: "SPORT",
    description:
      "Skate through obstacles, collect points and try to beat your best score.",
    path: "games/skate-rush/index.html"
  },

  {
    id: "island-builder",
    title: "Island Builder",
    category: "Strategy",
    rating: 4.8,
    plays: "8K",
    icon: "🏝️",
    tag: "BUILD",
    description:
      "Build and expand your own island while managing resources and space.",
    path: "games/island-builder/index.html"
  },

  {
    id: "word-master",
    title: "Word Master",
    category: "Puzzle",
    rating: 4.7,
    plays: "5K",
    icon: "📚",
    tag: "BRAIN",
    description:
      "Challenge your vocabulary and find the correct words before time runs out.",
    path: "games/word-master/index.html"
  },

  {
    id: "pixel-runner",
    title: "Pixel Runner",
    category: "Arcade",
    rating: 4.7,
    plays: "10K",
    icon: "🏃",
    tag: "PIXEL",
    description:
      "Run through a colorful pixel world, jump over obstacles and collect rewards.",
    path: "games/pixel-runner/index.html"
  },

  {
    id: "drift-king",
    title: "Drift King",
    category: "Racing",
    rating: 4.9,
    plays: "16K",
    icon: "🏎️",
    tag: "TOP",
    description:
      "Master tight corners and become the king of the drift track.",
    path: "games/drift-king/index.html"
  },

  {
    id: "alien-attack",
    title: "Alien Attack",
    category: "Action",
    rating: 4.7,
    plays: "12K",
    icon: "👽",
    tag: "ALIEN",
    description:
      "Protect the planet from waves of alien enemies in a classic shooter challenge.",
    path: "games/alien-attack/index.html"
  },

  {
    id: "pool-master",
    title: "Pool Master",
    category: "Sports",
    rating: 4.8,
    plays: "9K",
    icon: "🎱",
    tag: "SPORT",
    description:
      "Aim your shots, control the cue and clear the table in this pool challenge.",
    path: "games/pool-master/index.html"
  },

  {
    id: "farm-match",
    title: "Farm Match",
    category: "Casual",
    rating: 4.5,
    plays: "6K",
    icon: "🌾",
    tag: "CASUAL",
    description:
      "Match farm-themed objects and complete relaxing casual puzzle levels.",
    path: "games/farm-match/index.html"
  },

  {
    id: "castle-defense",
    title: "Castle Defense",
    category: "Strategy",
    rating: 4.8,
    plays: "10K",
    icon: "🏯",
    tag: "DEFENSE",
    description:
      "Defend your castle, upgrade your defenses and stop every incoming wave.",
    path: "games/castle-defense/index.html"
  },

  {
    id: "maze-escape",
    title: "Maze Escape",
    category: "Puzzle",
    rating: 4.6,
    plays: "5K",
    icon: "🌀",
    tag: "BRAIN",
    description:
      "Find your way through tricky mazes and reach the exit as quickly as possible.",
    path: "games/maze-escape/index.html"
  }

];


/* =====================================================
   DOM ELEMENTS
===================================================== */

const gamesGrid =
  document.getElementById("gamesGrid");

const gameSearch =
  document.getElementById("gameSearch");

const gameSort =
  document.getElementById("gameSort");

const clearSearch =
  document.getElementById("clearSearch");

const noResults =
  document.getElementById("noResults");

const resetFilters =
  document.getElementById("resetFilters");

const favoriteFilterBtn =
  document.getElementById("favoriteFilterBtn");

const favoriteCount =
  document.getElementById("favoriteCount");

const mobileFavorites =
  document.getElementById("mobileFavorites");

const menuBtn =
  document.getElementById("menuBtn");

const mobileMenu =
  document.getElementById("mobileMenu");

const gameModal =
  document.getElementById("gameModal");

const modalOverlay =
  document.getElementById("modalOverlay");

const modalClose =
  document.getElementById("modalClose");

const modalCover =
  document.getElementById("modalCover");

const modalIcon =
  document.getElementById("modalIcon");

const modalCategory =
  document.getElementById("modalCategory");

const modalGameTitle =
  document.getElementById("modalGameTitle");

const modalRating =
  document.getElementById("modalRating");

const modalPlays =
  document.getElementById("modalPlays");

const modalDescription =
  document.getElementById("modalDescription");

const modalPlayBtn =
  document.getElementById("modalPlayBtn");

const modalFavoriteBtn =
  document.getElementById("modalFavoriteBtn");

const gameNotice =
  document.getElementById("gameNotice");

const backToTop =
  document.getElementById("backToTop");


/* =====================================================
   STATE
===================================================== */

const FAVORITES_KEY =
  "sm_gaming_favorites";

let activeCategory = "All";

let favoritesOnly = false;

let selectedGame = null;


/* =====================================================
   FAVORITES
===================================================== */

function getFavorites() {

  try {

    const saved =
      localStorage.getItem(FAVORITES_KEY);

    return saved
      ? JSON.parse(saved)
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
      "Favorites could not be saved."
    );

  }

}


function isFavorite(gameId) {

  return getFavorites().includes(gameId);

}


function toggleFavorite(gameId) {

  const favorites =
    getFavorites();

  const index =
    favorites.indexOf(gameId);


  if (index === -1) {

    favorites.push(gameId);

  } else {

    favorites.splice(index, 1);

  }


  saveFavorites(favorites);

  updateFavoriteCount();

  renderGames();

  if (
    selectedGame &&
    selectedGame.id === gameId
  ) {

    updateModalFavoriteButton();

  }

}


function updateFavoriteCount() {

  const count =
    getFavorites().length;

  favoriteCount.textContent =
    count;

}


/* =====================================================
   CATEGORY CLASS
===================================================== */

function getCoverClass(category) {

  return "cover-" +
    category.toLowerCase();

}


/* =====================================================
   FORMAT PLAYS
===================================================== */

function parsePlays(value) {

  if (!value) {
    return 0;
  }

  const number =
    parseFloat(
      String(value)
        .replace(/[^0-9.]/g, "")
    );

  if (value.includes("K")) {
    return number * 1000;
  }

  if (value.includes("M")) {
    return number * 1000000;
  }

  return number;

}


/* =====================================================
   FILTER + SORT
===================================================== */

function getVisibleGames() {

  const query =
    gameSearch.value
      .trim()
      .toLowerCase();


  let filtered =
    games.filter((game) => {

      const matchesSearch =
        game.title
          .toLowerCase()
          .includes(query) ||
        game.category
          .toLowerCase()
          .includes(query);


      const matchesCategory =
        activeCategory === "All" ||
        game.category === activeCategory;


      const matchesFavorite =
        !favoritesOnly ||
        isFavorite(game.id);


      return (
        matchesSearch &&
        matchesCategory &&
        matchesFavorite
      );

    });


  const sortType =
    gameSort.value;


  if (sortType === "rating") {

    filtered.sort(
      (a, b) =>
        b.rating - a.rating
    );

  }


  else if (sortType === "az") {

    filtered.sort(
      (a, b) =>
        a.title.localeCompare(b.title)
    );

  }


  else if (sortType === "new") {

    filtered.reverse();

  }


  else {

    filtered.sort(
      (a, b) =>
        parsePlays(b.plays) -
        parsePlays(a.plays)
    );

  }


  return filtered;

}


/* =====================================================
   RENDER GAME CARDS
===================================================== */

function renderGames() {

  const visibleGames =
    getVisibleGames();


  gamesGrid.innerHTML = "";


  if (!visibleGames.length) {

    gamesGrid.style.display = "none";

    noResults.hidden = false;

    return;

  }


  gamesGrid.style.display = "grid";

  noResults.hidden = true;


  visibleGames.forEach(
    (game) => {

      const card =
        document.createElement("article");

      card.className =
        "game-card reveal";


      const favorite =
        isFavorite(game.id);


      card.innerHTML = `

        <div
          class="game-cover ${getCoverClass(game.category)}"
        >

          <span class="game-tag">
            ${game.tag}
          </span>


          <button
            type="button"
            class="favorite-game-btn ${favorite ? "is-favorite" : ""}"
            data-favorite="${game.id}"
            aria-label="${favorite ? "Remove from favorites" : "Add to favorites"}"
            title="${favorite ? "Remove from favorites" : "Add to favorites"}"
          >

            <i class="${favorite ? "fa-solid" : "fa-regular"} fa-heart"></i>

          </button>


          <span
            class="game-icon"
            aria-hidden="true"
          >
            ${game.icon}
          </span>

        </div>


        <div class="game-card-content">

          <h3 class="game-card-title">
            ${game.title}
          </h3>


          <div class="game-card-meta">

            <span class="game-rating">
              ★ ${game.rating}
            </span>

            <span class="game-plays">
              ${game.plays} plays
            </span>

          </div>


          <div class="game-card-bottom">

            <span class="game-category">
              ${game.category}
            </span>


            <button
              type="button"
              class="game-play-button"
              data-game="${game.id}"
            >

              Play

              <i class="fa-solid fa-arrow-right"></i>

            </button>

          </div>

        </div>

      `;


      gamesGrid.appendChild(card);

    }
  );


  setupCardEvents();

  requestAnimationFrame(
    () => {

      document
        .querySelectorAll(
          ".game-card.reveal"
        )
        .forEach(
          (card) => {

            card.classList.add(
              "visible"
            );

          }
        );

    }
  );

}


/* =====================================================
   CARD EVENTS
===================================================== */

function setupCardEvents() {

  document
    .querySelectorAll(
      "[data-game]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const game =
              games.find(
                (item) =>
                  item.id ===
                  button.dataset.game
              );

            if (game) {
              openGameModal(game);
            }

          }
        );

      }
    );


  document
    .querySelectorAll(
      "[data-favorite]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          (event) => {

            event.stopPropagation();

            toggleFavorite(
              button.dataset.favorite
            );

          }
        );

      }
    );

}


/* =====================================================
   GAME MODAL
===================================================== */

function openGameModal(game) {

  selectedGame = game;


  modalGameTitle.textContent =
    game.title;

  modalCategory.textContent =
    game.category.toUpperCase();

  modalRating.textContent =
    `★ ${game.rating}`;

  modalPlays.textContent =
    `${game.plays} plays`;

  modalDescription.textContent =
    game.description;

  modalIcon.textContent =
    game.icon;


  modalCover.className =
    `modal-cover ${getCoverClass(game.category)}`;


  updateModalFavoriteButton();


  /*
    We intentionally do not automatically redirect.
    The Play button checks the configured game path.
  */

  gameNotice.innerHTML = `

    <i class="fa-solid fa-circle-info"></i>

    Game path:
    <strong>${game.path}</strong>

  `;


  gameModal.classList.add("active");

  gameModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-open"
  );

}


function closeGameModal() {

  gameModal.classList.remove(
    "active"
  );

  gameModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );

  selectedGame = null;

}


function updateModalFavoriteButton() {

  if (!selectedGame) {
    return;
  }


  const favorite =
    isFavorite(selectedGame.id);


  modalFavoriteBtn.classList.toggle(
    "is-favorite",
    favorite
  );


  modalFavoriteBtn.innerHTML = `

    <i class="${favorite ? "fa-solid" : "fa-regular"} fa-heart"></i>

    ${favorite ? "Favorited" : "Favorite"}

  `;

}


/* =====================================================
   PLAY GAME
===================================================== */

function playSelectedGame() {

  if (!selectedGame) {
    return;
  }


  /*
    Game files should exist at:
    /games/game-name/index.html
  */


  window.location.href =
    selectedGame.path;

}


/* =====================================================
   SEARCH
===================================================== */

gameSearch.addEventListener(
  "input",
  () => {

    clearSearch.style.display =
      gameSearch.value
        ? "grid"
        : "none";

    renderGames();

  }
);


clearSearch.addEventListener(
  "click",
  () => {

    gameSearch.value = "";

    clearSearch.style.display =
      "none";

    renderGames();

    gameSearch.focus();

  }
);


/* =====================================================
   SORT
===================================================== */

gameSort.addEventListener(
  "change",
  renderGames
);


/* =====================================================
   CATEGORY FILTER
===================================================== */

document
  .querySelectorAll(
    ".category-btn"
  )
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          activeCategory =
            button.dataset.category;

          favoritesOnly = false;


          document
            .querySelectorAll(
              ".category-btn"
            )
            .forEach(
              (item) =>
                item.classList.remove(
                  "active"
                )
            );


          button.classList.add(
            "active"
          );


          renderGames();

        }
      );

    }
  );


/* =====================================================
   FAVORITE FILTER
===================================================== */

function showFavoritesOnly() {

  favoritesOnly =
    !favoritesOnly;


  if (favoritesOnly) {

    activeCategory =
      "All";


    document
      .querySelectorAll(
        ".category-btn"
      )
      .forEach(
        (button) =>
          button.classList.toggle(
            "active",
            button.dataset.category ===
            "All"
          )
      );

  }


  favoriteFilterBtn.classList.toggle(
    "active",
    favoritesOnly
  );


  renderGames();

}


favoriteFilterBtn.addEventListener(
  "click",
  showFavoritesOnly
);


mobileFavorites.addEventListener(
  "click",
  () => {

    showFavoritesOnly();

    closeMobileMenu();

    document
      .getElementById("games")
      .scrollIntoView({
        behavior: "smooth"
      });

  }
);


/* =====================================================
   RESET FILTERS
===================================================== */

resetFilters.addEventListener(
  "click",
  () => {

    gameSearch.value = "";

    clearSearch.style.display =
      "none";

    gameSort.value =
      "popular";

    activeCategory =
      "All";

    favoritesOnly =
      false;


    document
      .querySelectorAll(
        ".category-btn"
      )
      .forEach(
        (button) =>
          button.classList.toggle(
            "active",
            button.dataset.category ===
            "All"
          )
      );


    favoriteFilterBtn.classList.remove(
      "active"
    );


    renderGames();

  }
);


/* =====================================================
   MOBILE MENU
===================================================== */

function closeMobileMenu() {

  mobileMenu.classList.remove(
    "active"
  );

  menuBtn.setAttribute(
    "aria-expanded",
    "false"
  );


  menuBtn.innerHTML =
    '<i class="fa-solid fa-bars"></i>';

}


menuBtn.addEventListener(
  "click",
  () => {

    const open =
      mobileMenu.classList.toggle(
        "active"
      );


    menuBtn.setAttribute(
      "aria-expanded",
      String(open)
    );


    menuBtn.innerHTML = open
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';

  }
);


document
  .querySelectorAll(
    ".mobile-menu a"
  )
  .forEach(
    (link) => {

      link.addEventListener(
        "click",
        closeMobileMenu
      );

    }
  );


/* =====================================================
   FOOTER CATEGORY LINKS
===================================================== */

document
  .querySelectorAll(
    "[data-footer-category]"
  )
  .forEach(
    (link) => {

      link.addEventListener(
        "click",
        () => {

          const category =
            link.dataset.footerCategory;


          activeCategory =
            category;

          favoritesOnly =
            false;


          document
            .querySelectorAll(
              ".category-btn"
            )
            .forEach(
              (button) =>
                button.classList.toggle(
                  "active",
                  button.dataset.category ===
                  category
                )
            );


          favoriteFilterBtn.classList.remove(
            "active"
          );


          renderGames();

        }
      );

    }
  );


/* =====================================================
   MODAL EVENTS
===================================================== */

modalClose.addEventListener(
  "click",
  closeGameModal
);


modalOverlay.addEventListener(
  "click",
  closeGameModal
);


modalFavoriteBtn.addEventListener(
  "click",
  () => {

    if (selectedGame) {

      toggleFavorite(
        selectedGame.id
      );

    }

  }
);


modalPlayBtn.addEventListener(
  "click",
  playSelectedGame
);


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      gameModal.classList.contains(
        "active"
      )
    ) {

      closeGameModal();

    }

  }
);


/* =====================================================
   BACK TO TOP
===================================================== */

window.addEventListener(
  "scroll",
  () => {

    if (window.scrollY > 500) {

      backToTop.classList.add(
        "show"
      );

    } else {

      backToTop.classList.remove(
        "show"
      );

    }

  },
  {
    passive: true
  }
);


backToTop.addEventListener(
  "click",
  () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sections =
  document.querySelectorAll(
    "main section[id]"
  );

const navLinks =
  document.querySelectorAll(
    ".nav-link"
  );


const sectionObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(
        (entry) => {

          if (!entry.isIntersecting) {
            return;
          }


          navLinks.forEach(
            (link) => {

              link.classList.remove(
                "active"
              );


              if (
                link.getAttribute(
                  "href"
                ) ===
                "#" + entry.target.id
              ) {

                link.classList.add(
                  "active"
                );

              }

            }
          );

        }
      );

    },
    {
      rootMargin:
        "-35% 0px -55% 0px"
    }
  );


sections.forEach(
  (section) =>
    sectionObserver.observe(
      section
    )
);


/* =====================================================
   REVEAL OBSERVER
===================================================== */

const revealObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(
        (entry) => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "visible"
            );

            revealObserver.unobserve(
              entry.target
            );

          }

        }
      );

    },
    {
      threshold: 0.08
    }
  );


document
  .querySelectorAll(
    ".step-card, .benefit-card, .cta-card"
  )
  .forEach(
    (element) => {

      element.classList.add(
        "reveal"
      );

      revealObserver.observe(
        element
      );

    }
  );


/* =====================================================
   INITIALIZE
===================================================== */

updateFavoriteCount();

renderGames();

clearSearch.style.display =
  "none";


/* =====================================================
   SERVICE WORKER
   Not required for the website.
===================================================== */
