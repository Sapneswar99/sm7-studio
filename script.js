/* =====================================================
   SUPER VIDEO PLAYER WEBSITE
   FIREBASE CONNECTED VERSION
   ===================================================== */


/* ================= CONFIG ================= */

const APK_URL = "apk/super-video-player.apk";

/*
   IMPORTANT:
   Yahan Firebase Authentication mein
   owner ka REAL UID paste karo.

   Example:
   const OWNER_UID = "abc123xyz...";
*/
const OWNER_UID = "YOUR_OWNER_FIREBASE_UID";


/* ================= FIREBASE ================= */

let auth = null;
let db = null;
let currentUser = null;
let registerMode = false;
let reviewsUnsubscribe = null;


/* ================= HELPERS ================= */

function get(id) {
    return document.getElementById(id);
}


function showMessage(text) {
    alert(text);
}


function syntheticEmail(name) {

    return (
        name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9._-]/g, "")
        + "@supervideoplayer.local"
    );
}


function validName(name) {

    return /^[a-zA-Z0-9._-]{3,30}$/.test(name);
}


/* ================= LOADING SCREEN ================= */

window.addEventListener("load", function () {

    setTimeout(function () {

        const loading = get("loadingScreen");

        if (loading) {
            loading.classList.add("hide");
        }

    }, 2300);

});


/* ================= YEAR ================= */

if (get("year")) {

    get("year").textContent =
        new Date().getFullYear();

}


/* ================= AUTH MODAL ================= */

function openAuth(mode = "login") {

    registerMode = mode === "register";

    const modal = get("authModal");

    if (!modal) return;

    modal.classList.add("show");

    updateAuthUI();

}


function closeAuth() {

    const modal = get("authModal");

    if (modal) {
        modal.classList.remove("show");
    }

}


function toggleAuth() {

    registerMode = !registerMode;

    updateAuthUI();

}


function updateAuthUI() {

    const title = get("authTitle");
    const name = get("authName");
    const password = get("authPassword");
    const switchText = get("authSwitch");

    if (registerMode) {

        if (title) {
            title.textContent = "Create Account";
        }

        if (name) {
            name.style.display = "block";
            name.placeholder = "Name";
        }

        if (password) {
            password.placeholder = "Password";
        }

        if (switchText) {

            switchText.innerHTML =
                "Already have an account? <b>Login</b>";

        }

    } else {

        if (title) {
            title.textContent = "Login";
        }

        if (name) {
            name.style.display = "block";
            name.placeholder = "Name";
        }

        if (password) {
            password.placeholder = "Password";
        }

        if (switchText) {

            switchText.innerHTML =
                "Don't have an account? <b>Register</b>";

        }

    }

}


/* ================= LOGIN BUTTON ================= */

const loginButton = get("loginButton");

if (loginButton) {

    loginButton.addEventListener(
        "click",
        function () {

            if (currentUser) {

                auth.signOut();

            } else {

                openAuth("login");

            }

        }
    );

}


/* ================= AUTH SUBMIT ================= */

async function submitAuth() {

    if (!auth || !db) {

        showMessage(
            "Firebase is not connected yet."
        );

        return;
    }


    const nameInput = get("authName");
    const passwordInput = get("authPassword");

    const name =
        nameInput
            ? nameInput.value.trim()
            : "";

    const password =
        passwordInput
            ? passwordInput.value
            : "";


    if (!validName(name)) {

        showMessage(
            "Name must be 3–30 characters and may contain letters, numbers, dot, underscore or hyphen."
        );

        return;
    }


    if (password.length < 6) {

        showMessage(
            "Password must be at least 6 characters."
        );

        return;
    }


    const email = syntheticEmail(name);


    try {

        if (registerMode) {

            /*
               CREATE ACCOUNT
            */

            const credential =
                await auth.createUserWithEmailAndPassword(
                    email,
                    password
                );


            await credential.user.updateProfile({

                displayName: name

            });


            await db
                .collection("users")
                .doc(credential.user.uid)
                .set({

                    uid: credential.user.uid,

                    name: name,

                    createdAt:
                        firebase.firestore.FieldValue
                            .serverTimestamp()

                }, {

                    merge: true

                });


            showMessage(
                "Account created successfully."
            );


            closeAuth();


        } else {

            /*
               LOGIN
            */

            await auth.signInWithEmailAndPassword(
                email,
                password
            );


            closeAuth();

        }

    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );


        const code =
            error.code || "";


        if (
            code.includes(
                "email-already-in-use"
            )
        ) {

            showMessage(
                "This name is already registered."
            );

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

            showMessage(
                "Invalid name or password."
            );

        } else {

            showMessage(
                error.message ||
                "Authentication failed."
            );

        }

    }

}


/* ================= AUTH STATE ================= */

function renderAuthState() {

    const button = get("loginButton");

    if (!button) return;


    if (currentUser) {

        button.textContent = "Logout";

    } else {

        button.textContent = "Login";

    }

}


/* ================= DOWNLOAD ================= */

async function startDownload() {

    /*
       Login required
    */

    if (!currentUser) {

        showMessage(
            "Please Login/Register before downloading."
        );

        openAuth("login");

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


    if (!modal) return;


    modal.classList.add("show");


    let seconds = 5;


    if (countdown) {
        countdown.textContent = seconds;
    }


    if (progress) {

        progress.style.transform =
            "scaleX(1)";

    }


    if (status) {

        status.textContent =
            "Please wait...";

    }


    const timer =
        setInterval(async function () {

            seconds--;


            if (countdown) {

                countdown.textContent =
                    seconds;

            }


            if (progress) {

                progress.style.transform =
                    `scaleX(${seconds / 5})`;

            }


            if (seconds <= 0) {

                clearInterval(timer);


                if (status) {

                    status.textContent =
                        "Starting download...";

                }


                /*
                   Increase Firestore download count
                */

                try {

                    await increaseFirebaseDownloadCount();

                } catch (error) {

                    console.error(
                        "Download count error:",
                        error
                    );

                }


                /*
                   APK DOWNLOAD
                */

                const link =
                    document.createElement("a");


                link.href = APK_URL;

                link.download =
                    "super-video-player.apk";


                document.body.appendChild(link);

                link.click();

                link.remove();


                setTimeout(function () {

                    modal.classList.remove("show");

                }, 1000);

            }

        }, 1000);

}


/* ================= FIRESTORE DOWNLOAD COUNT ================= */

async function increaseFirebaseDownloadCount() {

    if (!db || !currentUser) {

        throw new Error(
            "Firebase authentication required."
        );

    }


    const ref =
        db
            .collection("stats")
            .doc("main");


    await db.runTransaction(
        async function (transaction) {

            const snapshot =
                await transaction.get(ref);


            let downloads = 0;


            if (snapshot.exists) {

                downloads =
                    Number(
                        snapshot.data().downloads || 0
                    );

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

                    merge: true

                }

            );

        }
    );


    await loadDownloadCount();

}


/* ================= LOAD DOWNLOAD COUNT ================= */

async function loadDownloadCount() {

    if (!db) return;


    try {

        const snapshot =
            await db
                .collection("stats")
                .doc("main")
                .get();


        const countElement =
            get("downloadCount");


        if (!countElement) return;


        if (snapshot.exists) {

            const downloads =
                Number(
                    snapshot.data().downloads || 0
                );


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


        const countElement =
            get("downloadCount");


        if (countElement) {

            countElement.textContent =
                "0";

        }

    }

}


/* ================= REVIEWS ================= */

async function submitReview() {

    if (!currentUser) {

        showMessage(
            "Please Login/Register before submitting a review."
        );

        openAuth("login");

        return;
    }


    const nameInput =
        get("reviewName");

    const textInput =
        get("reviewText");


    const name =
        nameInput
            ? nameInput.value.trim()
            : "";


    const text =
        textInput
            ? textInput.value.trim()
            : "";


    if (!name) {

        showMessage(
            "Please enter your name."
        );

        return;
    }


    if (!text) {

        showMessage(
            "Please write a review."
        );

        return;
    }


    if (text.length > 1000) {

        showMessage(
            "Review is too long. Maximum 1000 characters."
        );

        return;
    }


    try {

        await db
            .collection("reviews")
            .add({

                uid:
                    currentUser.uid,

                name:
                    name,

                text:
                    text,

                rating:
                    5,

                createdAt:
                    firebase.firestore
                        .FieldValue
                        .serverTimestamp()

            });


        if (textInput) {
            textInput.value = "";
        }


        showMessage(
            "Review posted successfully."
        );


    } catch (error) {

        console.error(
            "Review error:",
            error
        );


        showMessage(
            "Could not post review. Please try again."
        );

    }

}


/* ================= LOAD REVIEWS ================= */

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

                    renderReviews(snapshot);

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
                            '<p>Unable to load reviews.</p>';

                    }

                }

            );

}


/* ================= RENDER REVIEWS ================= */

function renderReviews(snapshot) {

    const list =
        get("reviewsList");


    if (!list) return;


    if (snapshot.empty) {

        list.innerHTML =
            "<p>No reviews yet. Be the first to review!</p>";

        return;
    }


    list.innerHTML = "";


    snapshot.forEach(function (doc) {

        const data =
            doc.data();


        const card =
            document.createElement("div");


        card.className =
            "review-card";


        const name =
            escapeHtml(
                data.name || "User"
            );


        const text =
            escapeHtml(
                data.text || ""
            );


        const date =
            data.createdAt &&
            data.createdAt.toDate
                ? data.createdAt
                    .toDate()
                    .toLocaleDateString()
                : "Just now";


        card.innerHTML = `

            <div class="review-header">

                <strong>
                    ${name}
                </strong>

                <span>
                    ${date}
                </span>

            </div>

            <p>
                ${text}
            </p>

        `;


        /*
           ONLY OWNER sees delete button
        */

        if (
            currentUser &&
            currentUser.uid === OWNER_UID
        ) {

            const deleteButton =
                document.createElement("button");


            deleteButton.className =
                "delete-review";


            deleteButton.textContent =
                "Delete";


            deleteButton.addEventListener(
                "click",
                async function () {

                    const confirmed =
                        confirm(
                            "Delete this review?"
                        );


                    if (!confirmed) return;


                    try {

                        await db
                            .collection("reviews")
                            .doc(doc.id)
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
            );


            card.appendChild(
                deleteButton
            );

        }


        list.appendChild(card);

    });

}


/* ================= ESCAPE HTML ================= */

function escapeHtml(value) {

    return String(value)
        .replace(
            /[&<>'"]/g,
            function (character) {

                return {

                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;"

                }[character];

            }
        );

}


/* ================= FIREBASE INIT ================= */

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


        if (
            typeof FIREBASE_CONFIG ===
            "undefined"
        ) {

            throw new Error(
                "firebase-config.js not loaded."
            );

        }


        firebase.initializeApp(
            FIREBASE_CONFIG
        );


        auth =
            firebase.auth();


        db =
            firebase.firestore();


        auth.onAuthStateChanged(
            async function (user) {

                currentUser =
                    user || null;


                renderAuthState();


                /*
                   Load reviews again so
                   owner delete button updates
                */

                loadReviews();


                await loadDownloadCount();

            }
        );


    } catch (error) {

        console.error(
            "Firebase initialization error:",
            error
        );


        currentUser = null;


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
                "<p>Firebase connection failed.</p>";

        }

    }

}


/* ================= ESC KEY ================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            const authModal =
                get("authModal");


            const downloadModal =
                get("downloadModal");


            if (authModal) {

                authModal.classList.remove(
                    "show"
                );

            }


            if (downloadModal) {

                downloadModal.classList.remove(
                    "show"
                );

            }

        }

    }
);


/* ================= START FIREBASE ================= */

initializeFirebase();
