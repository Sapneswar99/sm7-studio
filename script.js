/* =========================================================
   SUPER VIDEO PLAYER WEBSITE
   FIREBASE CONNECTED VERSION
   AUTH + REVIEWS + DOWNLOAD COUNTER
   FULL REPLACE SCRIPT
   ========================================================= */


/* =========================================================
   CONFIG
   ========================================================= */

const DEFAULT_APK_URL =
    "https://github.com/Sapneswar99/sm7-studio/releases/download/v1.0.0/Super.Video.Player.apk";


/*
   Agar firebase-config.js mein OWNER_UID defined hai,
   to wahi use hoga.

   Example:

   const OWNER_UID = "YOUR_REAL_FIREBASE_OWNER_UID";

   Agar yahan direct UID dena ho:

   const LOCAL_OWNER_UID = "YOUR_REAL_FIREBASE_OWNER_UID";
*/

const LOCAL_OWNER_UID = "yZsy5oOxhjU7BFnaCH67FOL3rjB2";


/* =========================================================
   FIREBASE VARIABLES
   ========================================================= */

let auth = null;
let db = null;

let currentUser = null;

let reviewsUnsubscribe = null;

let downloadTimer = null;

let downloadInProgress = false;


/* =========================================================
   DOM HELPER
   ========================================================= */

function get(id) {
    return document.getElementById(id);
}


/* =========================================================
   MESSAGE HELPER
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
        typeof LOCAL_OWNER_UID === "string" &&
        LOCAL_OWNER_UID.trim()
    ) {
        return LOCAL_OWNER_UID.trim();
    }

    return "";
}


/* =========================================================
   NAME VALIDATION
   ========================================================= */

function validName(name) {

    if (
        typeof name !== "string"
    ) {
        return false;
    }

    const value =
        name.trim();

    return (
        value.length >= 2 &&
        value.length <= 50
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
   SCREEN CONTROL
   ========================================================= */

function showLoginScreen() {

    const loginScreen =
        get("loginScreen");

    const mainApp =
        get("mainApp");


    if (loginScreen) {

        loginScreen.style.display =
            "flex";

        loginScreen.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    if (mainApp) {

        mainApp.style.display =
            "none";

        mainApp.setAttribute(
            "aria-hidden",
            "true"
        );

    }

}


function showMainApp() {

    const loginScreen =
        get("loginScreen");

    const mainApp =
        get("mainApp");


    if (loginScreen) {

        loginScreen.style.display =
            "none";

        loginScreen.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (mainApp) {

        mainApp.style.display =
            "block";

        mainApp.setAttribute(
            "aria-hidden",
            "false"
        );

    }

}


/* =========================================================
   LOGIN SCREEN INITIAL STATE
   ========================================================= */

(function prepareInitialScreen() {

    /*
       Main website hidden until Firebase confirms
       authentication state.
    */

    const loginScreen =
        get("loginScreen");

    const mainApp =
        get("mainApp");


    if (loginScreen) {

        loginScreen.style.display =
            "none";

        loginScreen.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (mainApp) {

        mainApp.style.display =
            "none";

        mainApp.setAttribute(
            "aria-hidden",
            "true"
        );

    }

})();


/* =========================================================
   CLEAR AUTH MESSAGES
   ========================================================= */

function clearAuthMessages() {

    const elements = [
        get("loginMessage"),
        get("registerMessage"),
        get("forgotMessage")
    ];


    elements.forEach(
        function (element) {

            if (!element) return;

            element.textContent =
                "";

            element.classList.remove(
                "success"
            );

        }
    );

}


/* =========================================================
   LOGIN FORM
   ========================================================= */

const loginForm =
    get("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            await loginWithEmailPassword();

        }
    );

}


/* =========================================================
   LOGIN WITH EMAIL + PASSWORD
   ========================================================= */

async function loginWithEmailPassword() {

    const emailInput =
        get("loginEmail");

    const passwordInput =
        get("loginPassword");

    const message =
        get("loginMessage");

    const submit =
        get("loginSubmit");


    if (!auth) {

        setFormMessage(
            message,
            "Firebase is not connected."
        );

        return;

    }


    const email =
        emailInput
            ? emailInput.value.trim()
            : "";


    const password =
        passwordInput
            ? passwordInput.value
            : "";


    if (!email) {

        setFormMessage(
            message,
            "Please enter your email."
        );

        return;

    }


    if (!password) {

        setFormMessage(
            message,
            "Please enter your password."
        );

        return;

    }


    if (submit) {

        submit.disabled =
            true;

        submit.textContent =
            "Logging in...";

    }


    try {

        await auth.signInWithEmailAndPassword(
            email,
            password
        );


        setFormMessage(
            message,
            "Login successful.",
            true
        );


    } catch (error) {

        console.error(
            "Email login error:",
            error
        );


        setFormMessage(
            message,
            getFirebaseAuthErrorMessage(
                error
            )
        );

    } finally {

        if (submit) {

            submit.disabled =
                false;

            submit.textContent =
                "Login";

        }

    }

}


/* =========================================================
   GOOGLE LOGIN
   ========================================================= */

async function loginWithGoogle() {

    const message =
        get("loginMessage");


    if (!auth) {

        setFormMessage(
            message,
            "Firebase is not connected."
        );

        return;

    }


    const button =
        get("googleLoginButton");


    if (button) {

        button.disabled =
            true;

        button.style.opacity =
            "0.6";

    }


    try {

        const provider =
            new firebase.auth.GoogleAuthProvider();


        provider.setCustomParameters({
            prompt: "select_account"
        });


        const result =
            await auth.signInWithPopup(
                provider
            );


        const user =
            result.user;


        if (user) {

            await saveUserProfile(
                user
            );

        }


    } catch (error) {

        console.error(
            "Google login error:",
            error
        );


        /*
           Popup closed by user ko error
           message ke roop mein show nahi karenge.
        */

        if (
            error.code !==
            "auth/popup-closed-by-user"
        ) {

            setFormMessage(
                message,
                getFirebaseAuthErrorMessage(
                    error
                )
            );

        }

    } finally {

        if (button) {

            button.disabled =
                false;

            button.style.opacity =
                "";

        }

    }

}


/* =========================================================
   GOOGLE REGISTER
   ========================================================= */

async function registerWithGoogle() {

    const message =
        get("registerMessage");


    if (!auth) {

        setFormMessage(
            message,
            "Firebase is not connected."
        );

        return;

    }


    const button =
        get("googleRegisterButton");


    if (button) {

        button.disabled =
            true;

        button.style.opacity =
            "0.6";

    }


    try {

        const provider =
            new firebase.auth.GoogleAuthProvider();


        provider.setCustomParameters({
            prompt: "select_account"
        });


        const result =
            await auth.signInWithPopup(
                provider
            );


        const user =
            result.user;


        if (user) {

            await saveUserProfile(
                user
            );

        }


        closeRegisterModal();


    } catch (error) {

        console.error(
            "Google register error:",
            error
        );


        if (
            error.code !==
            "auth/popup-closed-by-user"
        ) {

            setFormMessage(
                message,
                getFirebaseAuthErrorMessage(
                    error
                )
            );

        }

    } finally {

        if (button) {

            button.disabled =
                false;

            button.style.opacity =
                "";

        }

    }

}


/* =========================================================
   REGISTER FORM
   ========================================================= */

const registerForm =
    get("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            await registerWithEmailPassword();

        }
    );

}


/* =========================================================
   REGISTER WITH EMAIL + PASSWORD
   ========================================================= */

async function registerWithEmailPassword() {

    const nameInput =
        get("registerName");

    const emailInput =
        get("registerEmail");

    const passwordInput =
        get("registerPassword");

    const message =
        get("registerMessage");

    const submit =
        get("registerSubmit");


    if (!auth || !db) {

        setFormMessage(
            message,
            "Firebase is not connected."
        );

        return;

    }


    const name =
        nameInput
            ? nameInput.value.trim()
            : "";


    const email =
        emailInput
            ? emailInput.value.trim()
            : "";


    const password =
        passwordInput
            ? passwordInput.value
            : "";


    if (!validName(name)) {

        setFormMessage(
            message,
            "Name must be between 2 and 50 characters."
        );

        return;

    }


    if (!email) {

        setFormMessage(
            message,
            "Please enter your email."
        );

        return;

    }


    if (!validPassword(password)) {

        setFormMessage(
            message,
            "Password must be at least 6 characters."
        );

        return;

    }


    if (submit) {

        submit.disabled =
            true;

        submit.textContent =
            "Creating Account...";

    }


    try {

        const credential =
            await auth.createUserWithEmailAndPassword(
                email,
                password
            );


        const user =
            credential.user;


        if (user) {

            try {

                await user.updateProfile({
                    displayName:
                        name
                });

            } catch (profileError) {

                console.warn(
                    "Profile update warning:",
                    profileError
                );

            }


            await saveUserProfile(
                user,
                name
            );

        }


        setFormMessage(
            message,
            "Account created successfully.",
            true
        );


        if (registerForm) {

            registerForm.reset();

        }


        window.setTimeout(
            function () {

                closeRegisterModal();

            },
            700
        );


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        setFormMessage(
            message,
            getFirebaseAuthErrorMessage(
                error
            )
        );

    } finally {

        if (submit) {

            submit.disabled =
                false;

            submit.textContent =
                "Create Account";

        }

    }

}


/* =========================================================
   SAVE USER PROFILE
   ========================================================= */

async function saveUserProfile(
    user,
    fallbackName = ""
) {

    if (!user || !db) {

        return;

    }


    const name =
        (
            user.displayName ||
            fallbackName ||
            "User"
        ).trim();


    const email =
        user.email ||
        "";


    try {

        await db
            .collection("users")
            .doc(user.uid)
            .set(
                {
                    uid:
                        user.uid,

                    name:
                        name,

                    email:
                        email,

                    photoURL:
                        user.photoURL ||
                        "",

                    provider:
                        user.providerData &&
                        user.providerData[0]
                            ? user.providerData[0]
                                .providerId
                            : "password",

                    updatedAt:
                        firebase.firestore
                            .FieldValue
                            .serverTimestamp(),

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

    } catch (error) {

        console.error(
            "Save user profile error:",
            error
        );

        /*
           Authentication successful hai,
           isliye profile write fail hone par
           user ko logout nahi karenge.
        */

    }

}


/* =========================================================
   FORGOT PASSWORD BUTTON
   ========================================================= */

const loginForgotPassword =
    get("loginForgotPassword");


if (loginForgotPassword) {

    loginForgotPassword.addEventListener(
        "click",
        function () {

            openForgotModal();

        }
    );

}


/* =========================================================
   FORGOT PASSWORD FORM
   ========================================================= */

const forgotForm =
    get("forgotForm");


if (forgotForm) {

    forgotForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            await sendPasswordReset();

        }
    );

}


/* =========================================================
   SEND PASSWORD RESET
   ========================================================= */

async function sendPasswordReset() {

    const emailInput =
        get("forgotEmail");

    const message =
        get("forgotMessage");

    const submit =
        get("forgotSubmit");


    if (!auth) {

        setFormMessage(
            message,
            "Firebase is not connected."
        );

        return;

    }


    const email =
        emailInput
            ? emailInput.value.trim()
            : "";


    if (!email) {

        setFormMessage(
            message,
            "Please enter your registered email."
        );

        return;

    }


    if (submit) {

        submit.disabled =
            true;

        submit.textContent =
            "Sending...";

    }


    try {

        await auth.sendPasswordResetEmail(
            email
        );


        setFormMessage(
            message,
            "Password reset email sent. Please check your inbox.",
            true
        );


    } catch (error) {

        console.error(
            "Password reset error:",
            error
        );


        setFormMessage(
            message,
            getFirebaseAuthErrorMessage(
                error
            )
        );

    } finally {

        if (submit) {

            submit.disabled =
                false;

            submit.textContent =
                "Send Reset Link";

        }

    }

}


/* =========================================================
   OPEN REGISTER MODAL
   ========================================================= */

const openRegisterButton =
    get("openRegisterButton");


if (openRegisterButton) {

    openRegisterButton.addEventListener(
        "click",
        function () {

            openRegisterModal();

        }
    );

}


/* =========================================================
   OPEN REGISTER MODAL
   ========================================================= */

function openRegisterModal() {

    const modal =
        get("registerModal");


    if (!modal) return;


    clearAuthMessages();


    modal.classList.add(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    const name =
        get("registerName");


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
   CLOSE REGISTER MODAL
   ========================================================= */

function closeRegisterModal() {

    const modal =
        get("registerModal");


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
   REGISTER CLOSE BUTTON
   ========================================================= */

const registerClose =
    get("registerClose");


if (registerClose) {

    registerClose.addEventListener(
        "click",
        function () {

            closeRegisterModal();

        }
    );

}


/* =========================================================
   BACK TO LOGIN
   ========================================================= */

const backToLoginButton =
    get("backToLoginButton");


if (backToLoginButton) {

    backToLoginButton.addEventListener(
        "click",
        function () {

            closeRegisterModal();

            clearAuthMessages();

        }
    );

}


/* =========================================================
   OPEN FORGOT PASSWORD MODAL
   ========================================================= */

function openForgotModal() {

    const modal =
        get("forgotModal");


    if (!modal) return;


    clearAuthMessages();


    modal.classList.add(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    const loginEmail =
        get("loginEmail");

    const forgotEmail =
        get("forgotEmail");


    /*
       Login email already entered hai to
       forgot password field mein automatically
       copy kar denge.
    */

    if (
        forgotEmail &&
        loginEmail &&
        loginEmail.value.trim()
    ) {

        forgotEmail.value =
            loginEmail.value.trim();

    }


    if (forgotEmail) {

        window.setTimeout(
            function () {

                forgotEmail.focus();

            },
            100
        );

    }

}


/* =========================================================
   CLOSE FORGOT MODAL
   ========================================================= */

function closeForgotModal() {

    const modal =
        get("forgotModal");


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
   FORGOT CLOSE
   ========================================================= */

const forgotClose =
    get("forgotClose");


if (forgotClose) {

    forgotClose.addEventListener(
        "click",
        function () {

            closeForgotModal();

        }
    );

}


/* =========================================================
   FORGOT BACK LOGIN
   ========================================================= */

const forgotBackLogin =
    get("forgotBackLogin");


if (forgotBackLogin) {

    forgotBackLogin.addEventListener(
        "click",
        function () {

            closeForgotModal();

        }
    );

}


/* =========================================================
   GOOGLE BUTTONS
   ========================================================= */

const googleLoginButton =
    get("googleLoginButton");


if (googleLoginButton) {

    googleLoginButton.addEventListener(
        "click",
        function () {

            loginWithGoogle();

        }
    );

}


const googleRegisterButton =
    get("googleRegisterButton");


if (googleRegisterButton) {

    googleRegisterButton.addEventListener(
        "click",
        function () {

            registerWithGoogle();

        }
    );

}


/* =========================================================
   LOGOUT
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
   AUTH STATE
   ========================================================= */

function renderAuthState() {

    const loggedUserName =
        get("loggedUserName");

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
           USER LOGGED IN
           ========================================= */

        showMainApp();


        if (loggedUserName) {

            loggedUserName.textContent =
                currentUser.displayName ||
                currentUser.email ||
                "User";

        }


        if (reviewUser) {

            reviewUser.hidden =
                false;

        }


        if (reviewUserName) {

            reviewUserName.textContent =
                currentUser.displayName ||
                currentUser.email ||
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
           USER LOGGED OUT
           ========================================= */

        showLoginScreen();


        if (loggedUserName) {

            loggedUserName.textContent =
                "";

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

    const submit =
        get("reviewSubmit");


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
                        currentUser.email ||
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
               TOP
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

                } catch (error) {

                    console.warn(
                        "Review date error:",
                        error
                    );

                }

            }


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


            let rating =
                Number(
                    data.rating || 5
                );


            if (
                !Number.isInteger(
                    rating
                )
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


            ratingElement.textContent =
                "★".repeat(
                    rating
                ) +
                "☆".repeat(
                    5 - rating
                );


            top.appendChild(
                info
            );

            top.appendChild(
                ratingElement
            );


            /* =========================================
               REVIEW TEXT
               ========================================= */

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
               OWNER DELETE
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
   DOWNLOAD BUTTONS
   ========================================================= */

const heroDownloadButton =
    get("heroDownloadButton");


if (heroDownloadButton) {

    heroDownloadButton.addEventListener(
        "click",
        function () {

            startDownload();

        }
    );

}


const downloadButton =
    get("downloadButton");


if (downloadButton) {

    downloadButton.addEventListener(
        "click",
        function () {

            startDownload();

        }
    );

}


/* =========================================================
   START DOWNLOAD
   ========================================================= */

async function startDownload() {

    if (!currentUser) {

        return;

    }


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


                    downloadInProgress =
                        false;

                    return;

                }


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


    /*
       GitHub Release external APK ke liye
       browser behavior reliable rakhne ke liye
       target blank use kiya gaya hai.
    */

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


    if (modal) {

        modal.classList.remove(
            "show"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


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


            /*
               IMPORTANT:

               Firestore rules ke according
               existing document mein exactly
               +1 hona chahiye.
            */

            if (snapshot.exists) {

                transaction.update(
                    ref,
                    {
                        downloads:
                            downloads + 1,

                        updatedAt:
                            firebase.firestore
                                .FieldValue
                                .serverTimestamp()
                    }
                );

            } else {

                transaction.set(
                    ref,
                    {
                        downloads:
                            1,

                        updatedAt:
                            firebase.firestore
                                .FieldValue
                                .serverTimestamp()
                    }
                );

            }

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


        if (
            snapshot.exists
        ) {

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
   MODAL OUTSIDE CLICK
   ========================================================= */

const registerModal =
    get("registerModal");


if (registerModal) {

    registerModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                registerModal
            ) {

                closeRegisterModal();

            }

        }
    );

}


const forgotModal =
    get("forgotModal");


if (forgotModal) {

    forgotModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                forgotModal
            ) {

                closeForgotModal();

            }

        }
    );

}


const downloadModal =
    get("downloadModal");


if (downloadModal) {

    downloadModal.addEventListener(
        "click",
        function (event) {

            /*
               Countdown ke waqt outside click se
               modal close nahi hoga.
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
            event.key !==
            "Escape"
        ) {

            return;

        }


        closeRegisterModal();

        closeForgotModal();

        /*
           Active APK countdown ko ESC se
           cancel nahi kiya jayega.
        */

    }
);


/* =========================================================
   FIREBASE CONFIG RESOLUTION
   ========================================================= */

function getFirebaseConfig() {

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
   FIREBASE ERROR MESSAGE
   ========================================================= */

function getFirebaseAuthErrorMessage(
    error
) {

    if (!error) {

        return "Authentication failed. Please try again.";

    }


    const code =
        error.code ||
        "";


    if (
        code ===
        "auth/invalid-email"
    ) {

        return "Please enter a valid email address.";

    }


    if (
        code ===
        "auth/user-not-found"
    ) {

        return "No account was found with this email.";

    }


    if (
        code ===
        "auth/wrong-password"
    ) {

        return "Incorrect password.";

    }


    if (
        code ===
        "auth/invalid-credential"
    ) {

        return "Incorrect email or password.";

    }


    if (
        code ===
        "auth/email-already-in-use"
    ) {

        return "An account with this email already exists.";

    }


    if (
        code ===
        "auth/weak-password"
    ) {

        return "Password is too weak. Use at least 6 characters.";

    }


    if (
        code ===
        "auth/network-request-failed"
    ) {

        return "Network error. Please check your internet connection.";

    }


    if (
        code ===
        "auth/too-many-requests"
    ) {

        return "Too many attempts. Please wait and try again.";

    }


    if (
        code ===
        "auth/popup-blocked"
    ) {

        return "Google login popup was blocked. Please allow popups and try again.";

    }


    if (
        code ===
        "auth/popup-closed-by-user"
    ) {

        return "Google login was cancelled.";

    }


    if (
        code ===
        "auth/account-exists-with-different-credential"
    ) {

        return "An account already exists with a different sign-in method.";

    }


    if (
        error.message &&
        typeof error.message ===
            "string"
    ) {

        return error.message;

    }


    return "Authentication failed. Please try again.";

}


/* =========================================================
   FIREBASE INITIALIZATION
   ========================================================= */

function initializeFirebase() {

    try {

        /* =========================================
           CHECK SDK
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
           CONFIG
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


                /*
                   User profile Firestore mein
                   maintain karenge.
                */

                if (currentUser) {

                    await saveUserProfile(
                        currentUser
                    );

                }


                renderAuthState();


                /*
                   Reviews listener.
                */

                loadReviews();


                /*
                   Download count.
                */

                await loadDownloadCount();

            }
        );


    } catch (error) {

        console.error(
            "Firebase initialization error:",
            error
        );


        auth =
            null;

        db =
            null;

        currentUser =
            null;


        showLoginScreen();


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
   START FIREBASE
   ========================================================= */

initializeFirebase();


/* =========================================================
   END OF SCRIPT
   ========================================================= */
