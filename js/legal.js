/* Wontex · páginas legales y 404: año actual en el pie (archivo propio para cumplir la CSP sin scripts en línea). */
document.querySelectorAll('.year').forEach(function (e) { e.textContent = new Date().getFullYear(); });
