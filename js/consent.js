/* Zentrik · consentimiento de cookies y analítica
   Hoy el sitio NO usa cookies ni analítica. Este archivo solo actúa si en
   js/config.js se escribe un ID de Google Analytics 4 (ga4Id). En ese caso:
   - muestra un aviso para aceptar o rechazar la analítica;
   - carga Google Analytics SOLO si el visitante acepta;
   - guarda la elección en este navegador ("fw-consent") y permite cambiarla
     desde el enlace "Preferencias de cookies" del pie de página. */
(function () {
  'use strict';

  var CFG = window.FW_CONFIG || {};
  var id = String(CFG.ga4Id || '').trim();
  if (!/^G-[A-Z0-9]{4,}$/.test(id)) return;   // sin ID válido: no hay analítica ni aviso

  var KEY = 'fw-consent';
  var T = function (s) { return window.FW_T ? window.FW_T(s) : s; };
  var read = function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  var save = function (v) { try { localStorage.setItem(KEY, v); } catch (e) { /* sin almacenamiento */ } };
  var loaded = false;

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
  }

  var banner = null;
  function showBanner() {
    if (banner) { banner.hidden = false; banner.querySelector('button').focus(); return; }
    banner = document.createElement('div');
    banner.className = 'consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', T('Preferencias de cookies'));
    banner.innerHTML =
      '<p>' + T('Usamos cookies de analítica para entender cómo se usa el sitio y mejorarlo. Solo se activan si las aceptas.') +
      ' <a href="cookies.html">' + T('Más información') + '</a></p>' +
      '<div class="consent__btns">' +
      '<button type="button" class="consent__btn" data-v="denied">' + T('Rechazar') + '</button>' +
      '<button type="button" class="consent__btn consent__btn--ok" data-v="granted">' + T('Aceptar') + '</button>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-v]');
      if (!b) return;
      var v = b.getAttribute('data-v');
      save(v);
      banner.hidden = true;
      if (v === 'granted') loadAnalytics();
      // Si retira el consentimiento después de aceptarlo, se recarga para dejar de medir
      else if (loaded) location.reload();
    });
    document.body.appendChild(banner);
  }

  // Enlace del pie para cambiar la elección (oculto mientras no haya analítica)
  document.querySelectorAll('[data-consent-open]').forEach(function (el) {
    el.hidden = false;
    el.addEventListener('click', function (e) { e.preventDefault(); showBanner(); });
  });

  var choice = read();
  if (choice === 'granted') loadAnalytics();
  else if (choice !== 'denied') showBanner();
})();
