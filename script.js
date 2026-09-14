/* =========================================================
   SUPER VIDEO PLAYER WEBSITE
   FULL REPLACE JAVASCRIPT
   FIREBASE AUTH + PROFILE + REVIEWS + DOWNLOAD COUNTER
   5 SECOND COUNTDOWN + INSTANT APK DOWNLOAD
   ========================================================= */


/* =========================================================
   CONFIG
   ========================================================= */

const DEFAULT_APK_URL =
    "https://github.com/Sapneswar99/sm7-studio/releases/download/v1.0.0/Super.Video.Player.apk";

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

function setFormMessage(element, text, success = false) {

    if (!element) return;

    element.textContent = text;

    element.classList.toggle(
        "success",
        success
    );
}


function clearElementMessage(element) {

    if (!element) return;

    element.textContent = "";

    element.classList.remove("success");
}


/* =========================================================
   FIREBASE CONFIG
   ========================================================= */

function getFirebaseConfig() {

    if (
        typeof FIREBASE_CONFIG !== "undefined" &&
        FIREBASE_CONFIG
    ) {
        return FIREBASE_CONFIG;
    }

    if (
        typeof firebaseConfig !== "undefined" &&
        firebaseConfig
    ) {
        return firebaseConfig;
    }

    return null;
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


function isCurrentUserOwner() {

    const ownerUID = getOwnerUID();

    return Boolean(
        ownerUID &&
        currentUser &&
        currentUser.uid === ownerUID
    );
}


/* =========================================================
   VALIDATION
   ========================================================= */

function validName(name) {

    if (typeof name !== "string") {
        return false;
    }

    const value = name.trim();

    return (
        value.length >= 2 &&
        value.length <= 50
    );
}


function validUsername(username) {

    if (typeof username !== "string") {
        return false;
    }

    return /^[a-zA-Z0-9_]{3,30}$/.test(
        username.trim()
    );
}


function validPassword(password) {

    return (
        typeof password === "string" &&
        password.length >= 6
    );
}


/* =========================================================
   USERNAME GENERATOR
   ========================================================= */

function generateUsername(name, uid = "") {

    let base =
        String(name || "user")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "");

    if (!base) {
        base = "user";
    }

    base = base.substring(0, 20);

    const suffix =
        String(uid || "")
            .replace(/[^a-zA-Z0-9]/g, "")
            .substring(0, 8)
            .toLowerCase();

    let username =
        suffix
            ? `${base}_${suffix}`
            : `${base}_${Math.floor(
                1000 + Math.random() * 9000
            )}`;

    username =
        username.substring(0, 30);

    if (username.length < 3) {
        username =
            `user_${Math.floor(
                1000 + Math.random() * 9000
            )}`;
    }

    return username;
}


/* =========================================================
   INITIAL SCREEN
   ========================================================= */

(function prepareInitialScreen() {

    const loginScreen = get("loginScreen");
    const mainApp = get("mainApp");

    if (loginScreen) {

        loginScreen.style.display = "none";

        loginScreen.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    if (mainApp) {

        mainApp.style.display = "none";

        mainApp.setAttribute(
            "aria-hidden",
            "true"
        );
    }

})();


/* =========================================================
   LOADING SCREEN
   EXACTLY 3 SECONDS
   ========================================================= */

(function startLoadingScreen() {

    const loading = get("loadingScreen");

    if (!loading) return;

    window.setTimeout(function () {

        loading.classList.add("hidden");
        loading.classList.add("hide");

        window.setTimeout(function () {

            if (
                loading &&
                loading.parentNode
            ) {
                loading.remove();
            }

        }, 750);

    }, 3000);

})();


/* =========================================================
   CURRENT YEAR
   ========================================================= */

(function setCurrentYear() {

    const year = get("year");

    if (!year) return;

    year.textContent =
        new Date().getFullYear();

})();


/* =========================================================
   SCREEN CONTROL
   ========================================================= */

function showLoginScreen() {

    const loginScreen = get("loginScreen");
    const mainApp = get("mainApp");

    if (loginScreen) {

        loginScreen.style.display = "flex";

        loginScreen.setAttribute(
            "aria-hidden",
            "false"
        );
    }

    if (mainApp) {

        mainApp.style.display = "none";

        mainApp.setAttribute(
            "aria-hidden",
            "true"
        );
    }

}


function showMainApp() {

    const loginScreen = get("loginScreen");
    const mainApp = get("mainApp");

    if (loginScreen) {

        loginScreen.style.display = "none";

        loginScreen.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    if (mainApp) {

        mainApp.style.display = "block";

        mainApp.setAttribute(
            "aria-hidden",
            "false"
        );
    }

}


/* =========================================================
   AUTH MESSAGES
   ========================================================= */

function clearAuthMessages() {

    [
        get("loginMessage"),
        get("registerMessage"),
        get("forgotMessage")
    ].forEach(function (element) {

        clearElementMessage(element);

    });

}


/* =========================================================
   FIREBASE AUTH ERROR
   ========================================================= */

function getFirebaseAuthErrorMessage(error) {

    if (!error) {
        return "Authentication failed. Please try again.";
    }

    const code = error.code || "";

    switch (code) {

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/user-not-found":
            return "No account was found with this email.";

        case "auth/wrong-password":
            return "Incorrect password.";

        case "auth/invalid-credential":
            return "Incorrect email or password.";

        case "auth/email-already-in-use":
            return "An account with this email already exists.";

        case "auth/weak-password":
            return "Password is too weak. Use at least 6 characters.";

        case "auth/network-request-failed":
            return "Network error. Please check your internet connection.";

        case "auth/too-many-requests":
            return "Too many attempts. Please wait and try again.";

        case "auth/popup-blocked":
            return "Google login popup was blocked. Please allow popups and try again.";

        case "auth/popup-closed-by-user":
            return "Google login was cancelled.";

        case "auth/account-exists-with-different-credential":
            return "An account already exists with a different sign-in method.";

        case "auth/unauthorized-domain":
            return "This website domain is not authorized in Firebase Authentication.";

        case "auth/operation-not-allowed":
            return "This sign-in method is not enabled in Firebase Authentication.";

        default:
            return (
                error.message ||
                "Authentication failed. Please try again."
            );
    }

}


/* =========================================================
   EMAIL LOGIN
   ========================================================= */

async function loginWithEmailPassword() {

    const emailInput = get("loginEmail");
    const passwordInput = get("loginPassword");

    const message = get("loginMessage");
    const submit = get("loginSubmit");

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

        submit.disabled = true;
        submit.textContent = "Logging in...";

    }

    try {

        await auth.signInWithEmailAndPassword(
            email,
            password
        );

    } catch (error) {

        console.error(
            "Email login error:",
            error
        );

        setFormMessage(
            message,
            getFirebaseAuthErrorMessage(error)
        );

    } finally {

        if (submit) {

            submit.disabled = false;
            submit.textContent = "Login";

        }

    }

}


/* =========================================================
   GOOGLE SIGN IN
   ========================================================= */

async function signInWithGoogle(messageElementId) {

    const message =
        get(messageElementId);

    if (!auth) {

        setFormMessage(
            message,
            "Firebase is not connected."
        );

        return;
    }

    let button = null;

    if (messageElementId === "loginMessage") {
        button = get("googleLoginButton");
    }

    if (messageElementId === "registerMessage") {
        button = get("googleRegisterButton");
    }

    if (button) {

        button.disabled = true;
        button.style.opacity = "0.6";

    }

    try {

        const provider =
            new firebase.auth.GoogleAuthProvider();

        provider.setCustomParameters({
            prompt: "select_account"
        });

        const result =
            await auth.signInWithPopup(provider);

        if (result && result.user) {

            await ensureUserProfile(
                result.user
            );

        }

        if (messageElementId === "registerMessage") {
            closeRegisterModal();
        }

    } catch (error) {

        console.error(
            "Google authentication error:",
            error
        );

        if (
            error.code !==
            "auth/popup-closed-by-user"
        ) {

            setFormMessage(
                message,
                getFirebaseAuthErrorMessage(error)
            );

        }

    } finally {

        if (button) {

            button.disabled = false;
            button.style.opacity = "";

        }

    }

}


/* =========================================================
   REGISTER WITH EMAIL + PASSWORD
   ========================================================= */

async function registerWithEmailPassword() {

    const nameInput = get("registerName");
    const emailInput = get("registerEmail");
    const passwordInput = get("registerPassword");

    const message = get("registerMessage");
    const submit = get("registerSubmit");

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

        submit.disabled = true;
        submit.textContent = "Creating Account...";

    }

    try {

        const credential =
            await auth.createUserWithEmailAndPassword(
                email,
                password
            );

        const user = credential.user;

        if (user) {

            await user.updateProfile({
                displayName: name
            });

            await ensureUserProfile(
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
            getFirebaseAuthErrorMessage(error)
        );

    } finally {

        if (submit) {

            submit.disabled = false;
            submit.textContent = "Create Account";

        }

    }

}


/* =========================================================
   ENSURE / SAVE USER PROFILE
   ========================================================= */

async function ensureUserProfile(
    user,
    fallbackName = ""
) {

    if (!user || !db) {
        return;
    }

    const userRef =
        db.collection("users").doc(user.uid);

    try {

        const snapshot =
            await userRef.get();

        const existing =
            snapshot.exists
                ? snapshot.data() || {}
                : {};

        const name =
            (
                existing.name ||
                user.displayName ||
                fallbackName ||
                "User"
            ).trim();

        const username =
            (
                existing.username ||
                generateUsername(
                    name,
                    user.uid
                )
            ).trim();

        const provider =
            user.providerData &&
            user.providerData[0]
                ? user.providerData[0].providerId
                : "password";

        const data = {

            uid:
                user.uid,

            name:
                name,

            username:
                username,

            email:
                user.email || "",

            photoURL:
                user.photoURL || "",

            provider:
                provider,

            updatedAt:
                firebase.firestore
                    .FieldValue
                    .serverTimestamp()

        };

        /*
           createdAt only once.
           Existing value will not be overwritten.
        */

        if (!snapshot.exists) {

            data.createdAt =
                firebase.firestore
                    .FieldValue
                    .serverTimestamp();

        }

        await userRef.set(
            data,
            {
                merge: true
            }
        );

        updateUserUI(
            {
                name: name,
                username: username,
                email:
                    user.email || "",
                photoURL:
                    user.photoURL || ""
            }
        );

    } catch (error) {

        console.error(
            "User profile error:",
            error
        );

    }

}


/* =========================================================
   UPDATE USER UI
   ========================================================= */

function updateUserUI(profileData = {}) {

    const name =
        profileData.name ||
        currentUser?.displayName ||
        currentUser?.email ||
        "User";

    const username =
        profileData.username ||
        "";

    const email =
        profileData.email ||
        currentUser?.email ||
        "";

    const photoURL =
        profileData.photoURL ||
        currentUser?.photoURL ||
        "";

    const loggedUserName =
        get("loggedUserName");

    const reviewUserName =
        get("reviewUserName");

    const profileEmail =
        get("profileEmail");

    const profileName =
        get("profileName");

    const profileUsername =
        get("profileUsername");

    if (loggedUserName) {
        loggedUserName.textContent = name;
    }

    if (reviewUserName) {
        reviewUserName.textContent = name;
    }

    if (profileEmail) {
        profileEmail.textContent =
            email || "—";
    }

    if (profileName) {
        profileName.value = name;
    }

    if (profileUsername) {
        profileUsername.value = username;
    }

    setAvatar(
        get("profileAvatar"),
        name,
        photoURL
    );

    setAvatar(
        get("profileModalAvatar"),
        name,
        photoURL
    );

}


/* =========================================================
   AVATAR
   ========================================================= */

function getInitials(name) {

    const value =
        String(name || "User")
            .trim();

    if (!value) {
        return "U";
    }

    const parts =
        value.split(/\s+/);

    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase();

    }

    return (
        parts[0].charAt(0) +
        parts[parts.length - 1].charAt(0)
    ).toUpperCase();

}


function setAvatar(
    element,
    name,
    photoURL
) {

    if (!element) return;

    element.textContent =
        getInitials(name);

    element.style.backgroundImage =
        "";

    element.style.backgroundSize =
        "cover";

    element.style.backgroundPosition =
        "center";

    if (photoURL) {

        element.style.backgroundImage =
            `url("${photoURL}")`;

        element.textContent = "";

    }

}


/* =========================================================
   LOGIN FORM
   ========================================================= */

const loginForm =
    get("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            loginWithEmailPassword();

        }
    );

}


/* =========================================================
   GOOGLE LOGIN
   ========================================================= */

const googleLoginButton =
    get("googleLoginButton");

if (googleLoginButton) {

    googleLoginButton.addEventListener(
        "click",
        function () {

            signInWithGoogle(
                "loginMessage"
            );

        }
    );

}


/* =========================================================
   REGISTER FORM
   ========================================================= */

const registerForm =
    get("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            registerWithEmailPassword();

        }
    );

}


/* =========================================================
   GOOGLE REGISTER
   ========================================================= */

const googleRegisterButton =
    get("googleRegisterButton");

if (googleRegisterButton) {

    googleRegisterButton.addEventListener(
        "click",
        function () {

            signInWithGoogle(
                "registerMessage"
            );

        }
    );

}


/* =========================================================
   FORGOT PASSWORD
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

        submit.disabled = true;
        submit.textContent = "Sending...";

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
            getFirebaseAuthErrorMessage(error)
        );

    } finally {

        if (submit) {

            submit.disabled = false;
            submit.textContent = "Send Reset Link";

        }

    }

}


/* =========================================================
   REGISTER MODAL
   ========================================================= */

function openRegisterModal() {

    const modal =
        get("registerModal");

    if (!modal) return;

    clearAuthMessages();

    modal.classList.add("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeRegisterModal() {

    const modal =
        get("registerModal");

    if (!modal) return;

    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


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
   FORGOT MODAL
   ========================================================= */

function openForgotModal() {

    const modal =
        get("forgotModal");

    if (!modal) return;

    clearAuthMessages();

    const loginEmail =
        get("loginEmail");

    const forgotEmail =
        get("forgotEmail");

    if (
        loginEmail &&
        forgotEmail &&
        loginEmail.value.trim()
    ) {

        forgotEmail.value =
            loginEmail.value.trim();

    }

    modal.classList.add("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeForgotModal() {

    const modal =
        get("forgotModal");

    if (!modal) return;

    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


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
   PROFILE MODAL
   ========================================================= */

function openProfileModal() {

    const modal =
        get("profileModal");

    if (!modal || !currentUser) return;

    modal.classList.add("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    loadProfileIntoModal();

}


function closeProfileModal() {

    const modal =
        get("profileModal");

    if (!modal) return;

    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


async function loadProfileIntoModal() {

    if (!currentUser) return;

    const email =
        get("profileEmail");

    const name =
        get("profileName");

    const username =
        get("profileUsername");

    if (email) {

        email.textContent =
            currentUser.email || "—";

    }

    if (name) {

        name.value =
            currentUser.displayName ||
            "User";

    }

    if (!db) return;

    try {

        const snapshot =
            await db
                .collection("users")
                .doc(currentUser.uid)
                .get();

        if (!snapshot.exists) return;

        const data =
            snapshot.data() || {};

        if (name) {

            name.value =
                data.name ||
                currentUser.displayName ||
                "User";

        }

        if (username) {

            username.value =
                data.username ||
                generateUsername(
                    data.name ||
                    currentUser.displayName,
                    currentUser.uid
                );

        }

        updateUserUI(data);

    } catch (error) {

        console.error(
            "Load profile error:",
            error
        );

    }

}


const profileButton =
    get("profileButton");

if (profileButton) {

    profileButton.addEventListener(
        "click",
        function () {

            openProfileModal();

        }
    );

}


const profileClose =
    get("profileClose");

if (profileClose) {

    profileClose.addEventListener(
        "click",
        function () {

            closeProfileModal();

        }
    );

}


/* =========================================================
   PROFILE FORM
   ========================================================= */

const profileForm =
    get("profileForm");

if (profileForm) {

    profileForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            await saveProfileChanges();

        }
    );

}


async function saveProfileChanges() {

    if (!currentUser || !db) {

        return;

    }

    const nameInput =
        get("profileName");

    const usernameInput =
        get("profileUsername");

    const message =
        get("profileMessage");

    const saveButton =
        get("profileSaveButton");

    const name =
        nameInput
            ? nameInput.value.trim()
            : "";

    const username =
        usernameInput
            ? usernameInput.value.trim()
            : "";

    if (!validName(name)) {

        setFormMessage(
            message,
            "Name must be between 2 and 50 characters."
        );

        return;

    }

    if (!validUsername(username)) {

        setFormMessage(
            message,
            "Username must contain only letters, numbers and underscore, with 3–30 characters."
        );

        return;

    }

    if (saveButton) {

        saveButton.disabled = true;
        saveButton.textContent = "Saving...";

    }

    try {

        await currentUser.updateProfile({
            displayName: name
        });

        await db
            .collection("users")
            .doc(currentUser.uid)
            .set(
                {
                    uid:
                        currentUser.uid,

                    name:
                        name,

                    username:
                        username,

                    email:
                        currentUser.email || "",

                    photoURL:
                        currentUser.photoURL || "",

                    updatedAt:
                        firebase.firestore
                            .FieldValue
                            .serverTimestamp()
                },
                {
                    merge: true
                }
            );

        updateUserUI({
            name:
                name,

            username:
                username,

            email:
                currentUser.email || "",

            photoURL:
                currentUser.photoURL || ""
        });

        setFormMessage(
            message,
            "Profile updated successfully.",
            true
        );

    } catch (error) {

        console.error(
            "Profile save error:",
            error
        );

        setFormMessage(
            message,
            "Could not update profile. Please try again."
        );

    } finally {

        if (saveButton) {

            saveButton.disabled = false;
            saveButton.textContent = "Save Changes";

        }

    }

}


/* =========================================================
   LOGOUT
   ========================================================= */

const logoutButton =
    get("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            if (!auth) return;

            try {

                await auth.signOut();

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}


/* =========================================================
   STAR RATING
   ========================================================= */

let selectedRating = 0;


function updateStars(rating) {

    const stars =
        document.querySelectorAll(
            ".rating-star"
        );

    stars.forEach(
        function (star) {

            const value =
                Number(
                    star.dataset.rating
                );

            const active =
                value <= rating;

            star.classList.toggle(
                "active",
                active
            );

            star.setAttribute(
                "aria-checked",
                active &&
                value === rating
                    ? "true"
                    : "false"
            );

        }
    );

}


function setRating(rating) {

    const value =
        Number(rating);

    if (
        !Number.isInteger(value) ||
        value < 1 ||
        value > 5
    ) {

        return;

    }

    selectedRating =
        value;

    const hidden =
        get("reviewRating");

    if (hidden) {

        hidden.value =
            String(value);

    }

    updateStars(value);

}


const ratingStars =
    document.querySelectorAll(
        ".rating-star"
    );


ratingStars.forEach(
    function (star) {

        star.addEventListener(
            "mouseenter",
            function () {

                updateStars(
                    Number(
                        star.dataset.rating
                    )
                );

            }
        );


        star.addEventListener(
            "focus",
            function () {

                updateStars(
                    Number(
                        star.dataset.rating
                    )
                );

            }
        );


        star.addEventListener(
            "click",
            function () {

                setRating(
                    Number(
                        star.dataset.rating
                    )
                );

            }
        );

    }
);


const starRating =
    get("starRating");

if (starRating) {

    starRating.addEventListener(
        "mouseleave",
        function () {

            updateStars(
                selectedRating
            );

        }
    );

}


/* =========================================================
   REVIEW SUBMIT
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


async function submitReview() {

    const message =
        get("reviewMessage");

    const textInput =
        get("reviewText");

    const submit =
        get("reviewSubmit");

    if (!currentUser) {

        setFormMessage(
            message,
            "Please login to submit a review."
        );

        return;

    }

    if (!db) {

        setFormMessage(
            message,
            "Firebase is not connected."
        );

        return;

    }

    const text =
        textInput
            ? textInput.value.trim()
            : "";

    const rating =
        Number(
            get("reviewRating")?.value || 0
        );

    if (!text) {

        setFormMessage(
            message,
            "Please write a review."
        );

        return;

    }

    if (text.length > 500) {

        setFormMessage(
            message,
            "Review is too long. Maximum 500 characters."
        );

        return;

    }

    /*
       IMPORTANT:
       Rating must actually be selected.
       No automatic 5-star rating.
    */

    if (
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5
    ) {

        setFormMessage(
            message,
            "Please select a rating from 1 to 5."
        );

        return;

    }

    if (submit) {

        submit.disabled = true;
        submit.textContent = "Posting...";

    }

    try {

        let userName =
            currentUser.displayName ||
            currentUser.email ||
            "User";

        let username = "";

        try {

            const userSnapshot =
                await db
                    .collection("users")
                    .doc(currentUser.uid)
                    .get();

            if (userSnapshot.exists) {

                const userData =
                    userSnapshot.data() || {};

                userName =
                    userData.name ||
                    userName;

                username =
                    userData.username ||
                    "";

            }

        } catch (profileError) {

            console.warn(
                "Review profile read warning:",
                profileError
            );

        }

        await db
            .collection("reviews")
            .add(
                {
                    uid:
                        currentUser.uid,

                    name:
                        userName,

                    username:
                        username,

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

            textInput.value = "";

        }

        selectedRating = 0;

        const hidden =
            get("reviewRating");

        if (hidden) {

            hidden.value = "0";

        }

        updateStars(0);

        setFormMessage(
            message,
            "Review posted successfully.",
            true
        );

    } catch (error) {

        console.error(
            "Review submit error:",
            error
        );

        setFormMessage(
            message,
            "Could not post review. Please try again."
        );

    } finally {

        if (submit) {

            submit.disabled = false;
            submit.textContent = "Submit Review";

        }

    }

}


/* =========================================================
   LOAD REVIEWS
   ========================================================= */

function loadReviews() {

    if (!db) return;

    if (reviewsUnsubscribe) {

        reviewsUnsubscribe();

        reviewsUnsubscribe = null;

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

                        list.innerHTML = "";

                        const empty =
                            document.createElement(
                                "div"
                            );

                        empty.className =
                            "empty-state";

                        empty.textContent =
                            "Unable to load reviews.";

                        list.appendChild(
                            empty
                        );

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

    if (!list) return;

    list.innerHTML = "";

    if (
        !snapshot ||
        snapshot.empty
    ) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "empty-state";

        empty.textContent =
            "No reviews yet. Be the first to review.";

        list.appendChild(
            empty
        );

        return;

    }

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

            dateElement.textContent =
                formatReviewDate(
                    data.createdAt
                );


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

            const rating =
                normalizeRating(
                    data.rating
                );

            ratingElement.textContent =
                "★".repeat(rating) +
                "☆".repeat(5 - rating);


            top.appendChild(
                info
            );

            top.appendChild(
                ratingElement
            );


            /* =========================================
               TEXT
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

            if (
                isCurrentUserOwner()
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
                    function () {

                        deleteReview(
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
   NORMALIZE RATING
   ========================================================= */

function normalizeRating(value) {

    const rating =
        Number(value);

    if (!Number.isInteger(rating)) {
        return 1;
    }

    return Math.max(
        1,
        Math.min(
            5,
            rating
        )
    );

}


/* =========================================================
   REVIEW DATE
   ========================================================= */

function formatReviewDate(timestamp) {

    if (
        !timestamp ||
        typeof timestamp.toDate !== "function"
    ) {

        return "Just now";

    }

    try {

        return timestamp
            .toDate()
            .toLocaleDateString(
                undefined,
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );

    } catch (error) {

        return "Just now";

    }

}


/* =========================================================
   DELETE REVIEW
   ========================================================= */

async function deleteReview(reviewId) {

    if (!currentUser || !db) {
        return;
    }

    if (!isCurrentUserOwner()) {

        window.alert(
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

        window.alert(
            "Could not delete review."
        );

    }

}


/* =========================================================
   DOWNLOAD MODAL
   DYNAMICALLY CREATED
   ========================================================= */

function createDownloadModal() {

    let modal =
        get("downloadModal");

    if (modal) {
        return modal;
    }

    modal =
        document.createElement(
            "div"
        );

    modal.id =
        "downloadModal";

    modal.className =
        "modal download-modal";

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    modal.innerHTML = `
        <div class="modal-box download-modal-box">

            <div class="modal-logo">
                <img
                    src="https://i.ibb.co/KcSWFnx9/Super-Video-Player-Logo.png"
                    alt="Super Video Player">
            </div>

            <h2>
                Preparing Download
            </h2>

            <p id="downloadStatus">
                Your download will start automatically.
            </p>

            <div
                class="download-countdown"
                aria-live="polite">

                <span id="countdown">
                    5
                </span>

            </div>

            <div class="download-progress-wrap">

                <div
                    id="countdownProgress"
                    class="download-progress">
                </div>

            </div>

            <small>
                Please wait...
            </small>

        </div>
    `;

    document.body.appendChild(
        modal
    );

    return modal;

}


/* =========================================================
   START DOWNLOAD
   ========================================================= */

function startDownload() {

    if (!currentUser) {

        return;

    }

    if (downloadInProgress) {
        return;
    }

    const modal =
        createDownloadModal();

    const countdown =
        get("countdown");

    const progress =
        get("countdownProgress");

    const status =
        get("downloadStatus");


    downloadInProgress =
        true;


    /*
       IMPORTANT:
       Blank tab is opened immediately from
       the original user click.

       This helps prevent browser popup blocking.
    */

    let downloadWindow = null;

    try {

        downloadWindow =
            window.open(
                "about:blank",
                "_blank"
            );

    } catch (error) {

        console.warn(
            "Could not open download tab:",
            error
        );

    }


    modal.classList.add(
        "show"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    let seconds = 5;


    if (countdown) {

        countdown.textContent =
            String(seconds);

    }


    if (progress) {

        progress.style.transform =
            "scaleX(1)";

    }


    if (status) {

        status.textContent =
            "Your download will start automatically.";

    }


    if (downloadTimer) {

        clearInterval(
            downloadTimer
        );

    }


    downloadTimer =
        window.setInterval(
            function () {

                seconds--;


                if (countdown) {

                    countdown.textContent =
                        String(seconds);

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


                clearInterval(
                    downloadTimer
                );

                downloadTimer =
                    null;


                if (status) {

                    status.textContent =
                        "Starting download...";

                }


                /*
                   FIRST start APK navigation.
                   Do NOT wait for Firestore.
                   This keeps the download instant.
                */

                navigateToAPK(
                    downloadWindow
                );


                /*
                   Firestore count happens asynchronously
                   and never blocks APK download.
                */

                increaseFirebaseDownloadCount()
                    .catch(
                        function (error) {

                            console.error(
                                "Download counter error:",
                                error
                            );

                        }
                    );


                if (status) {

                    status.textContent =
                        "Download started ✓";

                }


                window.setTimeout(
                    function () {

                        closeDownloadModal();

                    },
                    900
                );

            },
            1000
        );

}


/* =========================================================
   NAVIGATE TO APK
   ========================================================= */

function navigateToAPK(downloadWindow) {

    const apkURL =
        getAPKURL();

    if (!apkURL) {

        throw new Error(
            "APK URL is not configured."
        );

    }


    /*
       Use already-created tab first.
    */

    if (
        downloadWindow &&
        !downloadWindow.closed
    ) {

        try {

            downloadWindow.location.href =
                apkURL;

            return;

        } catch (error) {

            console.warn(
                "Download tab navigation failed:",
                error
            );

        }

    }


    /*
       Fallback if browser did not allow
       the blank tab.
    */

    try {

        window.location.href =
            apkURL;

    } catch (error) {

        console.error(
            "APK navigation failed:",
            error
        );

        throw error;

    }

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
   FIRESTORE DOWNLOAD COUNTER
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


            if (!snapshot.exists) {

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

                return;
            }


            const data =
                snapshot.data() || {};


            let downloads =
                Number(
                    data.downloads || 0
                );


            if (
                !Number.isFinite(downloads) ||
                downloads < 0
            ) {

                downloads = 0;

            }


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

        }
    );


    /*
       Update visible counter after transaction.
    */

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


        if (!snapshot.exists) {

            countElement.textContent =
                "0";

            return;

        }


        const data =
            snapshot.data() || {};


        let downloads =
            Number(
                data.downloads || 0
            );


        if (
            !Number.isFinite(downloads) ||
            downloads < 0
        ) {

            downloads = 0;

        }


        countElement.textContent =
            downloads.toLocaleString();

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

document.addEventListener(
    "click",
    function (event) {

        const registerModal =
            get("registerModal");

        const forgotModal =
            get("forgotModal");

        const profileModal =
            get("profileModal");


        if (
            registerModal &&
            event.target === registerModal
        ) {

            closeRegisterModal();

        }


        if (
            forgotModal &&
            event.target === forgotModal
        ) {

            closeForgotModal();

        }


        if (
            profileModal &&
            event.target === profileModal
        ) {

            closeProfileModal();

        }

    }
);


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }

        closeRegisterModal();

        closeForgotModal();

        closeProfileModal();

        /*
           Download countdown intentionally
           does not close with ESC.
        */

    }
);


/* =========================================================
   AUTH STATE
   ========================================================= */

function renderAuthState() {

    const reviewUser =
        get("reviewUser");

    const reviewText =
        get("reviewText");

    const reviewSubmit =
        get("reviewSubmit");


    if (currentUser) {

        showMainApp();


        if (reviewUser) {

            reviewUser.hidden =
                false;

        }


        if (reviewText) {

            reviewText.disabled =
                false;

        }


        if (reviewSubmit) {

            reviewSubmit.disabled =
                false;

        }


        loadReviews();

        loadDownloadCount();


    } else {

        showLoginScreen();


        if (reviewUser) {

            reviewUser.hidden =
                true;

        }


        if (reviewText) {

            reviewText.disabled =
                true;

        }


        if (reviewSubmit) {

            reviewSubmit.disabled =
                false;

        }


        if (reviewsUnsubscribe) {

            reviewsUnsubscribe();

            reviewsUnsubscribe =
                null;

        }

    }

}


/* =========================================================
   FIREBASE INITIALIZATION
   ========================================================= */

function initializeFirebase() {

    try {

        if (
            typeof firebase ===
            "undefined"
        ) {

            throw new Error(
                "Firebase SDK not loaded."
            );

        }


        const config =
            getFirebaseConfig();


        if (!config) {

            throw new Error(
                "Firebase config not found. Check firebase-config.js."
            );

        }


        if (!firebase.apps.length) {

            firebase.initializeApp(
                config
            );

        }


        auth =
            firebase.auth();


        db =
            firebase.firestore();


        auth.onAuthStateChanged(
            async function (user) {

                currentUser =
                    user || null;


                if (currentUser) {

                    await ensureUserProfile(
                        currentUser
                    );

                    updateUserUI({
                        name:
                            currentUser.displayName ||
                            currentUser.email ||
                            "User",

                        email:
                            currentUser.email ||
                            "",

                        photoURL:
                            currentUser.photoURL ||
                            ""
                    });

                }


                renderAuthState();

            }
        );


    } catch (error) {

        console.error(
            "Firebase initialization error:",
            error
        );


        auth = null;
        db = null;
        currentUser = null;


        showLoginScreen();


        const count =
            get("downloadCount");

        if (count) {

            count.textContent =
                "0";

        }

    }

}


/* =========================================================
   INITIALIZE FIREBASE
   ========================================================= */

initializeFirebase();


/* =========================================================
   END OF SCRIPT
   ========================================================= */
