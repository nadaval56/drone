/* =========================================================
   סולארסקאן | Solar Thermal Inspection — Interactions
   ========================================================= */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const fmt = (n, digits = 0) => Number(n).toLocaleString('he-IL', { maximumFractionDigits: digits });

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

  /* ---------- Loss calculator ---------- */
  /*
    הנחות (ניתנות לשינוי):
    YIELD_KWH_PER_KWP: תפוקה שנתית אופיינית בישראל לקילוואט מותקן.
    MODULE_KW: הספק פאנל ממוצע במערכות חדשות, לחישוב מספר הפאנלים המשוער.
  */
  const YIELD_KWH_PER_KWP = 1650;
  const MODULE_KW = 0.55;

  const calcKw = $('#calcKw');
  const calcTariff = $('#calcTariff');
  const calcLoss = $('#calcLoss');
  if (calcKw && calcTariff && calcLoss) {
    const out = {
      lossLabel: $('#calcLossLabel'),
      kwh: $('#calcKwh'),
      money: $('#calcMoney'),
      yieldEl: $('#calcYield'),
      kwEcho: $('#calcKwEcho'),
      modules: $('#calcModules'),
    };
    out.yieldEl.textContent = fmt(YIELD_KWH_PER_KWP);

    const update = () => {
      const kw = Math.max(0, Number(calcKw.value) || 0);
      const tariff = Math.max(0, Number(calcTariff.value) || 0);
      const lossPct = Number(calcLoss.value) || 0;
      const lostKwh = kw * YIELD_KWH_PER_KWP * (lossPct / 100);
      const lostMoney = lostKwh * tariff;

      out.lossLabel.textContent = fmt(lossPct, 1) + '%';
      out.kwh.textContent = fmt(lostKwh);
      out.money.textContent = '₪' + fmt(lostMoney);
      out.kwEcho.textContent = fmt(kw);
      out.modules.textContent = fmt(Math.round(kw / MODULE_KW / 10) * 10);
    };
    [calcKw, calcTariff, calcLoss].forEach((el) => el.addEventListener('input', update));
    update();
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
        'היי, אשמח לקבל הצעת מחיר לבדיקה תרמית של מערכת סולארית.',
        `שם: ${data.name}`,
        `טלפון: ${data.phone}`,
        data.email ? `אימייל: ${data.email}` : null,
        `סוג המערכת: ${data.type}`,
        data.kw ? `גודל: ${data.kw} קילוואט` : null,
        data.reason ? `סיבת הבדיקה: ${data.reason}` : null,
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
