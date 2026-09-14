/* =========================================================
   מעוף | Drone Photography — Interactions
   ========================================================= */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Sticky nav ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = $('#navToggle');
  const links = $('#navLinks');
  const closeMenu = () => {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'פתיחת תפריט');
  };
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
  });
  $$('a', links).forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$('.stat__num[data-count]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animateCount = (el) => {
    const target = Number(el.dataset.count) || 0;
    if (reduceMotion) { el.textContent = target.toLocaleString('he-IL'); return; }
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString('he-IL');
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animateCount(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Package pre-select ---------- */
  const packageSelect = $('#packageSelect');
  $$('[data-package]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (packageSelect) packageSelect.value = btn.dataset.package;
    });
  });

  /* ---------- Quote form ---------- */
  const form = $('#quoteForm');
  const success = $('#formSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      $$('[required]', form).forEach((field) => {
        const ok = field.value.trim() !== '' && field.checkValidity();
        field.classList.toggle('is-invalid', !ok);
        if (!ok && valid) { field.focus(); }
        valid = valid && ok;
      });
      if (!valid) return;

      const data = Object.fromEntries(new FormData(form).entries());

      /* -------------------------------------------------------------
         חיבור לשרת: החליפו את הבלוק הזה בקריאה לשירות טפסים
         (Formspree / Netlify Forms / EmailJS / API משלכם).
         כרגע הטופס פותח וואטסאפ עם הפרטים שהוזנו, כך שהוא עובד
         גם באתר סטטי לגמרי.
         ------------------------------------------------------------- */
      const lines = [
        'היי, אשמח לקבל הצעת מחיר לצילום רחפן.',
        `שם: ${data.name}`,
        `טלפון: ${data.phone}`,
        data.email ? `אימייל: ${data.email}` : null,
        `סוג צילום: ${data.type}`,
        data.package ? `חבילה: ${data.package}` : null,
        data.message ? `פרטים: ${data.message}` : null,
      ].filter(Boolean);
      const url = 'https://wa.me/972501234567?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');

      success.hidden = false;
      form.reset();
    });

    $$('input, select, textarea', form).forEach((field) => {
      field.addEventListener('input', () => field.classList.remove('is-invalid'));
    });
  }

  /* ---------- Footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
