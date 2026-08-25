/*
  Super Video Player
  Registration + Login + Rating + Review + Download Count
*/


// ==============================
// STORAGE
// ==============================

const USERS_KEY = "svp_users";
const CURRENT_USER_KEY = "svp_current_user";
const REVIEWS_KEY = "svp_reviews";
const DOWNLOAD_KEY = "svp_download_count";


// ==============================
// ELEMENTS
// ==============================

const authScreen = document.getElementById("authScreen");
const appScreen = document.getElementById("appScreen");

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

const switchAuth = document.getElementById("switchAuth");

const authSubtitle = document.getElementById("authSubtitle");
const authMessage = document.getElementById("authMessage");

const logoutBtn = document.getElementById("logoutBtn");

const downloadButton =
  document.getElementById("downloadButton");


// ==============================
// DATA FUNCTIONS
// ==============================

function getUsers() {

  return JSON.parse(
    localStorage.getItem(USERS_KEY) || "[]"
  );

}


function saveUsers(users) {

  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );

}


function getReviews() {

  return JSON.parse(
    localStorage.getItem(REVIEWS_KEY) || "[]"
  );

}


function saveReviews(reviews) {

  localStorage.setItem(
    REVIEWS_KEY,
    JSON.stringify(reviews)
  );

}


function getCurrentUser() {

  return localStorage.getItem(CURRENT_USER_KEY);

}


// ==============================
// AUTH SCREEN
// ==============================

function showApp() {

  authScreen.classList.add("hidden");

  appScreen.classList.remove("hidden");

  updateRatings();

}


function showAuth() {

  appScreen.classList.add("hidden");

  authScreen.classList.remove("hidden");

}


// ==============================
// REGISTER
// ==============================

registerForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();

    const name =
      document.getElementById("registerName")
        .value.trim();

    const password =
      document.getElementById("registerPassword")
        .value;

    const confirm =
      document.getElementById("registerConfirm")
        .value;


    if (name.length < 2) {

      showAuthMessage(
        "Name must contain at least 2 characters."
      );

      return;

    }


    if (password.length < 4) {

      showAuthMessage(
        "Password must contain at least 4 characters."
      );

      return;

    }


    if (password !== confirm) {

      showAuthMessage(
        "Passwords do not match."
      );

      return;

    }


    const users = getUsers();


    const exists = users.some(
      user =>
        user.name.toLowerCase() ===
        name.toLowerCase()
    );


    if (exists) {

      showAuthMessage(
        "This name is already registered."
      );

      return;

    }


    const newUser = {

      id:
        Date.now().toString(),

      name: name,

      password: password

    };


    users.push(newUser);

    saveUsers(users);


    localStorage.setItem(
      CURRENT_USER_KEY,
      newUser.id
    );


    registerForm.reset();

    showApp();

  }
);


// ==============================
// LOGIN
// ==============================

loginForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    const name =
      document.getElementById("loginName")
        .value.trim();

    const password =
      document.getElementById("loginPassword")
        .value;


    const users = getUsers();


    const user = users.find(
      item =>
        item.name.toLowerCase() ===
        name.toLowerCase() &&
        item.password === password
    );


    if (!user) {

      showAuthMessage(
        "Incorrect name or password."
      );

      return;

    }


    localStorage.setItem(
      CURRENT_USER_KEY,
      user.id
    );


    loginForm.reset();

    showApp();

  }
);


// ==============================
// SWITCH REGISTER / LOGIN
// ==============================

switchAuth.addEventListener(
  "click",
  function() {

    const registerVisible =
      !registerForm.classList.contains("hidden");


    if (registerVisible) {

      registerForm.classList.add("hidden");

      loginForm.classList.remove("hidden");

      authSubtitle.textContent =
        "Login to continue";

      switchAuth.textContent =
        "Don't have an account? Register";

    } else {

      loginForm.classList.add("hidden");

      registerForm.classList.remove("hidden");

      authSubtitle.textContent =
        "Create your account to continue";

      switchAuth.textContent =
        "Already have an account? Login";

    }


    authMessage.textContent = "";

  }
);


// ==============================
// AUTH MESSAGE
// ==============================

function showAuthMessage(message) {

  authMessage.textContent = message;

}


// ==============================
// LOGOUT
// ==============================

logoutBtn.addEventListener(
  "click",
  function() {

    localStorage.removeItem(
      CURRENT_USER_KEY
    );

    showAuth();

  }
);


// ==============================
// DOWNLOAD COUNT
// ==============================

function getDownloadCount() {

  return Number(
    localStorage.getItem(DOWNLOAD_KEY) || 0
  );

}


function updateDownloadCount() {

  document.getElementById(
    "downloadCount"
  ).textContent =
    getDownloadCount().toLocaleString();

}


downloadButton.addEventListener(
  "click",
  function() {

    let count =
      getDownloadCount();

    count++;

    localStorage.setItem(
      DOWNLOAD_KEY,
      count
    );

    updateDownloadCount();

  }
);


// ==============================
// RATING SELECTOR
// ==============================

let selectedRating = 0;


const starButtons =
  document.querySelectorAll(
    "#starSelector button"
  );


starButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      function() {

        selectedRating =
          Number(
            this.dataset.rating
          );

        updateStarSelector();

      }
    );

  }
);


function updateStarSelector() {

  starButtons.forEach(
    button => {

      const rating =
        Number(
          button.dataset.rating
        );


      button.textContent =
        rating <= selectedRating
          ? "★"
          : "☆";

    }
  );

}


// ==============================
// SUBMIT REVIEW
// ==============================

document
  .getElementById("submitReview")
  .addEventListener(
    "click",
    function() {

      const currentUser =
        getCurrentUser();


      if (!currentUser) {

        return;

      }


      if (selectedRating === 0) {

        document.getElementById(
          "reviewMessage"
        ).textContent =
          "Please select a star rating.";

        return;

      }


      const reviewText =
        document.getElementById(
          "reviewText"
        ).value.trim();


      if (reviewText.length < 2) {

        document.getElementById(
          "reviewMessage"
        ).textContent =
          "Please write a review.";

        return;

      }


      const users = getUsers();


      const user =
        users.find(
          item =>
            item.id === currentUser
        );


      if (!user) {

        return;

      }


      const reviews =
        getReviews();


      // One review per user

      const existing =
        reviews.find(
          review =>
            review.userId ===
            currentUser
        );


      if (existing) {

        document.getElementById(
          "reviewMessage"
        ).textContent =
          "You already reviewed this app.";

        return;

      }


      const newReview = {

        id:
          Date.now().toString(),

        userId:
          currentUser,

        userName:
          user.name,

        rating:
          selectedRating,

        text:
          reviewText,

        date:
          new Date().toLocaleDateString()

      };


      reviews.push(newReview);

      saveReviews(reviews);


      document.getElementById(
        "reviewText"
      ).value = "";


      selectedRating = 0;

      updateStarSelector();


      document.getElementById(
        "reviewMessage"
      ).textContent =
        "Your review has been added.";

      updateRatings();

    }
  );


// ==============================
// DELETE REVIEW
// ==============================

function deleteReview(reviewId) {

  const currentUser =
    getCurrentUser();


  const reviews =
    getReviews();


  const review =
    reviews.find(
      item =>
        item.id === reviewId
    );


  if (!review) {

    return;

  }


  // IMPORTANT:
  // Only review owner can delete

  if (
    review.userId !==
    currentUser
  ) {

    alert(
      "You can only delete your own review."
    );

    return;

  }


  const updated =
    reviews.filter(
      item =>
        item.id !== reviewId
    );


  saveReviews(updated);

  updateRatings();

}


// ==============================
// UPDATE RATINGS
// ==============================

function updateRatings() {

  const reviews =
    getReviews();


  const total =
    reviews.length;


  let average = 0;


  if (total > 0) {

    const sum =
      reviews.reduce(
        (total, review) =>
          total + review.rating,
        0
      );

    average =
      sum / total;

  }


  average =
    Math.round(
      average * 10
    ) / 10;


  document.getElementById(
    "averageRating"
  ).textContent =
    average.toFixed(1);


  document.getElementById(
    "bigRating"
  ).textContent =
    average.toFixed(1);


  document.getElementById(
    "totalReviews"
  ).textContent =
    total;


  updateBigStars(average);

  updateRatingBars(reviews);

  renderReviews();

  updateDownloadCount();

}


// ==============================
// BIG STARS
// ==============================

function updateBigStars(average) {

  const rounded =
    Math.round(average);


  let stars = "";


  for (
    let i = 1;
    i <= 5;
    i++
  ) {

    stars +=
      i <= rounded
        ? "★"
        : "☆";

  }


  document.getElementById(
    "bigStars"
  ).textContent =
    stars;

}


// ==============================
// RATING BARS
// ==============================

function updateRatingBars(reviews) {

  for (
    let rating = 1;
    rating <= 5;
    rating++
  ) {

    const count =
      reviews.filter(
        review =>
          review.rating === rating
      ).length;


    const percentage =
      reviews.length === 0
        ? 0
        : (
            count /
            reviews.length
          ) * 100;


    document.getElementById(
      "bar" + rating
    ).style.width =
      percentage + "%";

  }

}


// ==============================
// RENDER REVIEWS
// ==============================

function renderReviews() {

  const reviews =
    getReviews();


  const currentUser =
    getCurrentUser();


  const reviewsList =
    document.getElementById(
      "reviewsList"
    );


  if (reviews.length === 0) {

    reviewsList.innerHTML = `
      <div style="
        text-align:center;
        padding:25px 0;
        color:#8992a3;
        font-size:13px;
      ">
        No reviews yet.<br>
        Be the first to rate this app!
      </div>
    `;

    return;

  }


  reviewsList.innerHTML =
    reviews
      .slice()
      .reverse()
      .map(
        review => {

          let stars = "";


          for (
            let i = 1;
            i <= 5;
            i++
          ) {

            stars +=
              i <= review.rating
                ? "★"
                : "☆";

          }


          const deleteButton =
            review.userId === currentUser
              ? `
                <button
                  class="delete-review"
                  onclick="deleteReview('${review.id}')"
                >
                  Delete my review
                </button>
              `
              : "";


          return `
            <div class="review">

              <div class="review-top">

                <div>

                  <div class="user-name">
                    ${escapeHTML(review.userName)}
                  </div>

                  <div class="review-stars">
                    ${stars}
                  </div>

                </div>

                <div class="review-date">
                  ${escapeHTML(review.date)}
                </div>

              </div>

              <div class="review-text">
                ${escapeHTML(review.text)}
              </div>

              ${deleteButton}

            </div>
          `;

        }
      )
      .join("");

}


// ==============================
// SECURITY HELPER
// ==============================

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent =
    text;

  return div.innerHTML;

}


// ==============================
// START APP
// ==============================

if (getCurrentUser()) {

  showApp();

} else {

  showAuth();

}
