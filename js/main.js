(() => {
  'use strict';

  /* ============ CONFIG ============
     TODO: reemplazar con el número real de WhatsApp del negocio
     (formato: lada de país + número, sin espacios ni símbolos, ej. 5216691234567) */
  const WHATSAPP_NUMBER = '521000000000';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ PRELOADER ============ */
  const loadingScreen = document.getElementById('loading-screen');
  const MIN_LOADER_MS = 2400;
  const startTime = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(MIN_LOADER_MS - elapsed, 0);
    setTimeout(() => {
      loadingScreen.classList.add('is-hidden');
      document.body.style.overflow = '';
      setTimeout(() => { loadingScreen.style.display = 'none'; }, 1200);
    }, remaining);
  });
  document.body.style.overflow = 'hidden';
  setTimeout(() => { document.body.style.overflow = ''; }, MIN_LOADER_MS + 300);

  /* ============ HEADER SCROLL STATE ============ */
  const header = document.getElementById('site-header');
  const onScrollHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ============ MOBILE NAV ============ */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ============ ACTIVE NAV LINK ON SCROLL ============ */
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = `#${entry.target.id}`;
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(sec => navObserver.observe(sec));

  /* ============ SCROLL REVEAL ============ */
  const revealTargets = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ============ TYPEWRITER ============ */
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const words = ['toda ocasión', 'regalar con significado', 'expresar tu estilo', 'acompañarte siempre'];
    let wordIndex = 0, charIndex = 0, deleting = false;

    const tick = () => {
      const current = words[wordIndex];
      if (!deleting) {
        charIndex++;
        typewriterEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
      } else {
        charIndex--;
        typewriterEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 65);
    };
    if (!prefersReducedMotion) {
      setTimeout(tick, MIN_LOADER_MS + 400);
    } else {
      typewriterEl.textContent = words[0];
    }
  }

  /* ============ PARALLAX (fixed-style movement on background images) ============ */
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  if (parallaxEls.length && !prefersReducedMotion) {
    let ticking = false;
    const updateParallax = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const speed = parseFloat(el.dataset.speed || '0.2');
        const centerOffset = rect.top + rect.height / 2 - vh / 2;
        const translate = (centerOffset * speed * -1) / 3;
        el.style.transform = `translate3d(0, ${translate}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', updateParallax);
    updateParallax();
  }

  /* ============ PARTICLES CANVAS ============ */
  const canvas = document.getElementById('particles-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    const colors = ['rgba(255,215,0,0.55)', 'rgba(192,192,192,0.5)', 'rgba(255,255,255,0.35)'];

    const resize = () => {
      const parent = canvas.parentElement;
      width = canvas.width = parent.offsetWidth;
      height = canvas.height = parent.offsetHeight;
    };

    const initParticles = () => {
      const count = Math.min(70, Math.floor((width * height) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();
    window.addEventListener('resize', () => { resize(); initParticles(); });
  }

  /* ============ WHATSAPP LINKS ============ */
  const buildWaLink = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  document.querySelectorAll('.js-whatsapp-link').forEach(link => {
    const message = link.dataset.waMessage || 'Hola, me gustaría más información.';
    link.setAttribute('href', buildWaLink(message));
  });

  /* ============ CONTACT FORM -> WHATSAPP ============ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const phone = contactForm.phone.value.trim();
      const interest = contactForm.interest.value;
      const message = contactForm.message.value.trim();

      const text = [
        `Hola, soy ${name}.`,
        `Mi teléfono de contacto es ${phone}.`,
        `Me interesa: ${interest}.`,
        message ? `Mensaje: ${message}` : null,
      ].filter(Boolean).join(' ');

      window.open(buildWaLink(text), '_blank', 'noopener');
    });
  }

  /* ============ FOOTER YEAR ============ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
