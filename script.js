// ==================================================
// SUPER VIDEO PLAYER
// Registration + Login + Rating + Review
// Owner-only Review Delete
// 5 Second APK Download Animation
// Persistent Download Count
// Full Screen Page Loader
// ==================================================


// ==================================================
// PAGE LOADER
// ==================================================

(function initPageLoader() {

  function hidePageLoader() {

    const pageLoader =
      document.getElementById(
        "pageLoader"
      );


    if (!pageLoader) {
      return;
    }


    pageLoader.classList.add(
      "loader-hidden"
    );


    document.body.classList.remove(
      "is-loading"
    );


    setTimeout(
      function() {

        if (pageLoader) {
          pageLoader.remove();
        }

      },
      500
    );

  }


  // If page is already fully loaded.
  if (
    document.readyState ===
    "complete"
  ) {

    hidePageLoader();

  } else {

    // Wait until page/resources finish loading.
    window.addEventListener(
      "load",
      hidePageLoader,
      {
        once: true
      }
    );

  }

})();


// ==================================================
// STORAGE KEYS
// ==================================================

const USERS_KEY = "svp_users";
const CURRENT_USER_KEY = "svp_current_user";
const REVIEWS_KEY = "svp_reviews";
const DOWNLOAD_KEY = "svp_download_count";


// ==================================================
// ELEMENTS
// ==================================================

const authScreen =
  document.getElementById("authScreen");

const appScreen =
  document.getElementById("appScreen");

const registerForm =
  document.getElementById("registerForm");

const loginForm =
  document.getElementById("loginForm");

const switchAuth =
  document.getElementById("switchAuth");

const authSubtitle =
  document.getElementById("authSubtitle");

const authMessage =
  document.getElementById("authMessage");

const logoutBtn =
  document.getElementById("logoutBtn");

const downloadButton =
  document.getElementById("downloadButton");


// ==================================================
// DATA FUNCTIONS
// ==================================================

function getUsers() {

  try {

    const data =
      localStorage.getItem(
        USERS_KEY
      );

    if (!data) {
      return [];
    }

    const users =
      JSON.parse(data);

    return Array.isArray(users)
      ? users
      : [];

  } catch {

    return [];

  }

}


function saveUsers(users) {

  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );

}


function getReviews() {

  try {

    const data =
      localStorage.getItem(
        REVIEWS_KEY
      );

    if (!data) {
      return [];
    }

    const reviews =
      JSON.parse(data);

    return Array.isArray(reviews)
      ? reviews
      : [];

  } catch {

    return [];

  }

}


function saveReviews(reviews) {

  localStorage.setItem(
    REVIEWS_KEY,
    JSON.stringify(reviews)
  );

}


function getCurrentUser() {

  return localStorage.getItem(
    CURRENT_USER_KEY
  );

}


// ==================================================
// DOWNLOAD COUNT
// ==================================================

function getDownloadCount() {

  const saved =
    localStorage.getItem(
      DOWNLOAD_KEY
    );


  // First time only.
  if (saved === null) {

    localStorage.setItem(
      DOWNLOAD_KEY,
      "0"
    );

    return 0;

  }


  const count =
    Number(saved);


  // Protect against corrupted data.
  if (
    !Number.isFinite(count) ||
    count < 0
  ) {

    return 0;

  }


  return Math.floor(count);

}


function increaseDownloadCount() {

  const currentCount =
    getDownloadCount();


  const newCount =
    currentCount + 1;


  localStorage.setItem(
    DOWNLOAD_KEY,
    String(newCount)
  );


  updateDownloadCount();


  return newCount;

}


function updateDownloadCount() {

  const element =
    document.getElementById(
      "downloadCount"
    );


  if (!element) {
    return;
  }


  element.textContent =
    getDownloadCount().toLocaleString();

}


// ==================================================
// AUTH SCREEN
// ==================================================

function showApp() {

  if (authScreen) {

    authScreen.classList.add(
      "hidden"
    );

  }


  if (appScreen) {

    appScreen.classList.remove(
      "hidden"
    );

  }


  updateRatings();

  updateDownloadCount();

}


function showAuth() {

  if (appScreen) {

    appScreen.classList.add(
      "hidden"
    );

  }


  if (authScreen) {

    authScreen.classList.remove(
      "hidden"
    );

  }

}


// ==================================================
// REGISTER
// ==================================================

if (registerForm) {

  registerForm.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      const name =
        document
          .getElementById(
            "registerName"
          )
          .value
          .trim();


      const password =
        document
          .getElementById(
            "registerPassword"
          )
          .value;


      const confirm =
        document
          .getElementById(
            "registerConfirm"
          )
          .value;


      if (
        name.length < 2
      ) {

        showAuthMessage(
          "Name must contain at least 2 characters."
        );

        return;

      }


      if (
        password.length < 4
      ) {

        showAuthMessage(
          "Password must contain at least 4 characters."
        );

        return;

      }


      if (
        password !== confirm
      ) {

        showAuthMessage(
          "Passwords do not match."
        );

        return;

      }


      const users =
        getUsers();


      const exists =
        users.some(
          user =>
            String(user.name)
              .toLowerCase() ===
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

        name:
          name,

        password:
          password

      };


      users.push(
        newUser
      );


      saveUsers(
        users
      );


      localStorage.setItem(
        CURRENT_USER_KEY,
        newUser.id
      );


      registerForm.reset();

      showAuthMessage("");

      showApp();

    }
  );

}


// ==================================================
// LOGIN
// ==================================================

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      const name =
        document
          .getElementById(
            "loginName"
          )
          .value
          .trim();


      const password =
        document
          .getElementById(
            "loginPassword"
          )
          .value;


      const users =
        getUsers();


      const user =
        users.find(
          item =>
            String(item.name)
              .toLowerCase() ===
            name.toLowerCase() &&
            item.password ===
            password
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

      showAuthMessage("");

      showApp();

    }
  );

}


// ==================================================
// SWITCH REGISTER / LOGIN
// ==================================================

if (switchAuth) {

  switchAuth.addEventListener(
    "click",
    function() {

      const registerVisible =
        registerForm &&
        !registerForm.classList.contains(
          "hidden"
        );


      if (registerVisible) {

        registerForm.classList.add(
          "hidden"
        );

        loginForm.classList.remove(
          "hidden"
        );


        if (authSubtitle) {

          authSubtitle.textContent =
            "Login to continue";

        }


        switchAuth.textContent =
          "Don't have an account? Register";

      } else {

        loginForm.classList.add(
          "hidden"
        );

        registerForm.classList.remove(
          "hidden"
        );


        if (authSubtitle) {

          authSubtitle.textContent =
            "Create your account to continue";

        }


        switchAuth.textContent =
          "Already have an account? Login";

      }


      if (authMessage) {

        authMessage.textContent = "";

      }

    }
  );

}


// ==================================================
// AUTH MESSAGE
// ==================================================

function showAuthMessage(message) {

  if (!authMessage) {
    return;
  }


  authMessage.textContent =
    message;

}


// ==================================================
// LOGOUT
// ==================================================

if (logoutBtn) {

  logoutBtn.addEventListener(
    "click",
    function() {

      // IMPORTANT:
      // Only current login is removed.
      // Download count remains saved.

      localStorage.removeItem(
        CURRENT_USER_KEY
      );


      showAuth();

    }
  );

}


// ==================================================
// 5 SECOND DOWNLOAD ANIMATION
// ==================================================

if (downloadButton) {

  downloadButton.addEventListener(
    "click",
    function(event) {

      // Stop immediate browser download.
      event.preventDefault();


      // Prevent multiple clicks.
      if (
        downloadButton.classList.contains(
          "loading"
        )
      ) {

        return;

      }


      const apkURL =
        downloadButton.getAttribute(
          "href"
        );


      if (!apkURL) {

        alert(
          "APK file not found."
        );

        return;

      }


      const originalHTML =
        downloadButton.innerHTML;


      // Start loading.
      downloadButton.classList.add(
        "loading"
      );


      // ==================================================
      // PROGRESS BAR
      // ==================================================

      let progress =
        downloadButton.querySelector(
          ".download-progress"
        );


      if (!progress) {

        progress =
          document.createElement(
            "span"
          );


        progress.className =
          "download-progress";


        downloadButton.prepend(
          progress
        );

      }


      progress.style.width =
        "0%";


      // ==================================================
      // DOWNLOAD TEXT
      // ==================================================

      let content =
        downloadButton.querySelector(
          ".download-content"
        );


      if (!content) {

        content =
          document.createElement(
            "span"
          );


        content.className =
          "download-content";


        downloadButton.appendChild(
          content
        );

      }


      content.textContent =
        "Preparing download... 5s";


      // ==================================================
      // STATUS
      // ==================================================

      const status =
        document.getElementById(
          "downloadStatus"
        );


      if (status) {

        status.textContent =
          "Please wait...";

      }


      // ==================================================
      // TIMER
      // ==================================================

      const totalTime =
        5000;


      let elapsed =
        0;


      const timer =
        setInterval(
          function() {

            elapsed += 100;


            const percentage =
              Math.min(
                (elapsed / totalTime) * 100,
                100
              );


            progress.style.width =
              percentage + "%";


            const remaining =
              Math.ceil(
                (totalTime - elapsed) / 1000
              );


            if (
              remaining > 0
            ) {

              content.textContent =
                "Preparing download... " +
                remaining +
                "s";

            }


            // ==================================================
            // 5 SECONDS COMPLETED
            // ==================================================

            if (
              elapsed >= totalTime
            ) {

              clearInterval(
                timer
              );


              progress.style.width =
                "100%";


              content.textContent =
                "Starting download...";


              if (status) {

                status.textContent =
                  "Download starting...";

              }


              // ==================================================
              // INCREASE DOWNLOAD COUNT
              // ==================================================

              increaseDownloadCount();


              // ==================================================
              // START APK DOWNLOAD
              // ==================================================

              setTimeout(
                function() {

                  const link =
                    document.createElement(
                      "a"
                    );


                  link.href =
                    apkURL;


                  link.download =
                    "SuperVideoPlayer.apk";


                  link.style.display =
                    "none";


                  document.body.appendChild(
                    link
                  );


                  link.click();


                  document.body.removeChild(
                    link
                  );


                  // ==================================================
                  // RESET BUTTON
                  // ==================================================

                  setTimeout(
                    function() {

                      downloadButton.classList.remove(
                        "loading"
                      );


                      downloadButton.innerHTML =
                        originalHTML;


                      if (status) {

                        status.textContent =
                          "Download started successfully.";

                      }

                    },
                    500
                  );


                },
                300
              );

            }

          },
          100
        );

    }
  );

}


// ==================================================
// RATING SELECTOR
// ==================================================

let selectedRating =
  0;


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


// ==================================================
// UPDATE SELECTED STARS
// ==================================================

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


// ==================================================
// SUBMIT REVIEW
// ==================================================

const submitReview =
  document.getElementById(
    "submitReview"
  );


if (submitReview) {

  submitReview.addEventListener(
    "click",
    function() {

      const currentUser =
        getCurrentUser();


      if (!currentUser) {

        return;

      }


      const message =
        document.getElementById(
          "reviewMessage"
        );


      if (
        selectedRating === 0
      ) {

        if (message) {

          message.textContent =
            "Please select a star rating.";

        }

        return;

      }


      const reviewInput =
        document.getElementById(
          "reviewText"
        );


      const reviewText =
        reviewInput
          ? reviewInput.value.trim()
          : "";


      if (
        reviewText.length < 2
      ) {

        if (message) {

          message.textContent =
            "Please write a review.";

        }

        return;

      }


      const users =
        getUsers();


      const user =
        users.find(
          item =>
            item.id ===
            currentUser
        );


      if (!user) {

        return;

      }


      const reviews =
        getReviews();


      // One review per user.
      const existing =
        reviews.find(
          review =>
            review.userId ===
            currentUser
        );


      if (existing) {

        if (message) {

          message.textContent =
            "You already reviewed this app.";

        }

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
          new Date()
            .toLocaleDateString()

      };


      reviews.push(
        newReview
      );


      saveReviews(
        reviews
      );


      if (reviewInput) {

        reviewInput.value =
          "";

      }


      selectedRating =
        0;


      updateStarSelector();


      if (message) {

        message.textContent =
          "Your review has been added.";

      }


      updateRatings();

    }
  );

}


// ==================================================
// DELETE REVIEW
// ==================================================

function deleteReview(reviewId) {

  const currentUser =
    getCurrentUser();


  const reviews =
    getReviews();


  const review =
    reviews.find(
      item =>
        item.id ===
        reviewId
    );


  if (!review) {

    return;

  }


  // Only review owner can delete.
  if (
    review.userId !==
    currentUser
  ) {

    alert(
      "You can only delete your own review."
    );

    return;

  }


  const confirmed =
    confirm(
      "Delete your review?"
    );


  if (!confirmed) {

    return;

  }


  const updated =
    reviews.filter(
      item =>
        item.id !==
        reviewId
    );


  saveReviews(
    updated
  );


  updateRatings();

}


// ==================================================
// UPDATE RATINGS
// ==================================================

function updateRatings() {

  const reviews =
    getReviews();


  const total =
    reviews.length;


  let average =
    0;


  if (
    total > 0
  ) {

    const sum =
      reviews.reduce(
        (total, review) =>
          total +
          Number(
            review.rating
          ),
        0
      );


    average =
      sum / total;

  }


  average =
    Math.round(
      average * 10
    ) / 10;


  const averageElement =
    document.getElementById(
      "averageRating"
    );


  const bigRatingElement =
    document.getElementById(
      "bigRating"
    );


  const totalReviewsElement =
    document.getElementById(
      "totalReviews"
    );


  if (averageElement) {

    averageElement.textContent =
      average.toFixed(1);

  }


  if (bigRatingElement) {

    bigRatingElement.textContent =
      average.toFixed(1);

  }


  if (totalReviewsElement) {

    totalReviewsElement.textContent =
      total;

  }


  updateBigStars(
    average
  );


  updateRatingBars(
    reviews
  );


  renderReviews();


  updateDownloadCount();

}


// ==================================================
// BIG STARS
// ==================================================

function updateBigStars(
  average
) {

  const rounded =
    Math.round(
      average
    );


  let stars =
    "";


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


  const element =
    document.getElementById(
      "bigStars"
    );


  if (element) {

    element.textContent =
      stars;

  }

}


// ==================================================
// RATING BARS
// ==================================================

function updateRatingBars(
  reviews
) {

  for (
    let rating = 1;
    rating <= 5;
    rating++
  ) {

    const count =
      reviews.filter(
        review =>
          Number(
            review.rating
          ) === rating
      ).length;


    const percentage =
      reviews.length === 0
        ? 0
        : (
            count /
            reviews.length
          ) * 100;


    const bar =
      document.getElementById(
        "bar" + rating
      );


    if (bar) {

      bar.style.width =
        percentage + "%";

    }

  }

}


// ==================================================
// RENDER REVIEWS
// ==================================================

function renderReviews() {

  const reviews =
    getReviews();


  const currentUser =
    getCurrentUser();


  const reviewsList =
    document.getElementById(
      "reviewsList"
    );


  if (!reviewsList) {

    return;

  }


  if (
    reviews.length === 0
  ) {

    reviewsList.innerHTML = `
      <div
        style="
          text-align:center;
          padding:25px 0;
          color:#8992a3;
          font-size:13px;
        "
      >
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

          let stars =
            "";


          for (
            let i = 1;
            i <= 5;
            i++
          ) {

            stars +=
              i <= Number(
                review.rating
              )
                ? "★"
                : "☆";

          }


          // Only owner sees delete button.
          const deleteButton =
            review.userId ===
            currentUser

              ? `
                <button
                  class="delete-review"
                  type="button"
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
                    ${escapeHTML(
                      review.userName
                    )}
                  </div>

                  <div class="review-stars">
                    ${stars}
                  </div>

                </div>

                <div class="review-date">
                  ${escapeHTML(
                    review.date
                  )}
                </div>

              </div>

              <div class="review-text">
                ${escapeHTML(
                  review.text
                )}
              </div>

              ${deleteButton}

            </div>
          `;

        }
      )
      .join("");

}


// ==================================================
// HTML SECURITY HELPER
// ==================================================

function escapeHTML(text) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    String(text);


  return div.innerHTML;

}


// ==================================================
// START APP
// ==================================================

if (
  getCurrentUser()
) {

  showApp();

} else {

  showAuth();

}


// ==================================================
// INITIAL DOWNLOAD COUNT
// ==================================================

updateDownloadCount();
