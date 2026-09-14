/* =====================================================
   SUPER VIDEO PLAYER WEBSITE
   ===================================================== */


/* ================= CONFIG ================= */

/*
   Apna APK yahan rakhein:

   website/
   ├── index.html
   ├── style.css
   ├── script.js
   └── apk/
       └── super-video-player.apk
*/

const APK_URL =
    "apk/super-video-player.apk";


/*
   Owner UID yahan add karein.

   Firebase Authentication se
   owner ka UID milega.
*/

const OWNER_UID =
    "YOUR_OWNER_FIREBASE_UID";


/* ================= LOADING SCREEN ================= */

window.addEventListener("load", function () {

    setTimeout(function () {

        const loading =
            document.getElementById(
                "loadingScreen"
            );

        loading.classList.add("hide");

    }, 2300);

});


/* ================= YEAR ================= */

document.getElementById("year")
    .textContent =
    new Date().getFullYear();


/* ================= AUTH ================= */

let registerMode = false;


function openAuth() {

    document
        .getElementById("authModal")
        .classList.add("show");

}


function closeAuth() {

    document
        .getElementById("authModal")
        .classList.remove("show");

}


function toggleAuth() {

    registerMode =
        !registerMode;


    const title =
        document.getElementById(
            "authTitle"
        );


    const name =
        document.getElementById(
            "authName"
        );


    const switchText =
        document.getElementById(
            "authSwitch"
        );


    if (registerMode) {

        title.textContent =
            "Create Account";


        name.style.display =
            "block";


        switchText.innerHTML =
            "Already have an account? " +
            "<b>Login</b>";

    }

    else {

        title.textContent =
            "Login";


        name.style.display =
            "none";


        switchText.innerHTML =
            "Don't have an account? " +
            "<b>Register</b>";

    }

}


/* ================= LOGIN BUTTON ================= */

document
    .getElementById("loginButton")
    .addEventListener(
        "click",
        function () {

            openAuth();

        }
    );


/* ================= AUTH SUBMIT ================= */

async function submitAuth() {

    const name =
        document
            .getElementById(
                "authName"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "authPassword"
            )
            .value
            .trim();


    if (registerMode && !name) {

        alert(
            "Please enter your name."
        );

        return;

    }


    if (!password) {

        alert(
            "Please enter your password."
        );

        return;

    }


    /*
       IMPORTANT:

       Real Name + Password authentication
       ko secure banane ke liye Firebase/backend
       integration zaroori hai.

       Password ko Firestore mein plain text
       kabhi store mat karein.
    */


    if (
        typeof window.firebaseAuthHandler ===
        "function"
    ) {

        await window
            .firebaseAuthHandler(
                name,
                password,
                registerMode
            );

    }

    else {

        alert(
            "Firebase Authentication is not configured yet."
        );

    }

}


/* ================= DOWNLOAD ================= */

function startDownload() {

    /*
       Login check

       Firebase connected hone par
       currentUser automatically check hoga.
    */

    if (
        window.firebaseCurrentUser &&
        !window.firebaseCurrentUser()
    ) {

        alert(
            "Please Login/Register before downloading."
        );

        openAuth();

        return;

    }


    const modal =
        document.getElementById(
            "downloadModal"
        );


    const countdown =
        document.getElementById(
            "countdown"
        );


    const progress =
        document.getElementById(
            "countdownProgress"
        );


    const status =
        document.getElementById(
            "downloadStatus"
        );


    modal.classList.add("show");


    let seconds = 5;


    countdown.textContent =
        seconds;


    progress.style.transform =
        "scaleX(1)";


    status.textContent =
        "Please wait...";


    const timer =
        setInterval(function () {

            seconds--;


            countdown.textContent =
                seconds;


            progress.style.transform =
                `scaleX(${seconds / 5})`;


            if (seconds <= 0) {

                clearInterval(timer);


                status.textContent =
                    "Starting download...";


                /*
                   REAL DOWNLOAD COUNT

                   Firebase function yahan call hogi.
                */

                if (
                    typeof window
                        .increaseFirebaseDownloadCount
                    === "function"
                ) {

                    window
                        .increaseFirebaseDownloadCount();

                }


                /* ================= APK DOWNLOAD ================= */

                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    APK_URL;


                link.download =
                    "super-video-player.apk";


                document.body.appendChild(
                    link
                );


                link.click();


                link.remove();


                setTimeout(function () {

                    modal.classList.remove(
                        "show"
                    );

                }, 1000);

            }

        }, 1000);

}


/* ================= REVIEWS ================= */

async function submitReview() {

    const name =
        document
            .getElementById(
                "reviewName"
            )
            .value
            .trim();


    const text =
        document
            .getElementById(
                "reviewText"
            )
            .value
            .trim();


    if (!name) {

        alert(
            "Please enter your name."
        );

        return;

    }


    if (!text) {

        alert(
            "Please write a review."
        );

        return;

    }


    /*
       Firebase configured hone par
       ye function Firebase Firestore mein
       review save karega.
    */

    if (
        typeof window
            .submitFirebaseReview
        === "function"
    ) {

        await window
            .submitFirebaseReview(
                name,
                text
            );

    }

    else {

        alert(
            "Firebase Reviews is not configured yet."
        );

    }

}


/* ================= ESC KEY ================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            document
                .getElementById(
                    "authModal"
                )
                .classList
                .remove("show");


            document
                .getElementById(
                    "downloadModal"
                )
                .classList
                .remove("show");

        }

    }
);
