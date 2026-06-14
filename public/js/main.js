/* ============================================================
   SOLARA — main.js
   Vanilla JS + GSAP ScrollTrigger
============================================================ */

/* ----------------------------------------------------------
   PAGE LOADER
---------------------------------------------------------- */
(function initLoader() {
  const loader = document.getElementById('pageLoader');
  const loaderLogo = loader.querySelector('.loader-logo');

  const tl = gsap.timeline({
    onComplete: () => {
      loader.style.pointerEvents = 'none';
      initHeroAnimation();
    }
  });

  tl.to(loaderLogo, { opacity: 1, duration: 0.5, ease: 'power2.out' })
    .to(loaderLogo, { opacity: 0, duration: 0.4, ease: 'power2.in', delay: 0.3 })
    .to(loader, { opacity: 0, duration: 0.4, ease: 'power2.in' }, '-=0.2')
    .set(loader, { display: 'none' });
})();

/* ----------------------------------------------------------
   HERO ANIMATION (fires after loader)
---------------------------------------------------------- */
function initHeroAnimation() {
  const heroEyebrow = document.querySelector('.hero-eyebrow');
  const heroLines = document.querySelectorAll('.hero-line');
  const heroSubtext = document.querySelector('.hero-subtext');
  const heroCta = document.querySelector('.hero-cta-row');
  const heroStats = document.querySelector('.hero-stats');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo(heroEyebrow,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 }, 0.2)
    .fromTo(heroLines,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.4)
    .fromTo(heroSubtext,
      { opacity: 0 },
      { opacity: 1, duration: 0.7 }, 0.85)
    .fromTo(heroCta,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 }, 1.05)
    .fromTo(heroStats,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 }, 1.2);

  // Stat counters
  setTimeout(initCounters, 1400);
}

/* ----------------------------------------------------------
   STAT COUNTERS
---------------------------------------------------------- */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');

  statNumbers.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
}

/* ----------------------------------------------------------
   CUSTOM CURSOR
---------------------------------------------------------- */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animateCursor() {
    curX = lerp(curX, mouseX, 0.12);
    curY = lerp(curY, mouseY, 0.12);
    cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  const hoverTargets = document.querySelectorAll('a, button, .service-card, .project-card, .btn');

  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
  });
})();

/* ----------------------------------------------------------
   NAVIGATION SCROLL EFFECT
---------------------------------------------------------- */
(function initNav() {
  const nav = document.getElementById('mainNav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
})();

/* ----------------------------------------------------------
   HAMBURGER / MOBILE MENU
---------------------------------------------------------- */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMenu() {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ----------------------------------------------------------
   GSAP SCROLL ANIMATIONS
---------------------------------------------------------- */
(function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* Generic fade-up reveal */
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      }
    );
  });

  /* Slide in from left */
  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -60 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      }
    );
  });

  /* Staggered children */
  const staggerParents = [
    { selector: '.services-grid', child: '.reveal-stagger' },
    { selector: '.process-steps', child: '.reveal-stagger' },
    { selector: '.projects-grid', child: '.reveal-stagger' },
    { selector: '.testimonials-grid', child: '.reveal-stagger' }
  ];

  staggerParents.forEach(({ selector, child }) => {
    const parent = document.querySelector(selector);
    if (!parent) return;
    const children = parent.querySelectorAll(child);

    gsap.fromTo(children,
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: parent,
          start: 'top 80%',
          once: true
        }
      }
    );
  });

  /* About section */
  const aboutLeft = document.querySelector('.about-left');
  const aboutRight = document.querySelector('.about-right');

  if (aboutLeft) {
    gsap.fromTo(aboutLeft,
      { opacity: 0, x: -50 },
      {
        opacity: 1, x: 0, duration: 0.9, ease: 'power2.out',
        scrollTrigger: { trigger: aboutLeft, start: 'top 80%', once: true }
      }
    );
  }

  if (aboutRight) {
    gsap.fromTo(aboutRight,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.15,
        scrollTrigger: { trigger: aboutRight, start: 'top 80%', once: true }
      }
    );
  }

  /* CTA banner */
  const ctaInner = document.querySelector('.cta-inner');
  if (ctaInner) {
    gsap.fromTo(ctaInner,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: ctaInner, start: 'top 80%', once: true }
      }
    );
  }

  /* Eyebrow labels */
  gsap.utils.toArray('.eyebrow').forEach(el => {
    if (el.closest('.hero')) return; // hero handles its own
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      }
    );
  });

  /* Section headings (non-hero) */
  gsap.utils.toArray('.section-heading').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      }
    );
  });

  /* Hero graphic slow drift */
  const heroGraphic = document.querySelector('.hero-graphic');
  if (heroGraphic) {
    gsap.to(heroGraphic, {
      y: 60,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }
})();

/* ----------------------------------------------------------
   SMOOTH ANCHOR SCROLL
---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = document.getElementById('mainNav').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
