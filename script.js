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
   CURRENT YEAR
========================================================= */

if (yearElement) {

  yearElement.textContent =
    new Date().getFullYear();

}


/* =========================================================
   REDUCED MOTION
========================================================= */

const prefersReducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


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

  document.body.classList.remove(
    "menu-open"
  );

}


function toggleMobileMenu() {

  if (!mobileMenu) {
    return;
  }

  if (
    mobileMenu.classList.contains("open")
  ) {

    closeMobileMenu();

  } else {

    openMobileMenu();

  }

}


if (menuBtn && mobileMenu) {

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
        !mobileMenu.classList.contains("open")
      ) {
        return;
      }

      const clickedInsideMenu =
        mobileMenu.contains(event.target);

      const clickedMenuButton =
        menuBtn.contains(event.target);

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
   * Always use the real APK URL.
   * No fake/demo toast.
   */

  button.setAttribute(
    "href",
    APK_DOWNLOAD_URL
  );


  /*
   * Keep normal browser navigation.
   *
   * This is important because GitHub Releases
   * redirects to the actual APK asset.
   */

  button.addEventListener(
    "click",
    event => {

      if (!APK_DOWNLOAD_URL) {

        event.preventDefault();

        showToast(
          "APK download link is not configured."
        );

        return;

      }


      /*
       * Close mobile menu before downloading.
       */

      closeMobileMenu();


      /*
       * Do NOT preventDefault().
       *
       * Browser will follow the GitHub Release
       * APK URL and download the file.
       */

    }
  );

});


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(message) {

  if (!toast) {
    return;
  }

  toast.textContent =
    message;

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
   FAQ ACCORDION
========================================================= */

const faqItems =
  document.querySelectorAll(
    ".faq-item"
  );


function closeFaq(item) {

  if (!item) {
    return;
  }

  item.classList.remove(
    "active"
  );


  const question =
    item.querySelector(
      ".faq-question"
    );


  const answer =
    item.querySelector(
      ".faq-answer"
    );


  const symbol =
    item.querySelector(
      ".faq-symbol"
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


function openFaq(item) {

  if (!item) {
    return;
  }

  const question =
    item.querySelector(
      ".faq-question"
    );


  const answer =
    item.querySelector(
      ".faq-answer"
    );


  const symbol =
    item.querySelector(
      ".faq-symbol"
    );


  item.classList.add(
    "active"
  );


  if (question) {

    question.setAttribute(
      "aria-expanded",
      "true"
    );

  }


  if (answer) {

    answer.style.maxHeight =
      answer.scrollHeight + "px";

  }


  if (symbol) {

    symbol.textContent =
      "−";

  }

}


faqItems.forEach(item => {

  const question =
    item.querySelector(
      ".faq-question"
    );


  const answer =
    item.querySelector(
      ".faq-answer"
    );


  if (!question || !answer) {
    return;
  }


  /*
   * Initial state
   */

  if (
    item.classList.contains("active")
  ) {

    openFaq(item);

  } else {

    answer.style.maxHeight =
      "0px";

  }


  question.addEventListener(
    "click",
    () => {

      const isActive =
        item.classList.contains(
          "active"
        );


      /*
       * Close every other FAQ
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
       * Toggle selected FAQ
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

});


/* =========================================================
   FAQ RESIZE FIX
========================================================= */

window.addEventListener(
  "resize",
  () => {

    const activeFaq =
      document.querySelector(
        ".faq-item.active .faq-answer"
      );

    if (activeFaq) {

      activeFaq.style.maxHeight =
        activeFaq.scrollHeight + "px";

    }

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


if (
  prefersReducedMotion
) {

  /*
   * Accessibility:
   * Don't animate for users who prefer
   * reduced motion.
   */

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


  if (
    window.scrollY > 20
  ) {

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
   CLOSE MOBILE MENU ON DESKTOP
========================================================= */

window.addEventListener(
  "resize",
  () => {

    if (
      window.innerWidth > 900
    ) {

      closeMobileMenu();

    }

  },
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
      event.key === "Escape"
    ) {

      /*
       * Close mobile menu
       */

      if (
        mobileMenu &&
        mobileMenu.classList.contains(
          "open"
        )
      ) {

        closeMobileMenu();

      }


      /*
       * Close active FAQ
       * when Escape is pressed.
       */

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

  }
);


/* =========================================================
   SMOOTH INTERNAL LINKS
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


      const target =
        document.querySelector(
          targetId
        );


      if (!target) {
        return;
      }


      /*
       * Use native smooth scrolling.
       */

      event.preventDefault();


      closeMobileMenu();


      target.scrollIntoView({
        behavior:
          prefersReducedMotion
            ? "auto"
            : "smooth",
        block: "start"
      });


      /*
       * Update URL without jumping.
       */

      if (
        history.pushState
      ) {

        history.pushState(
          null,
          "",
          targetId
        );

      }

    }
  );

});


/* =========================================================
   PREVENT BODY LOCK AFTER PAGE LOAD
========================================================= */

window.addEventListener(
  "pageshow",
  () => {

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

    }

  }
);


/* =========================================================
   IMAGE LOAD HANDLING
========================================================= */

const images =
  document.querySelectorAll(
    "img"
  );


images.forEach(image => {

  image.addEventListener(
    "error",
    () => {

      image.classList.add(
        "image-error"
      );

    }
  );

});


/* =========================================================
   INITIALIZE
========================================================= */

document.documentElement.classList.add(
  "js-ready"
);
