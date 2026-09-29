/* ============================================
   SUPER VIDEO PLAYER - JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ============================================
     ELEMENT REFERENCES
     ============================================ */

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.querySelector('.navbar');


  /* ============================================
     MOBILE NAVIGATION
     ============================================ */

  function updateMenuIcon(isOpen) {
    if (!navToggle) return;

    const icon = navToggle.querySelector('i');

    if (icon) {
      icon.classList.toggle('fa-bars', !isOpen);
      icon.classList.toggle('fa-times', isOpen);
    }

    navToggle.setAttribute(
      'aria-expanded',
      String(isOpen)
    );

    navToggle.setAttribute(
      'aria-label',
      isOpen ? 'Close menu' : 'Open menu'
    );
  }


  function openMenu() {
    if (!navLinks || !navToggle) return;

    navLinks.classList.add('active');
    updateMenuIcon(true);

    document.body.classList.add('menu-open');
  }


  function closeMenu() {
    if (!navLinks || !navToggle) return;

    navLinks.classList.remove('active');
    updateMenuIcon(false);

    document.body.classList.remove('menu-open');
  }


  function toggleMenu() {
    if (!navLinks || !navToggle) return;

    const isOpen =
      navLinks.classList.contains('active');

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }


  if (navToggle) {
    navToggle.addEventListener(
      'click',
      function (event) {

        event.preventDefault();
        event.stopPropagation();

        toggleMenu();

      }
    );
  }


  /* ============================================
     CLOSE MENU WHEN NAV LINK IS CLICKED
     ============================================ */

  document
    .querySelectorAll('.nav-links a')
    .forEach(function (link) {

      link.addEventListener(
        'click',
        function () {
          closeMenu();
        }
      );

    });


  /* ============================================
     SMOOTH SCROLL
     ============================================ */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(function (link) {

      link.addEventListener(
        'click',
        function (event) {

          const href =
            link.getAttribute('href');

          if (
            !href ||
            href === '#' ||
            href.length < 2
          ) {
            return;
          }

          let target;

          try {
            target =
              document.querySelector(href);
          } catch (error) {
            return;
          }

          if (!target) {
            return;
          }

          event.preventDefault();

          closeMenu();

          const navbarHeight = navbar
            ? navbar.getBoundingClientRect().height
            : 70;

          const extraOffset = 16;

          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            navbarHeight -
            extraOffset;

          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
          });

        }
      );

    });


  /* ============================================
     FAQ ACCORDION
     ============================================ */

  document
    .querySelectorAll('.faq-question')
    .forEach(function (button) {

      button.addEventListener(
        'click',
        function () {

          const faqItem =
            button.closest('.faq-item');

          if (!faqItem) return;

          const wasActive =
            faqItem.classList.contains('active');

          document
            .querySelectorAll('.faq-item')
            .forEach(function (item) {

              item.classList.remove('active');

              const question =
                item.querySelector(
                  '.faq-question'
                );

              if (question) {
                question.setAttribute(
                  'aria-expanded',
                  'false'
                );
              }

            });


          if (!wasActive) {

            faqItem.classList.add('active');

            button.setAttribute(
              'aria-expanded',
              'true'
            );

          }

        }
      );

    });


  /* ============================================
     SCROLL REVEAL ANIMATION
     ============================================ */

  const animatedElements =
    document.querySelectorAll(
      '.feature-card, .format-card, .phone'
    );


  if (
    'IntersectionObserver' in window &&
    animatedElements.length > 0 &&
    !window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  ) {

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };


    const observer =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(
            function (entry) {

              if (!entry.isIntersecting) {
                return;
              }

              entry.target.style.opacity = '1';

              entry.target.style.transform =
                'translateY(0)';

              observer.unobserve(
                entry.target
              );

            }
          );

        },
        observerOptions
      );


    animatedElements.forEach(
      function (element) {

        element.style.opacity = '0';

        element.style.transform =
          'translateY(30px)';

        element.style.transition =
          'opacity 0.6s ease, transform 0.6s ease';

        observer.observe(element);

      }
    );

  }


  /* ============================================
     FLOATING HEADER / NAVBAR
     ============================================ */

  function updateNavbar() {

    if (!navbar) return;

    if (window.pageYOffset > 10) {

      navbar.classList.add('scrolled');

      navbar.style.boxShadow =
        '0 8px 30px rgba(0, 0, 0, 0.45)';

    } else {

      navbar.classList.remove('scrolled');

      navbar.style.boxShadow = 'none';

    }

  }


  window.addEventListener(
    'scroll',
    updateNavbar,
    {
      passive: true
    }
  );


  updateNavbar();


  /* ============================================
     CLOSE MENU ON RESIZE
     ============================================ */

  let resizeTimer;

  window.addEventListener(
    'resize',
    function () {

      clearTimeout(resizeTimer);

      resizeTimer =
        setTimeout(function () {

          if (window.innerWidth > 768) {
            closeMenu();
          }

        }, 150);

    }
  );


  /* ============================================
     ESCAPE KEY
     ============================================ */

  document.addEventListener(
    'keydown',
    function (event) {

      if (event.key === 'Escape') {
        closeMenu();
      }

    }
  );


  /* ============================================
     CLICK OUTSIDE MOBILE MENU
     ============================================ */

  document.addEventListener(
    'click',
    function (event) {

      if (!navLinks || !navToggle) {
        return;
      }

      if (
        !navLinks.classList.contains(
          'active'
        )
      ) {
        return;
      }

      const clickedInsideMenu =
        navLinks.contains(event.target);

      const clickedToggle =
        navToggle.contains(event.target);

      if (
        !clickedInsideMenu &&
        !clickedToggle
      ) {
        closeMenu();
      }

    }
  );


  /* ============================================
     DOWNLOAD TRACKING
     ============================================ */

  document
    .querySelectorAll('a[download]')
    .forEach(function (button) {

      button.addEventListener(
        'click',
        function () {

          console.log(
            'Super Video Player APK download started.'
          );

        }
      );

    });


  /* ============================================
     FAQ KEYBOARD ACCESSIBILITY
     ============================================ */

  document
    .querySelectorAll('.faq-question')
    .forEach(function (button) {

      button.addEventListener(
        'keydown',
        function (event) {

          if (
            event.key === 'Enter' ||
            event.key === ' '
          ) {

            event.preventDefault();

            button.click();

          }

        }
      );

    });


  /* ============================================
     INITIAL MENU STATE
     ============================================ */

  updateMenuIcon(
    navLinks
      ? navLinks.classList.contains('active')
      : false
  );


  /* ============================================
     CONSOLE BRANDING
     ============================================ */

  console.log(
    '%c Super Video Player ',
    'background:#8b5cf6;color:#ffffff;padding:5px 10px;border-radius:5px;font-weight:bold;'
  );

  console.log(
    'Website ready for all devices!'
  );


})();
