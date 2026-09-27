/* ============================================
   Super Video Player - JavaScript
   ============================================ */

(function () {
  'use strict';

  // ===== Element References =====
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.querySelector('.navbar');

  // ===== Mobile Menu Toggle =====
  function toggleMenu() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.toggle('active');
    const icon = navToggle.querySelector('i');
    if (!icon) return;

    if (navLinks.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  }

  function closeMenu() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove('active');
    const icon = navToggle.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
  }

  // ===== Close menu on link click =====
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    });
  });

  // ===== Scroll Animation (Intersection Observer) =====
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .phone').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // ===== Navbar Shadow on Scroll =====
  let lastScroll = 0;
  window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset;
    if (navbar) {
      if (currentScroll > 20) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // ===== Close Menu on Resize (Desktop) =====
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    }, 150);
  });

  // ===== Download Tracking =====
  document.querySelectorAll('a[download]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      console.log('Download started: Super Video Player');
    });
  });

  // ===== Escape Key closes menu =====
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // ===== Click outside closes menu =====
  document.addEventListener('click', function (e) {
    if (!navLinks || !navToggle) return;
    if (!navLinks.classList.contains('active')) return;

    const isClickInsideMenu = navLinks.contains(e.target);
    const isClickOnToggle = navToggle.contains(e.target);

    if (!isClickInsideMenu && !isClickOnToggle) {
      closeMenu();
    }
  });

  // ===== Console Branding =====
  console.log(
    '%c Super Video Player ',
    'background: #8b5cf6; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;'
  );
  console.log('Responsive website ready for all devices!');

})();
