/* =========================================================
   SUPER VIDEO PLAYER
   Main JavaScript
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

// Replace this later with your real APK URL.
const APK_DOWNLOAD_URL = "#";


/* =========================================================
   DOM
========================================================= */

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const toast = document.getElementById("toast");
const yearElement = document.getElementById("year");


/* =========================================================
   CURRENT YEAR
========================================================= */

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* =========================================================
   MOBILE MENU
========================================================= */

if (menuBtn && mobileMenu) {

  menuBtn.addEventListener("click", () => {

    const isOpen =
      mobileMenu.classList.toggle("open");

    menuBtn.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

  });


  const mobileLinks =
    mobileMenu.querySelectorAll("a");

  mobileLinks.forEach(link => {

    link.addEventListener("click", () => {

      mobileMenu.classList.remove("open");

      menuBtn.setAttribute(
        "aria-expanded",
        "false"
      );

      document.body.style.overflow = "";

    });

  });

}


/* =========================================================
   DOWNLOAD BUTTONS
========================================================= */

const downloadButtons =
  document.querySelectorAll(".download-btn");

downloadButtons.forEach(button => {

  button.addEventListener("click", event => {

    if (
      !APK_DOWNLOAD_URL ||
      APK_DOWNLOAD_URL === "#"
    ) {

      event.preventDefault();

      showToast(
        "APK download link will be available soon."
      );

      return;
    }

    button.href = APK_DOWNLOAD_URL;

  });

});


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;

function showToast(message) {

  if (!toast) {
    return;
  }

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toast.classList.remove("show");

  }, 2800);

}


/* =========================================================
   FAQ ACCORDION
========================================================= */

const faqItems =
  document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

  const question =
    item.querySelector(".faq-question");

  const answer =
    item.querySelector(".faq-answer");

  if (!question || !answer) {
    return;
  }

  question.addEventListener("click", () => {

    const currentlyActive =
      item.classList.contains("active");


    // Close all FAQ items.

    faqItems.forEach(otherItem => {

      otherItem.classList.remove("active");

      const otherAnswer =
        otherItem.querySelector(".faq-answer");

      if (otherAnswer) {
        otherAnswer.style.maxHeight = null;
      }

    });


    // Open selected item.

    if (!currentlyActive) {

      item.classList.add("active");

      answer.style.maxHeight =
        answer.scrollHeight + "px";

    }

  });

});


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
  document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  revealElements.forEach(element => {

    observer.observe(element);

  });

} else {

  revealElements.forEach(element => {

    element.classList.add("visible");

  });

}


/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */

const header =
  document.getElementById("header");


window.addEventListener(
  "scroll",
  () => {

    if (!header) {
      return;
    }

    if (window.scrollY > 20) {

      header.style.background =
        "rgba(5,5,7,0.92)";

    } else {

      header.style.background =
        "rgba(5,5,7,0.72)";

    }

  },
  {
    passive: true
  }
);


/* =========================================================
   CLOSE MOBILE MENU WITH ESC
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape" &&
      mobileMenu &&
      mobileMenu.classList.contains("open")
    ) {

      mobileMenu.classList.remove("open");

      if (menuBtn) {

        menuBtn.setAttribute(
          "aria-expanded",
          "false"
        );

      }

      document.body.style.overflow = "";

    }

  }
);
