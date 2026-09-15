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

  if (!mobileMenu || !menuBtn) {
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
   */

  button.setAttribute(
    "href",
    APK_DOWNLOAD_URL
  );


  /*
   * Make sure the browser handles
   * the GitHub Release download normally.
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


/* -----------------------------------------
   Get FAQ elements safely
----------------------------------------- */

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


/* -----------------------------------------
   Close FAQ
----------------------------------------- */

function closeFaq(item) {

  if (!item) {
    return;
  }

  const {
    question,
    answer,
    symbol
  } = getFaqElements(item);


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


/* -----------------------------------------
   Open FAQ
----------------------------------------- */

function openFaq(item) {

  if (!item) {
    return;
  }

  const {
    question,
    answer,
    symbol
  } = getFaqElements(item);


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


  /*
   * Force browser to calculate the
   * real answer height.
   */

  requestAnimationFrame(() => {

    answer.style.maxHeight =
      answer.scrollHeight + "px";

  });

}


/* -----------------------------------------
   Initialize FAQ
----------------------------------------- */

faqItems.forEach(item => {

  const {
    question,
    answer
  } = getFaqElements(item);


  if (!question || !answer) {
    return;
  }


  /*
   * Accessibility attributes
   */

  if (
    !question.hasAttribute(
      "aria-expanded"
    )
  ) {

    question.setAttribute(
      "aria-expanded",
      item.classList.contains("active")
        ? "true"
        : "false"
    );

  }


  /*
   * Initial state
   */

  if (
    item.classList.contains("active")
  ) {

    openFaq(item);

  } else {

    closeFaq(item);

  }


  /* -----------------------------------------
     FAQ Click
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
       * Close all other FAQs
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


  /* -----------------------------------------
     Keyboard accessibility
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
   FAQ RESIZE FIX
========================================================= */

let faqResizeTimer = null;


window.addEventListener(
  "resize",
  () => {

    clearTimeout(
      faqResizeTimer
    );


    faqResizeTimer =
      setTimeout(
        () => {

          const activeFaqs =
            document.querySelectorAll(
              ".faq-item.active .faq-answer"
            );


          activeFaqs.forEach(
            answer => {

              answer.style.maxHeight =
                answer.scrollHeight + "px";

            }
          );

        },
        100
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

function handleResponsiveMenu() {

  if (
    window.innerWidth > 900
  ) {

    closeMobileMenu();

  }

}


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


      let target = null;


      /*
       * Safely find target.
       */

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


      target.scrollIntoView({

        behavior:
          prefersReducedMotion
            ? "auto"
            : "smooth",

        block: "start"

      });


      /*
       * Update URL without page jump.
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
   IMAGE LAZY LOADING SUPPORT
========================================================= */

images.forEach(image => {

  /*
   * Don't override an explicitly defined
   * loading attribute.
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

});


/* =========================================================
   INITIALIZE
========================================================= */

document.documentElement.classList.add(
  "js-ready"
);


/* =========================================================
   FINAL INITIALIZATION
========================================================= */

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
