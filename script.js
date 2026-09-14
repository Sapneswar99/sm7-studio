/* =========================================================
   SUPER VIDEO PLAYER WEBSITE
   FIREBASE CONNECTED VERSION
   FULL REPLACE SCRIPT
   ========================================================= */


/* =========================================================
   CONFIG
   ========================================================= */

/*
   Firebase config file mein APK_URL defined ho to
   wahi use hoga.

   Agar nahi hai to ye GitHub Release APK use hoga.
*/
const DEFAULT_APK_URL =
    "https://github.com/Sapneswar99/sm7-studio/releases/download/v1.0.0/Super.Video.Player.apk";


/*
   Agar firebase-config.js mein OWNER_UID nahi hai,
   to yahan REAL OWNER UID paste kar sakte ho.

   Example:
   const LOCAL_OWNER_UID = "abc123...";
*/
const LOCAL_OWNER_UID = "yZsy5oOxhjU7BFnaCH67FOL3rjB2";


/* =========================================================
   FIREBASE VARIABLES
   ========================================================= */

let auth = null;
let db = null;

let currentUser = null;

let registerMode = false;

let reviewsUnsubscribe = null;

let downloadTimer = null;

let downloadInProgress = false;


/* =========================================================
   HELPER
   ========================================================= */

function get(id) {
    return document.getElementById(id);
}


/* =========================================================
   SAFE MESSAGE
   ========================================================= */

function showMessage(text) {
    window.alert(text);
}


function setFormMessage(element, text, success = false) {

    if (!element) return;

    element.textContent = text;

    element.classList.toggle(
        "success",
        success
    );
}


/* =========================================================
   APK URL
   ========================================================= */

function getAPKURL() {

    if (
        typeof APK_URL !== "undefined" &&
        typeof APK_URL === "string" &&
        APK_URL.trim()
    ) {
        return APK_URL.trim();
    }

    return DEFAULT_APK_URL;
}


/* =========================================================
   OWNER UID
   ========================================================= */

function getOwnerUID() {

    if (
        typeof OWNER_UID !== "undefined" &&
        typeof OWNER_UID === "string" &&
        OWNER_UID.trim()
    ) {
        return OWNER_UID.trim();
    }

    if (
        LOCAL_OWNER_UID &&
        typeof LOCAL_OWNER_UID === "string"
    ) {
        return LOCAL_OWNER_UID.trim();
    }

    return "";
}


/* =========================================================
   SYNTHETIC EMAIL
   ========================================================= */

/*
   Firebase Email/Password Auth use karne ke liye
   Name ko deterministic synthetic email mein convert
   kiya ja raha hai.

   Same name -> same Firebase email.

   Example:
   Sapneswar
   ->
   user-xxxxxxxx@supervideoplayer.local
*/


function hashString(value) {

    let hash = 0x811c9dc5;

    for (let i = 0; i < value.length; i++) {

        hash ^= value.charCodeAt(i);

        hash =
            Math.imul(
                hash,
                0x01000193
            );

    }

    return (
        hash >>> 0
    ).toString(36);

}


function syntheticEmail(name) {

    const normalized =
        name
            .trim()
            .toLowerCase();

    const hash =
        hashString(normalized);

    return (
        "user-" +
        hash +
        "@supervideoplayer.local"
    );

}


/* =========================================================
   NAME VALIDATION
   ========================================================= */

function validName(name) {

    return /^[a-zA-Z0-9._-]{3,30}$/.test(
        name
    );

}


/* =========================================================
   PASSWORD VALIDATION
   ========================================================= */

function validPassword(password) {

    return (
        typeof password === "string" &&
        password.length >= 6
    );

}


/* =========================================================
   LOADING SCREEN
   ========================================================= */

/*
   IMPORTANT:
   Loading screen Firebase ke load hone ka wait nahi karega.

   Page script execute hone ke baad exactly 3 seconds mein
   loading screen hide ho jayega.
*/


(function startLoadingScreen() {

    const loading =
        get("loadingScreen");

    if (!loading) return;


    window.setTimeout(
        function () {

            loading.classList.add(
                "hidden"
            );

            loading.classList.add(
                "hide"
            );


            /*
               CSS transition complete hone ke baad
               element ko remove kar denge.
            */

            window.setTimeout(
                function () {

                    if (
                        loading &&
                        loading.parentNode
                    ) {

                        loading.remove();

                    }

                },
                750
            );

        },
        3000
    );

})();


/* =========================================================
   CURRENT YEAR
   ========================================================= */

(function setCurrentYear() {

    const year =
        get("year");

    if (!year) return;

    year.textContent =
        new Date().getFullYear();

})();


/* =========================================================
   AUTH MODAL
   ========================================================= */

function openAuth(mode = "login") {

    registerMode =
        mode === "register";


    const modal =
        get("authModal");

    if (!modal) return;


    modal.classList.add(
        "show"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    updateAuthUI();


    const message =
        get("authMessage");

    if (message) {

        message.textContent =
            "";

        message.classList.remove(
            "success"
        );

    }


    const password =
        get("authPassword");

    if (password) {

        password.value =
            "";

    }


    const name =
        get("authName");

    if (name) {

        window.setTimeout(
            function () {

                name.focus();

            },
            100
        );

    }

}


/* =========================================================
   CLOSE AUTH MODAL
   ========================================================= */

function closeAuth() {

    const modal =
        get("authModal");

    if (!modal) return;


    modal.classList.remove(
        "show"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   TOGGLE LOGIN / REGISTER
   ========================================================= */

function toggleAuth() {

    registerMode =
        !registerMode;


    updateAuthUI();


    const message =
        get("authMessage");

    if (message) {

        message.textContent =
            "";

        message.classList.remove(
            "success"
        );

    }


    const password =
        get("authPassword");

    if (password) {

        password.value =
            "";

    }

}


/* =========================================================
   UPDATE AUTH MODAL UI
   ========================================================= */

function updateAuthUI() {

    const title =
        get("authTitle");

    const subtitle =
        get("authSubtitle");

    const name =
        get("authName");

    const password =
        get("authPassword");

    const submit =
        get("authSubmit");

    const switchButton =
        get("switchAuth");


    if (registerMode) {

        if (title) {

            title.textContent =
                "Create Account";

        }


        if (subtitle) {

            subtitle.textContent =
                "Register with your name and password.";

        }


        if (name) {

            name.style.display =
                "block";

            name.placeholder =
                "Name";

            name.autocomplete =
                "username";

        }


        if (password) {

            password.placeholder =
                "Password";

            password.autocomplete =
                "new-password";

        }


        if (submit) {

            submit.textContent =
                "Register";

        }


        if (switchButton) {

            switchButton.innerHTML =
                "Already have an account? <b>Login</b>";

        }

    } else {

        if (title) {

            title.textContent =
                "Login";

        }


        if (subtitle) {

            subtitle.textContent =
                "Login with your name and password.";

        }


        if (name) {

            name.style.display =
                "block";

            name.placeholder =
                "Name";

            name.autocomplete =
                "username";

        }


        if (password) {

            password.placeholder =
                "Password";

            password.autocomplete =
                "current-password";

        }


        if (submit) {

            submit.textContent =
                "Login";

        }


        if (switchButton) {

            switchButton.innerHTML =
                "Don't have an account? <b>Register</b>";

        }

    }

}


/* =========================================================
   LOGIN BUTTON
   ========================================================= */

const loginButton =
    get("loginButton");


if (loginButton) {

    loginButton.addEventListener(
        "click",
        function () {

            if (currentUser) {

                logoutUser();

            } else {

                openAuth("login");

            }

        }
    );

}


/* =========================================================
   REGISTER BUTTON
   ========================================================= */

const registerButton =
    get("registerButton");


if (registerButton) {

    registerButton.addEventListener(
        "click",
        function () {

            openAuth("register");

        }
    );

}


/* =========================================================
   LOGOUT BUTTON
   ========================================================= */

const logoutButton =
    get("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            logoutUser();

        }
    );

}


/* =========================================================
   LOGOUT USER
   ========================================================= */

async function logoutUser() {

    if (!auth) {

        return;

    }


    try {

        await auth.signOut();

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

        showMessage(
            "Could not logout. Please try again."
        );

    }

}


/* =========================================================
   AUTH FORM
   ========================================================= */

const authForm =
    get("authForm");


if (authForm) {

    authForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            await submitAuth();

        }
    );

}


/* =========================================================
   SUBMIT AUTH
   ========================================================= */

async function submitAuth() {

    const authMessage =
        get("authMessage");


    if (!auth || !db) {

        setFormMessage(
            authMessage,
            "Firebase is not connected yet."
        );

        return;

    }


    const nameInput =
        get("authName");

    const passwordInput =
        get("authPassword");


    const name =
        nameInput
            ? nameInput.value.trim()
            : "";


    const password =
        passwordInput
            ? passwordInput.value
            : "";


    /* =========================================
       VALIDATE NAME
       ========================================= */

    if (!validName(name)) {

        setFormMessage(
            authMessage,
            "Name must be 3–30 characters and may contain letters, numbers, dot, underscore or hyphen."
        );

        return;

    }


    /* =========================================
       VALIDATE PASSWORD
       ========================================= */

    if (!validPassword(password)) {

        setFormMessage(
            authMessage,
            "Password must be at least 6 characters."
        );

        return;

    }


    const email =
        syntheticEmail(name);


    const submit =
        get("authSubmit");


    if (submit) {

        submit.disabled =
            true;

    }


    try {

        /* =========================================
           REGISTER
           ========================================= */

        if (registerMode) {

            const credential =
                await auth.createUserWithEmailAndPassword(
                    email,
                    password
                );


            const user =
                credential.user;


            if (user) {

                await user.updateProfile({

                    displayName:
                        name

                });


                await db
                    .collection("users")
                    .doc(user.uid)
                    .set(
                        {
                            uid:
                                user.uid,

                            name:
                                name,

                            createdAt:
                                firebase.firestore
                                    .FieldValue
                                    .serverTimestamp()

                        },
                        {
                            merge:
                                true
                        }
                    );

            }


            setFormMessage(
                authMessage,
                "Account created successfully.",
                true
            );


            window.setTimeout(
                function () {

                    closeAuth();

                },
                700
            );


        } else {

            /* =========================================
               LOGIN
               ========================================= */

            const credential =
                await auth.signInWithEmailAndPassword(
                    email,
                    password
                );


            /*
               Agar displayName missing hai to
               current login name set kar denge.
            */

            if (
                credential.user &&
                !credential.user.displayName
            ) {

                try {

                    await credential.user.updateProfile({

                        displayName:
                            name

                    });

                } catch (profileError) {

                    console.warn(
                        "Profile update warning:",
                        profileError
                    );

                }

            }


            closeAuth();

        }

    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );


        const code =
            error.code || "";


        let message =
            "Authentication failed. Please try again.";


        if (
            code.includes(
                "email-already-in-use"
            )
        ) {

            message =
                "This name is already registered.";

        } else if (
            code.includes(
                "invalid-credential"
            ) ||
            code.includes(
                "wrong-password"
            ) ||
            code.includes(
                "user-not-found"
            )
        ) {

            message =
                "Invalid name or password.";

        } else if (
            code.includes(
                "invalid-email"
            )
        ) {

            message =
                "Invalid account name.";

        } else if (
            code.includes(
                "weak-password"
            )
        ) {

            message =
                "Password is too weak. Use at least 6 characters.";

        } else if (
            code.includes(
                "network-request-failed"
            )
        ) {

            message =
                "Network error. Please check your internet connection.";

        } else if (
            code.includes(
                "too-many-requests"
            )
        ) {

            message =
                "Too many attempts. Please wait and try again.";

        } else if (error.message) {

            message =
                error.message;

        }


        setFormMessage(
            authMessage,
            message
        );

    } finally {

        if (submit) {

            submit.disabled =
                false;

        }

    }

}


/* =========================================================
   AUTH STATE UI
   ========================================================= */

function renderAuthState() {

    const login =
        get("loginButton");

    const register =
        get("registerButton");

    const logout =
        get("logoutButton");

    const reviewUser =
        get("reviewUser");

    const reviewUserName =
        get("reviewUserName");

    const reviewSubmit =
        get("reviewSubmit");

    const reviewText =
        get("reviewText");

    const reviewRating =
        get("reviewRating");


    if (currentUser) {

        /* =========================================
           LOGGED IN
           ========================================= */

        if (login) {

            login.hidden =
                true;

        }


        if (register) {

            register.hidden =
                true;

        }


        if (logout) {

            logout.hidden =
                false;

        }


        if (reviewUser) {

            reviewUser.hidden =
                false;

        }


        if (reviewUserName) {

            reviewUserName.textContent =
                currentUser.displayName ||
                "User";

        }


        if (reviewSubmit) {

            reviewSubmit.disabled =
                false;

        }


        if (reviewText) {

            reviewText.disabled =
                false;

        }


        if (reviewRating) {

            reviewRating.disabled =
                false;

        }

    } else {

        /* =========================================
           LOGGED OUT
           ========================================= */

        if (login) {

            login.hidden =
                false;

        }


        if (register) {

            register.hidden =
                false;

        }


        if (logout) {

            logout.hidden =
                true;

        }


        if (reviewUser) {

            reviewUser.hidden =
                true;

        }


        if (reviewSubmit) {

            reviewSubmit.disabled =
                false;

        }


        if (reviewText) {

            reviewText.disabled =
                true;

        }


        if (reviewRating) {

            reviewRating.disabled =
                true;

        }

    }


    /*
       Reviews snapshot automatically update karega.
    */

    renderReviewsFromCurrentState();

}


/* =========================================================
   REVIEW FORM
   ========================================================= */

const reviewForm =
    get("reviewForm");


if (reviewForm) {

    reviewForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            await submitReview();

        }
    );

}


/* =========================================================
   SUBMIT REVIEW
   ========================================================= */

async function submitReview() {

    if (!currentUser) {

        openAuth("login");

        setFormMessage(
            get("authMessage"),
            "Please Login/Register before submitting a review."
        );

        return;

    }


    if (!db) {

        setFormMessage(
            get("reviewMessage"),
            "Firebase is not connected."
        );

        return;

    }


    const textInput =
        get("reviewText");

    const ratingInput =
        get("reviewRating");


    const text =
        textInput
            ? textInput.value.trim()
            : "";


    const rating =
        ratingInput
            ? Number(
                ratingInput.value
            )
            : 5;


    if (!text) {

        setFormMessage(
            get("reviewMessage"),
            "Please write a review."
        );

        return;

    }


    if (text.length > 500) {

        setFormMessage(
            get("reviewMessage"),
            "Review is too long. Maximum 500 characters."
        );

        return;

    }


    if (
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5
    ) {

        setFormMessage(
            get("reviewMessage"),
            "Please select a rating from 1 to 5."
        );

        return;

    }


    const submit =
        get("reviewSubmit");


    if (submit) {

        submit.disabled =
            true;

        submit.textContent =
            "Posting...";

    }


    try {

        await db
            .collection("reviews")
            .add(
                {
                    uid:
                        currentUser.uid,

                    name:
                        currentUser.displayName ||
                        "User",

                    text:
                        text,

                    rating:
                        rating,

                    createdAt:
                        firebase.firestore
                            .FieldValue
                            .serverTimestamp()
                }
            );


        if (textInput) {

            textInput.value =
                "";

        }


        if (ratingInput) {

            ratingInput.value =
                "5";

        }


        setFormMessage(
            get("reviewMessage"),
            "Review posted successfully.",
            true
        );

    } catch (error) {

        console.error(
            "Review submit error:",
            error
        );


        setFormMessage(
            get("reviewMessage"),
            "Could not post review. Please try again."
        );

    } finally {

        if (submit) {

            submit.disabled =
                false;

            submit.textContent =
                "Submit Review";

        }

    }

}


/* =========================================================
   LOAD REVIEWS
   ========================================================= */

function loadReviews() {

    if (!db) {

        return;

    }


    if (reviewsUnsubscribe) {

        reviewsUnsubscribe();

        reviewsUnsubscribe =
            null;

    }


    reviewsUnsubscribe =
        db
            .collection("reviews")
            .orderBy(
                "createdAt",
                "desc"
            )
            .limit(50)
            .onSnapshot(
                function (snapshot) {

                    renderReviews(
                        snapshot
                    );

                },
                function (error) {

                    console.error(
                        "Reviews load error:",
                        error
                    );


                    const list =
                        get("reviewsList");


                    if (list) {

                        list.innerHTML =
                            `
                            <div class="empty-state">
                                Unable to load reviews.
                            </div>
                            `;

                    }

                }
            );

}


/* =========================================================
   RENDER REVIEWS
   ========================================================= */

function renderReviews(snapshot) {

    const list =
        get("reviewsList");


    if (!list) {

        return;

    }


    if (!snapshot || snapshot.empty) {

        list.innerHTML =
            `
            <div class="empty-state">
                No reviews yet. Be the first to review.
            </div>
            `;

        return;

    }


    list.innerHTML =
        "";


    snapshot.forEach(
        function (doc) {

            const data =
                doc.data() || {};


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "review-card";


            /* =========================================
               NAME
               ========================================= */

            const name =
                escapeHtml(
                    data.name ||
                    "User"
                );


            /* =========================================
               REVIEW TEXT
               ========================================= */

            const text =
                escapeHtml(
                    data.text ||
                    ""
                );


            /* =========================================
               RATING
               ========================================= */

            let rating =
                Number(
                    data.rating || 5
                );


            if (
                !Number.isInteger(rating)
            ) {

                rating =
                    5;

            }


            rating =
                Math.max(
                    1,
                    Math.min(
                        5,
                        rating
                    )
                );


            const stars =
                "★".repeat(
                    rating
                ) +
                "☆".repeat(
                    5 - rating
                );


            /* =========================================
               DATE
               ========================================= */

            let date =
                "Just now";


            if (
                data.createdAt &&
                typeof data.createdAt.toDate ===
                    "function"
            ) {

                try {

                    date =
                        data.createdAt
                            .toDate()
                            .toLocaleDateString(
                                undefined,
                                {
                                    day:
                                        "numeric",

                                    month:
                                        "short",

                                    year:
                                        "numeric"
                                }
                            );

                } catch (dateError) {

                    console.warn(
                        "Review date error:",
                        dateError
                    );

                }

            }


            /* =========================================
               CARD CONTENT
               ========================================= */

            const top =
                document.createElement(
                    "div"
                );


            top.className =
                "review-top";


            const info =
                document.createElement(
                    "div"
                );


            const nameElement =
                document.createElement(
                    "b"
                );


            nameElement.textContent =
                data.name ||
                "User";


            const dateElement =
                document.createElement(
                    "small"
                );


            dateElement.textContent =
                date;


            info.appendChild(
                nameElement
            );

            info.appendChild(
                dateElement
            );


            const ratingElement =
                document.createElement(
                    "span"
                );


            ratingElement.textContent =
                stars;


            top.appendChild(
                info
            );

            top.appendChild(
                ratingElement
            );


            const textElement =
                document.createElement(
                    "p"
                );


            textElement.textContent =
                data.text ||
                "";


            card.appendChild(
                top
            );

            card.appendChild(
                textElement
            );


            /* =========================================
               OWNER ONLY DELETE
               ========================================= */

            const ownerUID =
                getOwnerUID();


            if (
                currentUser &&
                ownerUID &&
                currentUser.uid === ownerUID
            ) {

                const deleteButton =
                    document.createElement(
                        "button"
                    );


                deleteButton.type =
                    "button";


                deleteButton.className =
                    "delete-review";


                deleteButton.textContent =
                    "Delete";


                deleteButton.addEventListener(
                    "click",
                    async function () {

                        await deleteReview(
                            doc.id
                        );

                    }
                );


                card.appendChild(
                    deleteButton
                );

            }


            list.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   REVIEW STATE REFRESH
   ========================================================= */

function renderReviewsFromCurrentState() {

    /*
       Firestore onSnapshot already maintains
       the latest review list.

       Auth change ke time snapshot automatically
       re-renders through the listener.
    */

}


/* =========================================================
   DELETE REVIEW
   ========================================================= */

async function deleteReview(reviewId) {

    if (!currentUser) {

        return;

    }


    if (!db) {

        showMessage(
            "Firebase is not connected."
        );

        return;

    }


    const ownerUID =
        getOwnerUID();


    if (
        !ownerUID ||
        currentUser.uid !== ownerUID
    ) {

        showMessage(
            "You are not allowed to delete reviews."
        );

        return;

    }


    if (!reviewId) {

        return;

    }


    const confirmed =
        window.confirm(
            "Delete this review?"
        );


    if (!confirmed) {

        return;

    }


    try {

        await db
            .collection("reviews")
            .doc(reviewId)
            .delete();

    } catch (error) {

        console.error(
            "Delete review error:",
            error
        );


        showMessage(
            "Could not delete review."
        );

    }

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    return String(value)
        .replace(
            /[&<>'"]/g,
            function (character) {

                const entities = {

                    "&":
                        "&amp;",

                    "<":
                        "&lt;",

                    ">":
                        "&gt;",

                    "'":
                        "&#39;",

                    '"':
                        "&quot;"

                };

                return (
                    entities[character] ||
                    character
                );

            }
        );

}


/* =========================================================
   DOWNLOAD BUTTONS
   ========================================================= */

/*
   HTML ke onclick="startDownload()" ko
   intentionally support kiya gaya hai.

   Yahan duplicate click listener add nahi kiya ja raha.
*/


/* =========================================================
   START DOWNLOAD
   ========================================================= */

async function startDownload() {

    /* =========================================
       LOGIN REQUIRED
       ========================================= */

    if (!currentUser) {

        openAuth("login");

        setFormMessage(
            get("authMessage"),
            "Please Login/Register before downloading."
        );

        return;

    }


    /* =========================================
       PREVENT DUPLICATE DOWNLOAD
       ========================================= */

    if (downloadInProgress) {

        return;

    }


    const modal =
        get("downloadModal");

    const countdown =
        get("countdown");

    const progress =
        get("countdownProgress");

    const status =
        get("downloadStatus");


    if (!modal) {

        showMessage(
            "Download window is unavailable."
        );

        return;

    }


    downloadInProgress =
        true;


    if (downloadTimer) {

        clearInterval(
            downloadTimer
        );

        downloadTimer =
            null;

    }


    modal.classList.add(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    let seconds =
        5;


    if (countdown) {

        countdown.textContent =
            seconds;

    }


    if (progress) {

        progress.style.transform =
            "scaleX(1)";

    }


    if (status) {

        status.textContent =
            "Please wait...";

    }


    downloadTimer =
        window.setInterval(
            async function () {

                seconds--;


                if (countdown) {

                    countdown.textContent =
                        seconds;

                }


                if (progress) {

                    progress.style.transform =
                        `scaleX(${Math.max(
                            0,
                            seconds / 5
                        )})`;

                }


                if (seconds > 0) {

                    return;

                }


                if (downloadTimer) {

                    clearInterval(
                        downloadTimer
                    );

                    downloadTimer =
                        null;

                }


                if (status) {

                    status.textContent =
                        "Starting download...";

                }


                /* =========================================
                   FIRESTORE DOWNLOAD COUNT
                   ========================================= */

                try {

                    await increaseFirebaseDownloadCount();

                } catch (error) {

                    console.error(
                        "Download count error:",
                        error
                    );


                    if (status) {

                        status.textContent =
                            "Could not update download count.";

                    }


                    /*
                       Download count fail hone par
                       APK download continue nahi karenge.
                    */

                    downloadInProgress =
                        false;

                    return;

                }


                /* =========================================
                   APK DOWNLOAD
                   ========================================= */

                try {

                    startAPKDownload();


                    if (status) {

                        status.textContent =
                            "Download started ✓";

                    }


                    window.setTimeout(
                        function () {

                            closeDownloadModal();

                        },
                        1000
                    );

                } catch (error) {

                    console.error(
                        "APK download error:",
                        error
                    );


                    if (status) {

                        status.textContent =
                            "Could not start download.";

                    }


                    downloadInProgress =
                        false;

                }

            },
            1000
        );

}


/* =========================================================
   START APK DOWNLOAD
   ========================================================= */

function startAPKDownload() {

    const apkURL =
        getAPKURL();


    if (!apkURL) {

        throw new Error(
            "APK download URL is not configured."
        );

    }


    const link =
        document.createElement(
            "a"
        );


    link.href =
        apkURL;


    link.download =
        "super-video-player.apk";


    link.target =
        "_blank";


    link.rel =
        "noopener noreferrer";


    link.style.display =
        "none";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();

}


/* =========================================================
   CLOSE DOWNLOAD MODAL
   ========================================================= */

function closeDownloadModal() {

    const modal =
        get("downloadModal");


    if (!modal) {

        downloadInProgress =
            false;

        return;

    }


    modal.classList.remove(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    downloadInProgress =
        false;


    if (downloadTimer) {

        clearInterval(
            downloadTimer
        );

        downloadTimer =
            null;

    }

}


/* =========================================================
   FIRESTORE DOWNLOAD COUNT
   ========================================================= */

async function increaseFirebaseDownloadCount() {

    if (!db) {

        throw new Error(
            "Firestore is not initialized."
        );

    }


    if (!currentUser) {

        throw new Error(
            "Authentication required."
        );

    }


    const ref =
        db
            .collection("stats")
            .doc("main");


    await db.runTransaction(
        async function (transaction) {

            const snapshot =
                await transaction.get(
                    ref
                );


            let downloads =
                0;


            if (snapshot.exists) {

                const data =
                    snapshot.data() || {};


                downloads =
                    Number(
                        data.downloads || 0
                    );


                if (
                    !Number.isFinite(
                        downloads
                    ) ||
                    downloads < 0
                ) {

                    downloads =
                        0;

                }

            }


            transaction.set(
                ref,
                {
                    downloads:
                        downloads + 1,

                    updatedAt:
                        firebase.firestore
                            .FieldValue
                            .serverTimestamp()
                },
                {
                    merge:
                        true
                }
            );

        }
    );


    await loadDownloadCount();

}


/* =========================================================
   LOAD DOWNLOAD COUNT
   ========================================================= */

async function loadDownloadCount() {

    const countElement =
        get("downloadCount");


    if (!countElement) {

        return;

    }


    if (!db) {

        countElement.textContent =
            "0";

        return;

    }


    try {

        const snapshot =
            await db
                .collection("stats")
                .doc("main")
                .get();


        if (snapshot.exists) {

            const data =
                snapshot.data() || {};


            let downloads =
                Number(
                    data.downloads || 0
                );


            if (
                !Number.isFinite(
                    downloads
                ) ||
                downloads < 0
            ) {

                downloads =
                    0;

            }


            countElement.textContent =
                downloads.toLocaleString();

        } else {

            countElement.textContent =
                "0";

        }

    } catch (error) {

        console.error(
            "Download count load error:",
            error
        );


        countElement.textContent =
            "0";

    }

}


/* =========================================================
   AUTH MODAL CLICK OUTSIDE
   ========================================================= */

const authModal =
    get("authModal");


if (authModal) {

    authModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                authModal
            ) {

                closeAuth();

            }

        }
    );

}


/* =========================================================
   DOWNLOAD MODAL CLICK OUTSIDE
   ========================================================= */

const downloadModal =
    get("downloadModal");


if (downloadModal) {

    downloadModal.addEventListener(
        "click",
        function (event) {

            /*
               Active countdown ke time modal
               accidentally close nahi hoga.
            */

            if (
                event.target ===
                downloadModal &&
                !downloadInProgress
            ) {

                closeDownloadModal();

            }

        }
    );

}


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeAuth();

            /*
               Active download ko ESC se
               cancel nahi karenge.
            */

        }

    }
);


/* =========================================================
   FIREBASE CONFIG RESOLUTION
   ========================================================= */

function getFirebaseConfig() {

    /*
       Primary:
       FIREBASE_CONFIG

       Fallback:
       firebaseConfig
    */

    if (
        typeof FIREBASE_CONFIG !==
        "undefined"
    ) {

        return FIREBASE_CONFIG;

    }


    if (
        typeof firebaseConfig !==
        "undefined"
    ) {

        return firebaseConfig;

    }


    return null;

}


/* =========================================================
   FIREBASE INITIALIZATION
   ========================================================= */

function initializeFirebase() {

    try {

        /* =========================================
           CHECK FIREBASE SDK
           ========================================= */

        if (
            typeof firebase ===
            "undefined"
        ) {

            throw new Error(
                "Firebase SDK not loaded."
            );

        }


        /* =========================================
           CHECK CONFIG
           ========================================= */

        const config =
            getFirebaseConfig();


        if (!config) {

            throw new Error(
                "Firebase config was not found. Check firebase-config.js."
            );

        }


        /* =========================================
           INITIALIZE APP
           ========================================= */

        if (
            !firebase.apps.length
        ) {

            firebase.initializeApp(
                config
            );

        }


        /* =========================================
           AUTH
           ========================================= */

        auth =
            firebase.auth();


        /* =========================================
           FIRESTORE
           ========================================= */

        db =
            firebase.firestore();


        /* =========================================
           AUTH STATE
           ========================================= */

        auth.onAuthStateChanged(
            async function (user) {

                currentUser =
                    user || null;


                renderAuthState();


                /*
                   Real-time reviews.
                */

                loadReviews();


                /*
                   Real download count.
                */

                await loadDownloadCount();

            }
        );


    } catch (error) {

        console.error(
            "Firebase initialization error:",
            error
        );


        currentUser =
            null;


        auth =
            null;


        db =
            null;


        renderAuthState();


        const count =
            get("downloadCount");


        if (count) {

            count.textContent =
                "0";

        }


        const reviews =
            get("reviewsList");


        if (reviews) {

            reviews.innerHTML =
                `
                <div class="empty-state">
                    Firebase connection failed.
                </div>
                `;

        }

    }

}


/* =========================================================
   INITIALIZE FIREBASE
   ========================================================= */

initializeFirebase();


/* =========================================================
   END
   ========================================================= */
