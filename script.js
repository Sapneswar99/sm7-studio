/* =========================================================
   SUPER VIDEO PLAYER
   Main JavaScript
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const APK_DOWNLOAD_URL =
    "https://github.com/Sapneswar99/sm7-studio/releases/download/v1.0.0/Super.Video.Player.apk";


/* =========================================================
   DOM
========================================================= */

const menuBtn =
    document.getElementById("menuBtn");

const mobileMenu =
    document.getElementById("mobileMenu");

const toast =
    document.getElementById("toast");

const yearElement =
    document.getElementById("year");

const header =
    document.getElementById("header");


/* =========================================================
   STATE
========================================================= */

let toastTimer = null;
let faqResizeTimer = null;


/* =========================================================
   REDUCED MOTION
========================================================= */

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


/* =========================================================
   CURRENT YEAR
========================================================= */

function updateCurrentYear() {

    if (!yearElement) {
        return;
    }

    yearElement.textContent =
        new Date().getFullYear();

}

updateCurrentYear();


/* =========================================================
   MOBILE MENU
========================================================= */

function openMobileMenu() {

    if (!mobileMenu || !menuBtn) {
        return;
    }

    mobileMenu.classList.add("open");

    menuBtn.classList.add("open");

    menuBtn.setAttribute(
        "aria-expanded",
        "true"
    );

    menuBtn.setAttribute(
        "aria-label",
        "Close navigation menu"
    );

    document.body.classList.add(
        "menu-open"
    );

}


function closeMobileMenu() {

    if (!mobileMenu || !menuBtn) {
        return;
    }

    mobileMenu.classList.remove("open");

    menuBtn.classList.remove("open");

    menuBtn.setAttribute(
        "aria-expanded",
        "false"
    );

    menuBtn.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

    document.body.classList.remove(
        "menu-open"
    );

}


function toggleMobileMenu() {

    if (!mobileMenu || !menuBtn) {
        return;
    }

    const isOpen =
        mobileMenu.classList.contains(
            "open"
        );

    if (isOpen) {

        closeMobileMenu();

    } else {

        openMobileMenu();

    }

}


/* =========================================================
   MOBILE MENU EVENTS
========================================================= */

if (menuBtn && mobileMenu) {

    menuBtn.setAttribute(
        "aria-expanded",
        "false"
    );

    menuBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            toggleMobileMenu();

        }
    );


    /* -----------------------------------------
       Mobile Navigation Links
    ----------------------------------------- */

    const mobileLinks =
        mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                closeMobileMenu();

            }
        );

    });


    /* -----------------------------------------
       Close when clicking outside
    ----------------------------------------- */

    document.addEventListener(
        "click",
        event => {

            if (
                !mobileMenu.classList.contains(
                    "open"
                )
            ) {
                return;
            }

            const clickedInsideMenu =
                mobileMenu.contains(
                    event.target
                );

            const clickedMenuButton =
                menuBtn.contains(
                    event.target
                );

            if (
                !clickedInsideMenu &&
                !clickedMenuButton
            ) {

                closeMobileMenu();

            }

        }
    );

}


/* =========================================================
   DOWNLOAD BUTTONS
========================================================= */

const downloadButtons =
    document.querySelectorAll(
        ".download-btn"
    );


downloadButtons.forEach(button => {

    /*
     * Always use the configured
     * real APK release URL.
     */

    button.setAttribute(
        "href",
        APK_DOWNLOAD_URL
    );


    /*
     * Keep normal GitHub release
     * download behaviour.
     */

    button.addEventListener(
        "click",
        () => {

            closeMobileMenu();

        }
    );

});


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    if (!toast) {
        return;
    }

    toast.textContent =
        String(message || "");

    toast.classList.add(
        "show"
    );

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2800
        );

}


/* =========================================================
   FAQ ELEMENT HELPER
========================================================= */

function getFaqElements(item) {

    if (!item) {

        return {
            question: null,
            answer: null,
            symbol: null
        };

    }

    return {

        question:
            item.querySelector(
                ".faq-question"
            ),

        answer:
            item.querySelector(
                ".faq-answer"
            ),

        symbol:
            item.querySelector(
                ".faq-symbol"
            )

    };

}


/* =========================================================
   CLOSE FAQ
========================================================= */

function closeFaq(item) {

    if (!item) {
        return;
    }

    const {
        question,
        answer,
        symbol
    } =
        getFaqElements(item);


    item.classList.remove(
        "active"
    );


    if (question) {

        question.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    if (answer) {

        answer.style.maxHeight =
            "0px";

    }


    if (symbol) {

        symbol.textContent =
            "+";

    }

}


/* =========================================================
   OPEN FAQ
========================================================= */

function openFaq(item) {

    if (!item) {
        return;
    }

    const {
        question,
        answer,
        symbol
    } =
        getFaqElements(item);


    if (!answer) {
        return;
    }


    item.classList.add(
        "active"
    );


    if (question) {

        question.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    if (symbol) {

        symbol.textContent =
            "−";

    }


    if (prefersReducedMotion) {

        answer.style.maxHeight =
            answer.scrollHeight + "px";

        return;

    }


    requestAnimationFrame(
        () => {

            answer.style.maxHeight =
                answer.scrollHeight + "px";

        }
    );

}


/* =========================================================
   FAQ ACCORDION
========================================================= */

const faqItems =
    document.querySelectorAll(
        ".faq-item"
    );


faqItems.forEach(item => {

    const {
        question,
        answer
    } =
        getFaqElements(item);


    if (!question || !answer) {
        return;
    }


    /* -----------------------------------------
       Accessibility
    ----------------------------------------- */

    question.setAttribute(
        "aria-expanded",
        item.classList.contains("active")
            ? "true"
            : "false"
    );


    /* -----------------------------------------
       Initial State
    ----------------------------------------- */

    if (
        item.classList.contains(
            "active"
        )
    ) {

        openFaq(item);

    } else {

        closeFaq(item);

    }


    /* -----------------------------------------
       Click
    ----------------------------------------- */

    question.addEventListener(
        "click",
        event => {

            event.preventDefault();

            const isActive =
                item.classList.contains(
                    "active"
                );


            /*
             * Close every other FAQ.
             */

            faqItems.forEach(
                otherItem => {

                    if (
                        otherItem !== item
                    ) {

                        closeFaq(
                            otherItem
                        );

                    }

                }
            );


            /*
             * Toggle selected FAQ.
             */

            if (isActive) {

                closeFaq(
                    item
                );

            } else {

                openFaq(
                    item
                );

            }

        }
    );


    /* -----------------------------------------
       Keyboard
    ----------------------------------------- */

    question.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                question.click();

            }

        }
    );

});


/* =========================================================
   FAQ RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            faqResizeTimer
        );


        faqResizeTimer =
            setTimeout(
                () => {

                    const activeAnswers =
                        document.querySelectorAll(
                            ".faq-item.active .faq-answer"
                        );


                    activeAnswers.forEach(
                        answer => {

                            answer.style.maxHeight =
                                answer.scrollHeight + "px";

                        }
                    );

                },
                120
            );

    },
    {
        passive: true
    }
);


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


if (prefersReducedMotion) {

    revealElements.forEach(
        element => {

            element.classList.add(
                "visible"
            );

        }
    );

} else if (
    "IntersectionObserver" in window
) {

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

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
                threshold: 0.10,
                rootMargin:
                    "0px 0px -40px 0px"
            }
        );


    revealElements.forEach(
        element => {

            revealObserver.observe(
                element
            );

        }
    );

} else {

    revealElements.forEach(
        element => {

            element.classList.add(
                "visible"
            );

        }
    );

}


/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */

function updateHeader() {

    if (!header) {
        return;
    }


    const isScrolled =
        window.scrollY > 20;


    if (isScrolled) {

        header.classList.add(
            "scrolled"
        );

        header.style.background =
            "rgba(5,5,7,0.94)";

    } else {

        header.classList.remove(
            "scrolled"
        );

        header.style.background =
            "rgba(5,5,7,0.72)";

    }

}


updateHeader();


window.addEventListener(
    "scroll",
    updateHeader,
    {
        passive: true
    }
);


/* =========================================================
   RESPONSIVE MENU
========================================================= */

function handleResponsiveMenu() {

    if (
        window.innerWidth > 900
    ) {

        closeMobileMenu();

    }

}


handleResponsiveMenu();


window.addEventListener(
    "resize",
    handleResponsiveMenu,
    {
        passive: true
    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {
            return;
        }


        /* Close mobile menu */

        if (
            mobileMenu &&
            mobileMenu.classList.contains(
                "open"
            )
        ) {

            closeMobileMenu();

        }


        /* Close active FAQ */

        const activeFaq =
            document.querySelector(
                ".faq-item.active"
            );


        if (activeFaq) {

            closeFaq(
                activeFaq
            );

        }

    }
);


/* =========================================================
   INTERNAL NAVIGATION
========================================================= */

const internalLinks =
    document.querySelectorAll(
        'a[href^="#"]'
    );


internalLinks.forEach(link => {

    link.addEventListener(
        "click",
        event => {

            const targetId =
                link.getAttribute(
                    "href"
                );


            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            let target = null;


            try {

                target =
                    document.querySelector(
                        targetId
                    );

            } catch (error) {

                return;

            }


            if (!target) {
                return;
            }


            event.preventDefault();


            closeMobileMenu();


            /*
             * Account for fixed header.
             */

            const headerHeight =
                header
                    ? header.offsetHeight
                    : 0;


            const targetTop =
                target.getBoundingClientRect()
                    .top +
                window.scrollY -
                headerHeight -
                10;


            window.scrollTo({

                top:
                    Math.max(
                        0,
                        targetTop
                    ),

                behavior:
                    prefersReducedMotion
                        ? "auto"
                        : "smooth"

            });


            /*
             * Update hash without
             * causing another jump.
             */

            if (
                history.pushState
            ) {

                try {

                    history.pushState(
                        null,
                        "",
                        targetId
                    );

                } catch (error) {

                    /* Ignore history errors */

                }

            }

        }
    );

});


/* =========================================================
   MOBILE MENU BODY LOCK
========================================================= */

function resetMobileMenuState() {

    document.body.classList.remove(
        "menu-open"
    );


    if (mobileMenu) {

        mobileMenu.classList.remove(
            "open"
        );

    }


    if (menuBtn) {

        menuBtn.classList.remove(
            "open"
        );

        menuBtn.setAttribute(
            "aria-expanded",
            "false"
        );

        menuBtn.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

    }

}


window.addEventListener(
    "pageshow",
    resetMobileMenuState
);


/* =========================================================
   IMAGE ERROR HANDLING
========================================================= */

const images =
    document.querySelectorAll(
        "img"
    );


images.forEach(
    image => {

        image.addEventListener(
            "error",
            () => {

                image.classList.add(
                    "image-error"
                );

            }
        );

    }
);


/* =========================================================
   IMAGE LOADING
========================================================= */

images.forEach(
    image => {

        /*
         * Preserve explicitly defined
         * loading attributes.
         */

        if (
            !image.hasAttribute(
                "loading"
            )
        ) {

            image.setAttribute(
                "loading",
                "lazy"
            );

        }

    }
);


/* =========================================================
   SCREENSHOT HORIZONTAL SCROLL
========================================================= */

const screenshotGrid =
    document.querySelector(
        ".real-screenshot-grid"
    );


if (screenshotGrid) {

    /*
     * Prevent accidental vertical page
     * movement while using horizontal
     * touch scrolling.
     */

    screenshotGrid.addEventListener(
        "wheel",
        event => {

            /*
             * Only convert vertical wheel
             * movement when horizontal
             * scrolling is actually possible.
             */

            if (
                screenshotGrid.scrollWidth <=
                screenshotGrid.clientWidth
            ) {
                return;
            }


            if (
                Math.abs(event.deltaY) >
                Math.abs(event.deltaX)
            ) {

                screenshotGrid.scrollLeft +=
                    event.deltaY;

            }

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        /*
         * If the user returns to the page,
         * make sure the mobile menu state
         * remains consistent.
         */

        if (
            document.visibilityState ===
            "visible"
        ) {

            if (
                window.innerWidth > 900
            ) {

                closeMobileMenu();

            }

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.documentElement.classList.add(
    "js-ready"
);


/* =========================================================
   FINAL STATE
========================================================= */

resetMobileMenuState();

updateHeader();
