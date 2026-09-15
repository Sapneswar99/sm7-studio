"use strict";

/* =========================================================
   SUPER VIDEO PLAYER
   Firebase Authentication + Firestore
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const DEFAULT_APK_URL =
    "https://github.com/Sapneswar99/sm7-studio/releases/download/v1.0.0/Super.Video.Player.apk";

const APP_LOGO_URL =
    "https://i.ibb.co/KcSWFnx9/Super-Video-Player-Logo.png";


/*
   OWNER_UID intentionally blank.

   Jab actual owner UID available ho:
   firebase-config.js me OWNER_UID set karein.
*/
const LOCAL_OWNER_UID =
    typeof OWNER_UID !== "undefined"
        ? String(OWNER_UID || "").trim()
        : "";


/* =========================================================
   FIREBASE
========================================================= */

let auth = null;
let db = null;

let currentUser = null;

let reviewsUnsubscribe = null;

let loadingFinished = false;
let authReady = false;

let downloadInProgress = false;


/* =========================================================
   HELPERS
========================================================= */

function get(id) {
    return document.getElementById(id);
}

function safeText(value) {
    return String(value ?? "");
}

function setMessage(element, message, type = "") {

    if (!element) {
        return;
    }

    element.textContent = message || "";

    element.classList.remove(
        "error",
        "success"
    );

    if (type) {
        element.classList.add(type);
    }
}

function setButtonLoading(button, loading, loadingText, normalText) {

    if (!button) {
        return;
    }

    button.disabled = loading;

    if (loading) {
        button.dataset.originalText =
            button.textContent;

        button.textContent =
            loadingText || "Please wait...";
    } else {
        button.textContent =
            normalText ||
            button.dataset.originalText ||
            "Submit";
    }
}

function escapeHtml(value) {

    return safeText(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   DOM
========================================================= */

const loadingScreen = get("loadingScreen");

const loginScreen = get("loginScreen");
const mainApp = get("mainApp");

const googleLoginButton =
    get("googleLoginButton");

const loginForm =
    get("loginForm");

const loginEmail =
    get("loginEmail");

const loginPassword =
    get("loginPassword");

const loginForgotPassword =
    get("loginForgotPassword");

const loginSubmit =
    get("loginSubmit");

const loginMessage =
    get("loginMessage");

const openRegisterButton =
    get("openRegisterButton");

const logoutButton =
    get("logoutButton");

const profileButton =
    get("profileButton");

const profileAvatar =
    get("profileAvatar");

const loggedUserName =
    get("loggedUserName");

const heroDownloadButton =
    get("heroDownloadButton");

const downloadButton =
    get("downloadButton");

const downloadCount =
    get("downloadCount");

const reviewForm =
    get("reviewForm");

const reviewUser =
    get("reviewUser");

const reviewUserName =
    get("reviewUserName");

const starRating =
    get("starRating");

const ratingStars =
    document.querySelectorAll(".rating-star");

const reviewRating =
    get("reviewRating");

const reviewText =
    get("reviewText");

const reviewSubmit =
    get("reviewSubmit");

const reviewMessage =
    get("reviewMessage");

const reviewsList =
    get("reviewsList");

const profileModal =
    get("profileModal");

const profileClose =
    get("profileClose");

const profileModalAvatar =
    get("profileModalAvatar");

const profileEmail =
    get("profileEmail");

const profileForm =
    get("profileForm");

const profileName =
    get("profileName");

const profileUsername =
    get("profileUsername");

const profileSaveButton =
    get("profileSaveButton");

const profileMessage =
    get("profileMessage");

const registerModal =
    get("registerModal");

const registerClose =
    get("registerClose");

const googleRegisterButton =
    get("googleRegisterButton");

const registerForm =
    get("registerForm");

const registerName =
    get("registerName");

const registerEmail =
    get("registerEmail");

const registerPassword =
    get("registerPassword");

const registerSubmit =
    get("registerSubmit");

const registerMessage =
    get("registerMessage");

const backToLoginButton =
    get("backToLoginButton");

const forgotModal =
    get("forgotModal");

const forgotClose =
    get("forgotClose");

const forgotForm =
    get("forgotForm");

const forgotEmail =
    get("forgotEmail");

const forgotSubmit =
    get("forgotSubmit");

const forgotMessage =
    get("forgotMessage");

const forgotBackLogin =
    get("forgotBackLogin");

const downloadModal =
    get("downloadModal");

const downloadCountdown =
    get("downloadCountdown");

const downloadCountdownText =
    get("downloadCountdownText");

const yearElement =
    get("year");


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);

function initializeApp() {

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }

    setupEventListeners();

    initializeFirebase();

    startThreeSecondLoading();
}


/* =========================================================
   FIREBASE INITIALIZATION
========================================================= */

function initializeFirebase() {

    try {

        if (
            typeof firebase === "undefined"
        ) {
            throw new Error(
                "Firebase SDK could not be loaded."
            );
        }

        if (
            typeof FIREBASE_CONFIG === "undefined"
        ) {
            throw new Error(
                "FIREBASE_CONFIG is missing from firebase-config.js."
            );
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(
                FIREBASE_CONFIG
            );
        }

        auth = firebase.auth();
        db = firebase.firestore();

        /*
         * Keep the user logged in across visits.
         */
        auth.setPersistence(
            firebase.auth.Auth.Persistence.LOCAL
        ).catch(function(error) {

            console.warn(
                "Auth persistence error:",
                error
            );

        });

        auth.onAuthStateChanged(
            async function(user) {

                currentUser = user || null;

                authReady = true;

                await handleAuthState();

                tryRenderApp();

            }
        );

    } catch (error) {

        console.error(
            "Firebase initialization failed:",
            error
        );

        authReady = true;

        setTimeout(function() {

            if (!loadingFinished) {
                return;
            }

            showLoginScreen();

            setMessage(
                loginMessage,
                "Firebase could not be initialized. Please check firebase-config.js.",
                "error"
            );

        }, 50);
    }
}


/* =========================================================
   THREE SECOND LOADING
========================================================= */

function startThreeSecondLoading() {

    /*
     * Loading animation always runs for 3 seconds.
     */
    setTimeout(function() {

        loadingFinished = true;

        tryRenderApp();

    }, 3000);
}


/* =========================================================
   AUTH STATE
========================================================= */

async function handleAuthState() {

    if (!currentUser) {

        stopReviewsListener();

        return;
    }

    updateUserUI();

    await ensureUserProfile();

    loadDownloadCount();

    startReviewsListener();
}


function tryRenderApp() {

    if (!loadingFinished) {
        return;
    }

    if (!authReady) {
        return;
    }

    hideLoadingScreen();

    if (currentUser) {
        showMainApp();
    } else {
        showLoginScreen();
    }
}


/* =========================================================
   SCREEN MANAGEMENT
========================================================= */

function hideLoadingScreen() {

    if (!loadingScreen) {
        return;
    }

    loadingScreen.classList.add("hidden");

    loadingScreen.style.opacity = "0";
    loadingScreen.style.visibility = "hidden";
    loadingScreen.style.pointerEvents = "none";

    setTimeout(function() {

        if (loadingScreen) {
            loadingScreen.style.display = "none";
        }

    }, 600);
}


function showLoginScreen() {

    closeAllModals();

    if (mainApp) {
        mainApp.classList.remove("show");
        mainApp.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    if (loginScreen) {

        loginScreen.classList.add("show");

        loginScreen.setAttribute(
            "aria-hidden",
            "false"
        );
    }
}


function showMainApp() {

    if (!currentUser) {
        showLoginScreen();
        return;
    }

    if (loginScreen) {

        loginScreen.classList.remove("show");

        loginScreen.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    if (mainApp) {

        mainApp.classList.add("show");

        mainApp.setAttribute(
            "aria-hidden",
            "false"
        );
    }

    updateUserUI();
}


/* =========================================================
   USER UI
========================================================= */

function getUserDisplayName(user) {

    if (!user) {
        return "User";
    }

    return (
        user.displayName ||
        user.email?.split("@")[0] ||
        "User"
    );
}


function getInitials(name) {

    const cleanName =
        safeText(name)
            .trim()
            .replace(/\s+/g, " ");

    if (!cleanName) {
        return "U";
    }

    const parts =
        cleanName.split(" ");

    if (parts.length === 1) {
        return parts[0]
            .substring(0, 1)
            .toUpperCase();
    }

    return (
        parts[0].substring(0, 1) +
        parts[parts.length - 1].substring(0, 1)
    ).toUpperCase();
}


function updateUserUI() {

    if (!currentUser) {
        return;
    }

    const name =
        getUserDisplayName(currentUser);

    const initials =
        getInitials(name);

    if (loggedUserName) {
        loggedUserName.textContent = name;
    }

    if (profileAvatar) {
        profileAvatar.textContent = initials;
    }

    if (profileModalAvatar) {
        profileModalAvatar.textContent = initials;
    }

    if (profileEmail) {
        profileEmail.textContent =
            currentUser.email || "—";
    }

    if (reviewUserName) {
        reviewUserName.textContent = name;
    }

    /*
     * If Google has profile photo, use it.
     * Otherwise initials remain visible.
     */
    if (
        currentUser.photoURL &&
        profileAvatar
    ) {

        profileAvatar.innerHTML =
            '<img src="' +
            escapeHtml(currentUser.photoURL) +
            '" alt="Profile">';

        profileAvatar.style.padding = "0";
        profileAvatar.style.overflow = "hidden";

        const image =
            profileAvatar.querySelector("img");

        if (image) {

            image.style.width = "100%";
            image.style.height = "100%";
            image.style.objectFit = "cover";
        }
    }
}


/* =========================================================
   USER PROFILE
========================================================= */

async function ensureUserProfile() {

    if (!currentUser || !db) {
        return;
    }

    try {

        const ref =
            db.collection("users")
                .doc(currentUser.uid);

        const snapshot =
            await ref.get();

        if (snapshot.exists) {

            const data =
                snapshot.data() || {};

            if (profileName) {
                profileName.value =
                    data.name ||
                    currentUser.displayName ||
                    "";
            }

            if (profileUsername) {
                profileUsername.value =
                    data.username ||
                    "";
            }

            return;
        }

        const defaultName =
            currentUser.displayName ||
            currentUser.email?.split("@")[0] ||
            "User";

        const defaultUsername =
            createDefaultUsername(
                currentUser
            );

        await ref.set({

            uid: currentUser.uid,

            name: defaultName,

            username: defaultUsername,

            email:
                currentUser.email || "",

            createdAt:
                firebase.firestore.FieldValue.serverTimestamp(),

            updatedAt:
                firebase.firestore.FieldValue.serverTimestamp()

        });

        if (profileName) {
            profileName.value = defaultName;
        }

        if (profileUsername) {
            profileUsername.value =
                defaultUsername;
        }

    } catch (error) {

        console.error(
            "ensureUserProfile:",
            error
        );
    }
}


function createDefaultUsername(user) {

    const base =
        (
            user.displayName ||
            user.email?.split("@")[0] ||
            "user"
        )
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .substring(0, 20);

    const suffix =
        safeText(user.uid)
            .substring(0, 5)
            .toLowerCase();

    return (
        base || "user"
    ) + suffix;
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

function setupEventListeners() {

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleEmailLogin
        );
    }

    if (googleLoginButton) {

        googleLoginButton.addEventListener(
            "click",
            handleGoogleLogin
        );
    }

    if (loginForgotPassword) {

        loginForgotPassword.addEventListener(
            "click",
            function() {

                const email =
                    loginEmail?.value?.trim() || "";

                if (forgotEmail) {
                    forgotEmail.value = email;
                }

                openModal(forgotModal);

            }
        );
    }

    if (openRegisterButton) {

        openRegisterButton.addEventListener(
            "click",
            function() {

                setMessage(
                    registerMessage,
                    ""
                );

                openModal(registerModal);

            }
        );
    }

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            handleEmailRegistration
        );
    }

    if (googleRegisterButton) {

        googleRegisterButton.addEventListener(
            "click",
            handleGoogleRegistration
        );
    }

    if (backToLoginButton) {

        backToLoginButton.addEventListener(
            "click",
            function() {

                closeModal(registerModal);

                setMessage(
                    loginMessage,
                    ""
                );

            }
        );
    }

    if (forgotForm) {

        forgotForm.addEventListener(
            "submit",
            handleForgotPassword
        );
    }

    if (forgotBackLogin) {

        forgotBackLogin.addEventListener(
            "click",
            function() {

                closeModal(forgotModal);

            }
        );
    }

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            handleLogout
        );
    }

    if (profileButton) {

        profileButton.addEventListener(
            "click",
            openProfile
        );
    }

    if (profileClose) {

        profileClose.addEventListener(
            "click",
            function() {

                closeModal(profileModal);

            }
        );
    }

    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            handleProfileSave
        );
    }

    if (registerClose) {

        registerClose.addEventListener(
            "click",
            function() {

                closeModal(registerModal);

            }
        );
    }

    if (forgotClose) {

        forgotClose.addEventListener(
            "click",
            function() {

                closeModal(forgotModal);

            }
        );
    }

    if (heroDownloadButton) {

        heroDownloadButton.addEventListener(
            "click",
            startDownload
        );
    }

    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            startDownload
        );
    }

    if (reviewForm) {

        reviewForm.addEventListener(
            "submit",
            handleReviewSubmit
        );
    }

    ratingStars.forEach(
        function(star) {

            star.addEventListener(
                "click",
                function() {

                    const rating =
                        Number(
                            star.dataset.rating
                        );

                    selectRating(rating);

                }
            );

            star.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key === "ArrowRight" ||
                        event.key === "ArrowUp"
                    ) {

                        event.preventDefault();

                        const current =
                            Number(
                                reviewRating?.value || 0
                            );

                        selectRating(
                            Math.min(5, current + 1)
                        );
                    }

                    if (
                        event.key === "ArrowLeft" ||
                        event.key === "ArrowDown"
                    ) {

                        event.preventDefault();

                        const current =
                            Number(
                                reviewRating?.value || 1
                            );

                        selectRating(
                            Math.max(1, current - 1)
                        );
                    }
                }
            );
        }
    );


    /*
     * Modal backdrop click.
     */
    document.addEventListener(
        "click",
        function(event) {

            if (
                event.target.classList &&
                event.target.classList.contains("modal")
            ) {

                closeModal(event.target);

            }
        }
    );


    /*
     * Escape closes normal modals.
     * Download countdown is not cancellable.
     */
    document.addEventListener(
        "keydown",
        function(event) {

            if (event.key !== "Escape") {
                return;
            }

            if (
                downloadModal &&
                downloadModal.classList.contains("show")
            ) {
                return;
            }

            closeAllModals();

        }
    );
}


/* =========================================================
   EMAIL LOGIN
========================================================= */

async function handleEmailLogin(event) {

    event.preventDefault();

    if (!auth) {

        setMessage(
            loginMessage,
            "Firebase is not ready yet.",
            "error"
        );

        return;
    }

    const email =
        loginEmail.value.trim();

    const password =
        loginPassword.value;

    if (!email || !password) {
        return;
    }

    setMessage(
        loginMessage,
        "Signing in..."
    );

    setButtonLoading(
        loginSubmit,
        true,
        "Signing in...",
        "Login"
    );

    try {

        await auth.signInWithEmailAndPassword(
            email,
            password
        );

        setMessage(
            loginMessage,
            "Login successful.",
            "success"
        );

        loginForm.reset();

    } catch (error) {

        console.error(
            "Email login error:",
            error
        );

        setMessage(
            loginMessage,
            getFirebaseErrorMessage(error),
            "error"
        );

    } finally {

        setButtonLoading(
            loginSubmit,
            false,
            "",
            "Login"
        );
    }
}


/* =========================================================
   GOOGLE LOGIN
========================================================= */

async function handleGoogleLogin() {

    await signInWithGoogle(
        loginMessage,
        googleLoginButton
    );
}


async function handleGoogleRegistration() {

    await signInWithGoogle(
        registerMessage,
        googleRegisterButton
    );
}


async function signInWithGoogle(
    messageElement,
    button
) {

    if (!auth) {

        setMessage(
            messageElement,
            "Firebase is not ready yet.",
            "error"
        );

        return;
    }

    setButtonLoading(
        button,
        true,
        "Connecting...",
        "Continue with Google"
    );

    setMessage(
        messageElement,
        "Opening Google Sign-In..."
    );

    try {

        const provider =
            new firebase.auth.GoogleAuthProvider();

        provider.setCustomParameters({
            prompt: "select_account"
        });

        await auth.signInWithPopup(
            provider
        );

        closeModal(registerModal);

        setMessage(
            messageElement,
            "Google login successful.",
            "success"
        );

    } catch (error) {

        console.error(
            "Google login error:",
            error
        );

        /*
         * On mobile browsers popup can be blocked.
         * Redirect fallback handles that case.
         */
        if (
            error &&
            (
                error.code ===
                    "auth/popup-blocked" ||
                error.code ===
                    "auth/popup-cancelled"
            )
        ) {

            try {

                const provider =
                    new firebase.auth.GoogleAuthProvider();

                await auth.signInWithRedirect(
                    provider
                );

                return;

            } catch (redirectError) {

                console.error(
                    "Google redirect error:",
                    redirectError
                );

                setMessage(
                    messageElement,
                    getFirebaseErrorMessage(
                        redirectError
                    ),
                    "error"
                );

            }

        } else {

            setMessage(
                messageElement,
                getFirebaseErrorMessage(error),
                "error"
            );
        }

    } finally {

        setButtonLoading(
            button,
            false,
            "",
            "Continue with Google"
        );
    }
}


/* =========================================================
   REGISTER
========================================================= */

async function handleEmailRegistration(event) {

    event.preventDefault();

    if (!auth) {

        setMessage(
            registerMessage,
            "Firebase is not ready yet.",
            "error"
        );

        return;
    }

    const name =
        registerName.value.trim();

    const email =
        registerEmail.value.trim();

    const password =
        registerPassword.value;

    if (name.length < 2) {

        setMessage(
            registerMessage,
            "Please enter your full name.",
            "error"
        );

        return;
    }

    if (password.length < 6) {

        setMessage(
            registerMessage,
            "Password must contain at least 6 characters.",
            "error"
        );

        return;
    }

    setButtonLoading(
        registerSubmit,
        true,
        "Creating...",
        "Create Account"
    );

    setMessage(
        registerMessage,
        "Creating your account..."
    );

    try {

        const credential =
            await auth.createUserWithEmailAndPassword(
                email,
                password
            );

        const user =
            credential.user;

        /*
         * Set Firebase Auth display name.
         */
        await user.updateProfile({
            displayName: name
        });

        /*
         * Create Firestore profile.
         */
        if (db) {

            const username =
                createDefaultUsername(user);

            await db
                .collection("users")
                .doc(user.uid)
                .set({

                    uid: user.uid,

                    name: name,

                    username: username,

                    email:
                        user.email || email,

                    createdAt:
                        firebase.firestore.FieldValue.serverTimestamp(),

                    updatedAt:
                        firebase.firestore.FieldValue.serverTimestamp()

                }, {
                    merge: true
                });
        }

        registerForm.reset();

        closeModal(registerModal);

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        setMessage(
            registerMessage,
            getFirebaseErrorMessage(error),
            "error"
        );

    } finally {

        setButtonLoading(
            registerSubmit,
            false,
            "",
            "Create Account"
        );
    }
}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

async function handleForgotPassword(event) {

    event.preventDefault();

    if (!auth) {

        setMessage(
            forgotMessage,
            "Firebase is not ready yet.",
            "error"
        );

        return;
    }

    const email =
        forgotEmail.value.trim();

    if (!email) {
        return;
    }

    setButtonLoading(
        forgotSubmit,
        true,
        "Sending...",
        "Send Reset Link"
    );

    setMessage(
        forgotMessage,
        "Sending password reset email..."
    );

    try {

        await auth.sendPasswordResetEmail(
            email
        );

        setMessage(
            forgotMessage,
            "Password reset link sent. Please check your email.",
            "success"
        );

    } catch (error) {

        console.error(
            "Password reset error:",
            error
        );

        setMessage(
            forgotMessage,
            getFirebaseErrorMessage(error),
            "error"
        );

    } finally {

        setButtonLoading(
            forgotSubmit,
            false,
            "",
            "Send Reset Link"
        );
    }
}


/* =========================================================
   LOGOUT
========================================================= */

async function handleLogout() {

    if (!auth) {
        return;
    }

    try {

        stopReviewsListener();

        await auth.signOut();

        currentUser = null;

        resetReviewForm();

        closeAllModals();

        showLoginScreen();

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

        window.alert(
            getFirebaseErrorMessage(error)
        );
    }
}


/* =========================================================
   PROFILE
========================================================= */

async function openProfile() {

    if (!currentUser) {
        showLoginScreen();
        return;
    }

    await ensureUserProfile();

    updateUserUI();

    setMessage(
        profileMessage,
        ""
    );

    openModal(profileModal);
}


async function handleProfileSave(event) {

    event.preventDefault();

    if (!currentUser || !db) {

        setMessage(
            profileMessage,
            "Please login first.",
            "error"
        );

        return;
    }

    const name =
        profileName.value.trim();

    const username =
        profileUsername.value.trim();

    if (name.length < 2) {

        setMessage(
            profileMessage,
            "Please enter a valid full name.",
            "error"
        );

        return;
    }

    if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username)) {

        setMessage(
            profileMessage,
            "Username can contain 3–30 letters, numbers, dots, underscores or hyphens.",
            "error"
        );

        return;
    }

    setButtonLoading(
        profileSaveButton,
        true,
        "Saving...",
        "Save Changes"
    );

    try {

        await db
            .collection("users")
            .doc(currentUser.uid)
            .set({

                uid: currentUser.uid,

                name: name,

                username: username,

                email:
                    currentUser.email || "",

                updatedAt:
                    firebase.firestore.FieldValue.serverTimestamp()

            }, {
                merge: true
            });

        if (
            currentUser.displayName !== name
        ) {

            await currentUser.updateProfile({
                displayName: name
            });
        }

        updateUserUI();

        if (reviewUserName) {
            reviewUserName.textContent =
                name;
        }

        setMessage(
            profileMessage,
            "Profile updated successfully.",
            "success"
        );

    } catch (error) {

        console.error(
            "Profile update error:",
            error
        );

        setMessage(
            profileMessage,
            getFirebaseErrorMessage(error),
            "error"
        );

    } finally {

        setButtonLoading(
            profileSaveButton,
            false,
            "",
            "Save Changes"
        );
    }
}


/* =========================================================
   STAR RATING
========================================================= */

function selectRating(rating) {

    rating =
        Math.max(
            1,
            Math.min(
                5,
                Number(rating)
            )
        );

    if (reviewRating) {
        reviewRating.value =
            String(rating);
    }

    ratingStars.forEach(
        function(star) {

            const starValue =
                Number(
                    star.dataset.rating
                );

            const active =
                starValue <= rating;

            star.classList.toggle(
                "active",
                active
            );

            star.setAttribute(
                "aria-checked",
                active &&
                starValue === rating
                    ? "true"
                    : "false"
            );
        }
    );
}


function resetRating() {

    if (reviewRating) {
        reviewRating.value = "0";
    }

    ratingStars.forEach(
        function(star) {

            star.classList.remove(
                "active"
            );

            star.setAttribute(
                "aria-checked",
                "false"
            );
        }
    );
}


/* =========================================================
   REVIEWS
========================================================= */

function startReviewsListener() {

    if (!db || !currentUser) {
        return;
    }

    stopReviewsListener();

    reviewsUnsubscribe =
        db
            .collection("reviews")
            .orderBy(
                "createdAt",
                "desc"
            )
            .limit(50)
            .onSnapshot(
                function(snapshot) {

                    renderReviews(
                        snapshot
                    );

                },
                function(error) {

                    console.error(
                        "Reviews listener:",
                        error
                    );

                    if (reviewsList) {

                        reviewsList.innerHTML =
                            '<div class="empty-state">' +
                            'Unable to load reviews right now.' +
                            "</div>";
                    }
                }
            );
}


function stopReviewsListener() {

    if (
        typeof reviewsUnsubscribe ===
        "function"
    ) {

        reviewsUnsubscribe();

        reviewsUnsubscribe = null;
    }
}


function renderReviews(snapshot) {

    if (!reviewsList) {
        return;
    }

    if (snapshot.empty) {

        reviewsList.innerHTML =
            '<div class="empty-state">' +
            "No reviews yet. Be the first to review!" +
            "</div>";

        return;
    }

    const fragment =
        document.createDocumentFragment();

    snapshot.forEach(
        function(doc) {

            const data =
                doc.data() || {};

            const card =
                document.createElement("div");

            card.className =
                "review-card";

            const name =
                data.name ||
                "User";

            const rating =
                Number(data.rating || 0);

            const text =
                data.text || "";

            const date =
                formatFirestoreDate(
                    data.createdAt
                );

            const stars =
                "★".repeat(
                    Math.max(
                        0,
                        Math.min(
                            5,
                            rating
                        )
                    )
                );

            const isOwner =
                isCurrentUserOwner();

            const deleteButton =
                isOwner
                    ? `
                        <button
                            type="button"
                            class="review-delete"
                            data-review-id="${escapeHtml(doc.id)}">
                            Delete
                        </button>
                      `
                    : "";

            card.innerHTML = `

                <div class="review-header">

                    <div>

                        <div class="review-username">
                            ${escapeHtml(name)}
                        </div>

                        <div class="review-stars">
                            ${stars}
                        </div>

                    </div>

                    ${deleteButton}

                </div>

                <div class="review-text">
                    ${escapeHtml(text)}
                </div>

                <div class="review-date">
                    ${escapeHtml(date)}
                </div>
            `;

            fragment.appendChild(card);
        }
    );

    reviewsList.innerHTML = "";

    reviewsList.appendChild(fragment);

    /*
     * Attach delete handlers after rendering.
     */
    reviewsList
        .querySelectorAll(".review-delete")
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        const id =
                            button.dataset.reviewId;

                        deleteReview(id);

                    }
                );
            }
        );
}


/* =========================================================
   REVIEW SUBMIT
========================================================= */

async function handleReviewSubmit(event) {

    event.preventDefault();

    if (!currentUser || !db) {

        setMessage(
            reviewMessage,
            "Please login to submit a review.",
            "error"
        );

        return;
    }

    const rating =
        Number(
            reviewRating?.value || 0
        );

    const text =
        reviewText.value.trim();

    if (
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5
    ) {

        setMessage(
            reviewMessage,
            "Please select a rating from 1 to 5 stars.",
            "error"
        );

        return;
    }

    if (!text) {

        setMessage(
            reviewMessage,
            "Please write your review.",
            "error"
        );

        return;
    }

    if (text.length > 500) {

        setMessage(
            reviewMessage,
            "Review must be 500 characters or less.",
            "error"
        );

        return;
    }

    const name =
        await getReviewName();

    setButtonLoading(
        reviewSubmit,
        true,
        "Submitting...",
        "Submit Review"
    );

    setMessage(
        reviewMessage,
        "Submitting your review..."
    );

    try {

        await db
            .collection("reviews")
            .add({

                uid: currentUser.uid,

                name: name,

                text: text,

                rating: rating,

                createdAt:
                    firebase.firestore.FieldValue.serverTimestamp()

            });

        resetReviewForm();

        setMessage(
            reviewMessage,
            "Review submitted successfully.",
            "success"
        );

    } catch (error) {

        console.error(
            "Review submit error:",
            error
        );

        setMessage(
            reviewMessage,
            getFirebaseErrorMessage(error),
            "error"
        );

    } finally {

        setButtonLoading(
            reviewSubmit,
            false,
            "",
            "Submit Review"
        );
    }
}


async function getReviewName() {

    if (!currentUser) {
        return "User";
    }

    try {

        if (db) {

            const snapshot =
                await db
                    .collection("users")
                    .doc(currentUser.uid)
                    .get();

            if (snapshot.exists) {

                const data =
                    snapshot.data() || {};

                if (data.name) {
                    return data.name;
                }
            }
        }

    } catch (error) {

        console.warn(
            "Could not get profile name:",
            error
        );
    }

    return getUserDisplayName(
        currentUser
    );
}


function resetReviewForm() {

    if (reviewForm) {
        reviewForm.reset();
    }

    resetRating();

    if (reviewUserName) {

        reviewUserName.textContent =
            currentUser
                ? getUserDisplayName(
                    currentUser
                )
                : "User";
    }
}


/* =========================================================
   OWNER CHECK
========================================================= */

function isCurrentUserOwner() {

    if (!currentUser) {
        return false;
    }

    if (!LOCAL_OWNER_UID) {
        return false;
    }

    return (
        currentUser.uid ===
        LOCAL_OWNER_UID
    );
}


/* =========================================================
   DELETE REVIEW
========================================================= */

async function deleteReview(reviewId) {

    if (!currentUser) {
        return;
    }

    if (!isCurrentUserOwner()) {

        window.alert(
            "Only the website owner can delete reviews."
        );

        return;
    }

    if (!reviewId || !db) {
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

        window.alert(
            getFirebaseErrorMessage(error)
        );
    }
}


/* =========================================================
   DOWNLOAD COUNT
========================================================= */

async function loadDownloadCount() {

    if (!db || !downloadCount) {
        return;
    }

    try {

        const snapshot =
            await db
                .collection("stats")
                .doc("main")
                .get();

        if (!snapshot.exists) {

            downloadCount.textContent =
                "0";

            return;
        }

        const data =
            snapshot.data() || {};

        const count =
            Number(
                data.downloads || 0
            );

        downloadCount.textContent =
            formatNumber(count);

    } catch (error) {

        console.error(
            "Download count error:",
            error
        );

        /*
         * Keep UI usable even if Firestore
         * temporarily fails.
         */
        downloadCount.textContent =
            "0";
    }
}


function increaseFirebaseDownloadCount() {

    if (!db || !currentUser) {
        return Promise.resolve();
    }

    const ref =
        db
            .collection("stats")
            .doc("main");

    /*
     * IMPORTANT:
     * This promise is intentionally NOT awaited
     * by the download countdown.
     */
    return db.runTransaction(
        async function(transaction) {

            const snapshot =
                await transaction.get(ref);

            if (!snapshot.exists) {

                transaction.set(
                    ref,
                    {
                        downloads: 1
                    }
                );

                return;
            }

            const data =
                snapshot.data() || {};

            const current =
                Number(
                    data.downloads || 0
                );

            transaction.update(
                ref,
                {
                    downloads:
                        current + 1
                }
            );
        }
    )
    .then(
        function() {

            /*
             * Update UI without blocking download.
             */
            loadDownloadCount();

        }
    )
    .catch(
        function(error) {

            console.error(
                "Download count increment failed:",
                error
            );
        }
    );
}


function formatNumber(number) {

    const value =
        Number(number);

    if (!Number.isFinite(value)) {
        return "0";
    }

    return value.toLocaleString(
        "en-IN"
    );
}


/* =========================================================
   DOWNLOAD SYSTEM
========================================================= */

function getAPKUrl() {

    if (
        typeof APK_URL !== "undefined" &&
        typeof APK_URL === "string" &&
        APK_URL.trim()
    ) {

        return APK_URL.trim();
    }

    return DEFAULT_APK_URL;
}


function startDownload() {

    if (!currentUser) {

        window.alert(
            "Please login to download the APK."
        );

        return;
    }

    if (downloadInProgress) {
        return;
    }

    downloadInProgress = true;

    /*
     * Open blank tab immediately from the user's
     * click. This helps avoid popup blockers.
     */
    let downloadWindow = null;

    try {

        downloadWindow =
            window.open(
                "about:blank",
                "_blank"
            );

        if (
            downloadWindow &&
            typeof downloadWindow.opener !==
            "undefined"
        ) {

            downloadWindow.opener = null;
        }

    } catch (error) {

        console.warn(
            "Could not open download tab:",
            error
        );
    }

    openDownloadModal();

    let remaining = 5;

    updateDownloadCountdown(
        remaining
    );

    const countdownTimer =
        window.setInterval(
            function() {

                remaining--;

                updateDownloadCountdown(
                    remaining
                );

                if (remaining <= 0) {

                    window.clearInterval(
                        countdownTimer
                    );

                    /*
                     * IMPORTANT:
                     * APK navigation happens immediately
                     * at zero.
                     *
                     * Firestore count is NOT awaited.
                     */
                    navigateToAPK(
                        downloadWindow
                    );

                    increaseFirebaseDownloadCount();

                    closeDownloadModal();

                    downloadInProgress =
                        false;
                }

            },
            1000
        );
}


function updateDownloadCountdown(
    remaining
) {

    if (downloadCountdown) {

        downloadCountdown.textContent =
            String(
                Math.max(
                    0,
                    remaining
                )
            );
    }

    if (downloadCountdownText) {

        if (remaining > 0) {

            downloadCountdownText.textContent =
                "Your download will start in";

        } else {

            downloadCountdownText.textContent =
                "Starting download...";
        }
    }
}


function navigateToAPK(
    downloadWindow
) {

    const url =
        getAPKUrl();

    if (
        downloadWindow &&
        !downloadWindow.closed
    ) {

        try {

            downloadWindow.location.href =
                url;

            return;

        } catch (error) {

            console.warn(
                "Download tab navigation failed:",
                error
            );
        }
    }

    /*
     * Popup was blocked or tab navigation failed.
     * Fallback to same-tab navigation.
     */
    window.location.href = url;
}


/* =========================================================
   DOWNLOAD MODAL
========================================================= */

function openDownloadModal() {

    if (!downloadModal) {
        return;
    }

    downloadModal.classList.add("show");

    downloadModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );
}


function closeDownloadModal() {

    if (!downloadModal) {
        return;
    }

    downloadModal.classList.remove(
        "show"
    );

    downloadModal.setAttribute(
        "aria-hidden",
        "true"
    );

    /*
     * Do not remove body lock if another modal
     * is currently open.
     */
    if (
        !document.querySelector(
            ".modal.show"
        )
    ) {

        document.body.classList.remove(
            "modal-open"
        );
    }
}


/* =========================================================
   MODAL MANAGEMENT
========================================================= */

function openModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.add("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );
}


function closeModal(modal) {

    if (!modal) {
        return;
    }

    /*
     * Countdown modal should only close
     * after countdown completion.
     */
    if (
        modal === downloadModal &&
        downloadInProgress
    ) {
        return;
    }

    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    if (
        !document.querySelector(
            ".modal.show"
        )
    ) {

        document.body.classList.remove(
            "modal-open"
        );
    }
}


function closeAllModals() {

    [
        profileModal,
        registerModal,
        forgotModal
    ].forEach(
        function(modal) {

            if (!modal) {
                return;
            }

            modal.classList.remove(
                "show"
            );

            modal.setAttribute(
                "aria-hidden",
                "true"
            );
        }
    );

    if (!downloadInProgress) {

        if (downloadModal) {

            downloadModal.classList.remove(
                "show"
            );

            downloadModal.setAttribute(
                "aria-hidden",
                "true"
            );
        }

        document.body.classList.remove(
            "modal-open"
        );
    }
}


/* =========================================================
   FIREBASE ERROR MESSAGES
========================================================= */

function getFirebaseErrorMessage(
    error
) {

    if (!error) {
        return "Something went wrong.";
    }

    const code =
        error.code || "";

    switch (code) {

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/user-not-found":
            return "No account found with this email.";

        case "auth/wrong-password":
            return "Incorrect password.";

        case "auth/invalid-credential":
            return "Invalid email or password.";

        case "auth/email-already-in-use":
            return "An account already exists with this email.";

        case "auth/weak-password":
            return "Password is too weak. Use at least 6 characters.";

        case "auth/operation-not-allowed":
            return "This sign-in method is not enabled in Firebase.";

        case "auth/popup-blocked":
            return "Google Sign-In popup was blocked by the browser.";

        case "auth/popup-closed-by-user":
            return "Google Sign-In was cancelled.";

        case "auth/cancelled-popup-request":
            return "Google Sign-In was cancelled.";

        case "auth/unauthorized-domain":
            return "This website domain is not authorized in Firebase Authentication.";

        case "auth/network-request-failed":
            return "Network error. Please check your internet connection.";

        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";

        case "auth/user-disabled":
            return "This account has been disabled.";

        default:

            return (
                error.message ||
                "Something went wrong. Please try again."
            );
    }
}


/* =========================================================
   FIRESTORE DATE
========================================================= */

function formatFirestoreDate(
    timestamp
) {

    if (!timestamp) {
        return "Just now";
    }

    try {

        let date = null;

        if (
            timestamp &&
            typeof timestamp.toDate ===
            "function"
        ) {

            date =
                timestamp.toDate();

        } else {

            date =
                new Date(timestamp);
        }

        if (
            !date ||
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "Recently";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    } catch (error) {

        return "Recently";
    }
}
