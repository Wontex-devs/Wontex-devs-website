/* Wontex · se ejecuta en el <head>, antes de pintar la página (archivo propio para cumplir la CSP sin scripts en línea). */
// Activa la animación de entrada del logo (se omite si el visitante prefiere menos movimiento)
// Al recargar, empezar siempre desde arriba (sin restaurar scroll ni saltar a #secciones)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
(function (d) {
  d.classList.add('js');
  // La animación completa se ve una vez por visita; al navegar o recargar, la página abre directo
  var seen = false; try { seen = sessionStorage.getItem('fw-intro') === '1'; sessionStorage.setItem('fw-intro', '1'); } catch (e) {}
  if (!seen && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) d.classList.add('intro-playing');
})(document.documentElement);
