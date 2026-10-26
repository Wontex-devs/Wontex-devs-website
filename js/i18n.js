/* Wontex · idioma de los textos que genera el código (mensajes del formulario, demostraciones, botón flotante).
   Cada idioma tiene su propia página estática: / en español y /en/ en inglés (la genera
   _herramientas/preparar-dominio.py con el diccionario de js/i18n-en.js). Aquí no se traduce la página:
   solo se ofrece FW_T() para que el código use el idioma de la página en la que está. */
(function () {
  'use strict';

  var EN = window.FW_EN || {};
  var lang = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2) === 'en' ? 'en' : 'es';
  var norm = function (t) { return t.replace(/\s+/g, ' ').trim(); };

  function translate(es) {
    if (lang !== 'en') return es;
    var key = norm(es);
    if (!key || !EN[key]) return es;
    // conserva los espacios del original alrededor del texto
    var lead = es.match(/^\s*/)[0], trail = es.match(/\s*$/)[0];
    return lead + EN[key] + trail;
  }

  window.FW_T = translate;
  window.FW_LANG = function () { return lang; };
})();
