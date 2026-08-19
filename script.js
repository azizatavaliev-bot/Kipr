/* Kipr Studio — курсор, появление секций, счётчики, активный раздел. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- круглый курсор ---------- */

  var cursor = document.querySelector('.cursor');
  var label = cursor.querySelector('.cursor__label');
  var LABELS = { view: 'Смотреть', plus: 'Подробнее', cta: 'Поехали' };

  if (fine) {
    var x = window.innerWidth / 2;
    var y = window.innerHeight / 2;
    var tx = x;
    var ty = y;

    document.addEventListener('mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
      cursor.classList.add('is-visible');
    });

    document.addEventListener('mouseleave', function () { cursor.classList.remove('is-visible'); });
    document.addEventListener('mousedown', function () { cursor.classList.add('is-down'); });
    document.addEventListener('mouseup', function () { cursor.classList.remove('is-down'); });

    (function loop() {
      x += (tx - x) * (reduced ? 1 : 0.18);
      y += (ty - y) * (reduced ? 1 : 0.18);
      cursor.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mouseover', function (e) {
      var host = e.target.closest('[data-cursor]');
      var kind = host ? host.getAttribute('data-cursor') : '';
      var text = LABELS[kind] || '';

      cursor.classList.toggle('is-link', kind === 'link');
      cursor.classList.toggle('is-labelled', Boolean(text));
      label.textContent = text;
    });
  }

  /* ---------- появление блоков ---------- */

  var revealables = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    // соседние элементы всплывают каскадом, а не одной стенкой
    var groups = {};
    revealables.forEach(function (el) {
      var key = el.closest('.slide').id;
      groups[key] = (groups[key] || 0) + 1;
      el.style.setProperty('--delay', (groups[key] - 1) * 90 + 'ms');
      revealObserver.observe(el);
    });
  }

  /* ---------- счётчики на экране «Кипр» ---------- */

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var grouped = target >= 1000 && decimals === 0;
    var duration = 1400;
    var start = null;

    if (reduced) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    function frame(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var value = target * eased;
      el.textContent = (grouped ? Math.round(value).toString() : value.toFixed(decimals)) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  var counters = document.querySelectorAll('[data-count]');

  if (!('IntersectionObserver' in window)) {
    counters.forEach(runCounter);
  } else {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------- активный раздел и цвет панели ---------- */

  var slides = document.querySelectorAll('.slide');
  var navLinks = document.querySelectorAll('.nav__link');
  var railLinks = document.querySelectorAll('.rail a');
  var topbar = document.querySelector('.topbar');
  var rail = document.querySelector('.rail');
  var LIGHT_SLIDES = ['about'];

  function setActive(id) {
    navLinks.forEach(function (a) { a.classList.toggle('is-active', a.hash === '#' + id); });
    railLinks.forEach(function (a) { a.classList.toggle('is-active', a.hash === '#' + id); });
    var light = LIGHT_SLIDES.indexOf(id) !== -1;
    topbar.classList.toggle('on-light', light);
    rail.classList.toggle('on-light', light);
  }

  if ('IntersectionObserver' in window) {
    var slideObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { threshold: 0.55 });

    slides.forEach(function (s) { slideObserver.observe(s); });
  }

  setActive('hero');

  /* ---------- бриф ---------- */

  var form = document.querySelector('.brief__form');
  var status = form.querySelector('.form__status');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = form.elements.name.value.trim();
    var contact = form.elements.contact.value.trim();

    if (!name || !contact) {
      status.textContent = 'Заполните имя и контакт — иначе не сможем ответить.';
      return;
    }

    status.textContent = 'Бриф отправлен. Ответим в течение рабочего дня, ' + name + '.';
    form.reset();
  });
})();
