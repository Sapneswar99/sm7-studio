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
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });
  }

  // ===== Close Menu on Link Click =====
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

  // ===== FAQ Accordion =====
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');

      // Close all FAQ items
      document.querySelectorAll('.faq-item').forEach(function (faq) {
        faq.classList.remove('active');
      });

      // Open clicked item if it was closed
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ===== Scroll Animation (Fade In) =====
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

    document.querySelectorAll('.feature-card, .format-card, .phone').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // ===== Navbar Shadow on Scroll =====
  window.addEventListener('scroll', function () {
    if (navbar) {
      if (window.pageYOffset > 20) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    }
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

  // ===== Escape Key Closes Menu =====
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // ===== Click Outside Closes Menu =====
  document.addEventListener('click', function (e) {
    if (!navLinks || !navToggle) return;
    if (!navLinks.classList.contains('active')) return;

    const isClickInsideMenu = navLinks.contains(e.target);
    const isClickOnToggle = navToggle.contains(e.target);

    if (!isClickInsideMenu && !isClickOnToggle) {
      closeMenu();
    }
  });

  // ===== Download Tracking =====
  document.querySelectorAll('a[download]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      console.log('Download started: Super Video Player');
    });
  });

  // ===== Console Branding =====
  console.log(
    '%c Super Video Player ',
    'background: #8b5cf6; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;'
  );
  console.log('Website ready for all devices!');

})();
