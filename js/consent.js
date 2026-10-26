/* Wontex · consentimiento de cookies y analítica
   Hoy el sitio NO usa cookies ni analítica. Este archivo solo actúa si en
   js/config.js se escribe un ID de Google Analytics 4 (ga4Id). En ese caso:
   - muestra un aviso con Aceptar, Rechazar y Configurar (mismo peso visual);
   - carga Google Analytics SOLO si el visitante acepta (nada de terceros antes);
   - guarda la elección en este navegador ("fw-consent") como simple preferencia, durante
     12 meses como máximo; luego se vuelve a preguntar;
   - permite cambiarla o retirarla desde "Preferencias de cookies" en el pie de todas las páginas.
   Al activarla, agrega en _headers los dominios de Google Analytics a script-src y connect-src. */
(function () {
  'use strict';

  var CFG = window.FW_CONFIG || {};
  var id = String(CFG.ga4Id || '').trim();
  if (!/^G-[A-Z0-9]{4,}$/.test(id)) return;   // sin ID válido: no hay analítica ni aviso

  var KEY = 'fw-consent';
  var T = function (s) { return window.FW_T ? window.FW_T(s) : s; };
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000;   // 12 meses
  var read = function () {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || 'null');
      return c && (c.v === 'granted' || c.v === 'denied') && Date.now() - c.t < MAX_AGE ? c.v : null;
    } catch (e) { return null; }
  };
  var save = function (v) { try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) { /* sin almacenamiento */ } };
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

  var banner = null, opener = null;
  function showBanner() {
    if (banner) { banner.hidden = false; banner.querySelector('button').focus(); return; }
    banner = document.createElement('div');
    banner.className = 'consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', T('Preferencias de cookies'));
    banner.innerHTML =
      '<p>' + T('Usamos cookies de analítica para entender cómo se usa el sitio y mejorarlo. Solo se activan si las aceptas.') +
      ' <a href="/cookies">' + T('Más información') + '</a></p>' +
      '<div class="consent__cfg" hidden><label><input type="checkbox" name="analitica"> ' +
      T('Cookies de analítica (Google Analytics)') + '</label></div>' +
      '<div class="consent__btns">' +
      '<button type="button" class="consent__btn" data-v="denied">' + T('Rechazar') + '</button>' +
      '<button type="button" class="consent__btn" data-cfg>' + T('Configurar') + '</button>' +
      '<button type="button" class="consent__btn" data-v="granted">' + T('Aceptar') + '</button>' +
      '</div>';
    var cfg = banner.querySelector('.consent__cfg'), box = cfg.querySelector('input'), cfgBtn = banner.querySelector('[data-cfg]');
    function decide(v) {
      save(v);
      banner.hidden = true;
      if (v === 'granted') loadAnalytics();
      // Si retira el consentimiento después de aceptarlo, se recarga para dejar de medir
      else if (loaded) location.reload();
      if (opener) opener.focus();
    }
    banner.addEventListener('click', function (e) {
      if (e.target.closest('[data-cfg]')) {
        // Configurar: muestra la opción; un segundo clic guarda lo elegido
        if (cfg.hidden) { cfg.hidden = false; box.checked = read() === 'granted'; cfgBtn.textContent = T('Guardar'); box.focus(); }
        else decide(box.checked ? 'granted' : 'denied');
        return;
      }
      var b = e.target.closest('[data-v]');
      if (b) decide(b.getAttribute('data-v'));
    });
    banner.addEventListener('keydown', function (e) { if (e.key === 'Escape' && read()) { banner.hidden = true; if (opener) opener.focus(); } });
    document.body.appendChild(banner);
  }

  // Enlace del pie para cambiar la elección (oculto mientras no haya analítica)
  document.querySelectorAll('[data-consent-open]').forEach(function (el) {
    el.hidden = false;
    el.addEventListener('click', function (e) { e.preventDefault(); opener = el; showBanner(); });
  });

  var choice = read();
  if (choice === 'granted') loadAnalytics();
  else if (choice !== 'denied') showBanner();
})();
