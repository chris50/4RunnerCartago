/* ═══════════════════════════════════════════════════════════════════
   4RUNNER CARTAGO — main.js
   Animaciones, interactividad y comportamiento del sitio
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Loader ─────────────────────────────────────────────────────── */
(function () {
  const loader   = document.getElementById('loader');
  const fill     = document.getElementById('loaderFill');
  let   progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    if (fill) fill.style.width = progress + '%';
  }, 80);

  window.addEventListener('load', () => {
    clearInterval(interval);
    if (fill)   fill.style.width = '100%';
    if (loader) {
      setTimeout(() => { loader.classList.add('hidden'); }, 350);
    }
  });

  // Fallback: hide loader after 3 s even without load event
  setTimeout(() => {
    if (loader) loader.classList.add('hidden');
  }, 3000);
})();

/* ─── Navbar ─────────────────────────────────────────────────────── */
(function () {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll → change nav appearance
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else                      nav.classList.remove('scrolled');
  }, { passive: true });

  // Mobile menu toggle
  hamburger && hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // Close mobile menu on link click
  navLinks && navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger && hamburger.classList.remove('open');
    });
  });
})();

/* ─── Active nav link on scroll ─────────────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector('.nav__link[href="#' + entry.target.id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
})();

/* ─── Hero Parallax ─────────────────────────────────────────────── */
(function () {
  const bg = document.getElementById('heroBg');
  if (!bg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      bg.style.transform = 'scale(1.05) translateY(' + (y * 0.25) + 'px)';
    }
  }, { passive: true });
})();

/* ─── Scroll Reveal (IntersectionObserver) ─────────────────────── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ─── Counter Animation ──────────────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('.hero__stat-num');
  if (!counters.length) return;

  let started = false;

  function animateCounters() {
    if (started) return;
    started = true;
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const duration = 1400;
      const start    = performance.now();

      function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else counter.textContent = target;
      }
      requestAnimationFrame(step);
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) animateCounters(); });
  }, { threshold: 0.4 });

  const statsEl = document.querySelector('.hero__stats');
  if (statsEl) observer.observe(statsEl);
})();

/* ─── Gallery Lightbox ───────────────────────────────────────────── */
(function () {
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightboxImg');
  const lbClose   = document.getElementById('lightboxClose');
  const lbBdrop   = document.getElementById('lightboxBackdrop');
  if (!lightbox) return;

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  document.querySelectorAll('.galeria__item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src || item.querySelector('img').src;
      const alt = item.querySelector('img').alt;
      openLightbox(src, alt);
    });
  });

  lbClose && lbClose.addEventListener('click', closeLightbox);
  lbBdrop && lbBdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
})();

/* ─── Join Form → WhatsApp ───────────────────────────────────────── */
(function () {
  const form    = document.getElementById('joinForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    const nombre   = form.querySelector('#nombre').value.trim();
    const whatsapp = form.querySelector('#whatsapp').value.trim();
    const vehiculo = form.querySelector('#vehiculo').value;

    if (!nombre || !whatsapp || !vehiculo) {
      // Shake invalid fields
      [form.querySelector('#nombre'), form.querySelector('#whatsapp'), form.querySelector('#vehiculo')]
        .forEach(field => {
          if (!field.value.trim()) {
            field.style.borderColor = '#e10a1d';
            field.addEventListener('input', () => field.style.borderColor = '', { once: true });
          }
        });
      return;
    }

    const anio    = form.querySelector('#anio').value;
    const mensaje = form.querySelector('#mensaje').value.trim();

    const text = encodeURIComponent(
      `🚙 *Solicitud de Membresía — 4Runner Cartago*\n\n` +
      `👤 *Nombre:* ${nombre}\n` +
      `📱 *WhatsApp:* ${whatsapp}\n` +
      `🚗 *Vehículo:* ${vehiculo}${anio ? ' ' + anio : ''}\n` +
      (mensaje ? `\n💬 *Mensaje:* ${mensaje}` : '') +
      `\n\n_Enviado desde el sitio web del club._`
    );

    // Replace with real WhatsApp number of the club
    const phoneNumber = '50688888888';
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');

    // Show success state
    form.style.display = 'none';
    if (success) success.style.display = 'block';
  });
})();

/* ─── Scroll-to-top button ───────────────────────────────────────── */
(function () {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btn.classList.add('visible');
    else                       btn.classList.remove('visible');
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─── Smooth anchor scroll for older browsers ───────────────────── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ─── Subtle hero title letter-by-letter glow on hover ──────────── */
(function () {
  const titleMain = document.querySelector('.hero__title-main');
  if (!titleMain) return;
  titleMain.addEventListener('mouseenter', () => {
    titleMain.style.textShadow = '0 0 60px rgba(225,10,29,0.4), 0 4px 40px rgba(0,0,0,0.4)';
  });
  titleMain.addEventListener('mouseleave', () => {
    titleMain.style.textShadow = '0 4px 40px rgba(0,0,0,0.4)';
  });
})();

/* ─── Nav link active underline animation ────────────────────────── */
(function () {
  // Add CSS for active nav link via JS (avoids extra CSS rule)
  const style = document.createElement('style');
  style.textContent = `
    .nav__link.active { color: var(--toyota-red) !important; }
    .nav.scrolled .nav__link.active { color: var(--toyota-red) !important; }
  `;
  document.head.appendChild(style);
})();
