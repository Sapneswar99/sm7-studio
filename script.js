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
     MOBILE NAVIGATION MENU
     ============================================ */

  function updateMenuIcon(isOpen) {
    if (!navToggle) return;

    const icon = navToggle.querySelector('i');
    if (!icon) return;

    icon.classList.toggle('fa-bars', !isOpen);
    icon.classList.toggle('fa-times', isOpen);

    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  function openMenu() {
    if (!navLinks || !navToggle) return;

    navLinks.classList.add('active');
    updateMenuIcon(true);
  }

  function closeMenu() {
    if (!navLinks || !navToggle) return;

    navLinks.classList.remove('active');
    updateMenuIcon(false);
  }

  function toggleMenu() {
    if (!navLinks || !navToggle) return;

    const isOpen = navLinks.classList.contains('active');

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu();
    });
  }


  /* ============================================
     CLOSE MENU WHEN NAV LINK IS CLICKED
     ============================================ */

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });


  /* ============================================
     SMOOTH SCROLL
     ============================================ */

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    link.addEventListener('click', function (event) {

      const href = link.getAttribute('href');

      if (!href || href === '#' || href.length < 2) {
        return;
      }

      let target;

      try {
        target = document.querySelector(href);
      } catch (error) {
        return;
      }

      if (!target) {
        return;
      }

      event.preventDefault();

      const navbarHeight = navbar
        ? navbar.getBoundingClientRect().height
        : 70;

      const extraOffset = 10;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        navbarHeight -
        extraOffset;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });

    });

  });


  /* ============================================
     FAQ ACCORDION
     ============================================ */

  document.querySelectorAll('.faq-question').forEach(function (button) {

    button.addEventListener('click', function () {

      const faqItem = button.closest('.faq-item');

      if (!faqItem) return;

      const wasActive = faqItem.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(function (item) {
        item.classList.remove('active');
      });

      if (!wasActive) {
        faqItem.classList.add('active');
      }

    });

  });


  /* ============================================
     SCROLL REVEAL ANIMATION
     ============================================ */

  const animatedElements = document.querySelectorAll(
    '.feature-card, .format-card, .phone'
  );

  if (
    'IntersectionObserver' in window &&
    animatedElements.length > 0 &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';

          observer.unobserve(entry.target);

        });

      },
      observerOptions
    );

    animatedElements.forEach(function (element) {

      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition =
        'opacity 0.6s ease, transform 0.6s ease';

      observer.observe(element);

    });

  }


  /* ============================================
     NAVBAR SHADOW ON SCROLL
     ============================================ */

  function updateNavbarShadow() {

    if (!navbar) return;

    if (window.pageYOffset > 20) {
      navbar.style.boxShadow =
        '0 4px 20px rgba(0, 0, 0, 0.4)';
    } else {
      navbar.style.boxShadow = 'none';
    }

  }

  window.addEventListener(
    'scroll',
    updateNavbarShadow,
    { passive: true }
  );

  updateNavbarShadow();


  /* ============================================
     CLOSE MENU WHEN RESIZING TO DESKTOP
     ============================================ */

  let resizeTimer;

  window.addEventListener('resize', function () {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function () {

      if (window.innerWidth > 768) {
        closeMenu();
      }

    }, 150);

  });


  /* ============================================
     ESCAPE KEY CLOSES MOBILE MENU
     ============================================ */

  document.addEventListener('keydown', function (event) {

    if (event.key === 'Escape') {
      closeMenu();
    }

  });


  /* ============================================
     CLICK OUTSIDE MOBILE MENU
     ============================================ */

  document.addEventListener('click', function (event) {

    if (!navLinks || !navToggle) {
      return;
    }

    if (!navLinks.classList.contains('active')) {
      return;
    }

    const clickedInsideMenu =
      navLinks.contains(event.target);

    const clickedToggle =
      navToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }

  });


  /* ============================================
     DOWNLOAD TRACKING
     ============================================ */

  document.querySelectorAll('a[download]').forEach(function (button) {

    button.addEventListener('click', function () {

      console.log(
        'Super Video Player APK download started.'
      );

    });

  });


  /* ============================================
     FAQ ACCESSIBILITY
     ============================================ */

  document.querySelectorAll('.faq-question').forEach(function (button) {

    button.addEventListener('keydown', function (event) {

      if (
        event.key === 'Enter' ||
        event.key === ' '
      ) {

        event.preventDefault();
        button.click();

      }

    });

  });


  /* ============================================
     PREVENT MENU STATE ISSUES ON PAGE LOAD
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
