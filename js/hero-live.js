/* Wontex · hero interactivo para computadores (con mouse).
   Dibuja en vivo la misma animación del video del inicio (fragmentos de interfaz conectados a un sistema
   central W_) y hace que el W_ siga al cursor con suavidad; las conexiones se estiran con él y los paneles
   se mueven en sentido contrario según su profundidad.
   Solo se activa con mouse, pantallas de 900 px o más y sin "reducir movimiento"; en celulares y tabletas
   se mantiene el video. Si se activa, el video no se descarga (main.js lo respeta con FW_LIVE_HERO). */
(function () {
  'use strict';

  var media = document.querySelector('.xh__media');
  var video = document.getElementById('heroVideo');
  if (!media || !video || !window.matchMedia) return;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduce || window.innerWidth < 900 || !document.createElement('canvas').getContext) return;
  window.FW_LIVE_HERO = true;

  var C = document.createElement('canvas');
  C.className = 'xh__video xh__live';
  C.setAttribute('aria-hidden', 'true');
  var X = C.getContext('2d');
  media.insertBefore(C, video);
  media.classList.add('is-live');
  try { video.pause(); video.removeAttribute('autoplay'); video.preload = 'none'; } catch (e) { /* sin video */ }

  // ---------- Escena (coordenadas lógicas 1280 × 720, como el video) ----------
  var W = 1280, H = 720, CX = W / 2 + 200, CY = H / 2, TAU = Math.PI * 2;
  var LIME = '199,244,100', CLOUD = '247,248,244', STEEL = '163,175,183';
  var P = [
    { x: -440, y: -165, w: 230, h: 118, z: 0.72, t: 'chat',   ph: 0.00 },
    { x: -470, y: 128,  w: 206, h: 150, z: 1.02, t: 'crm',    ph: 0.18 },
    { x: -205, y: -252, w: 176, h: 84,  z: 1.24, t: 'toggle', ph: 0.37 },
    { x: 290,  y: -200, w: 244, h: 140, z: 1.14, t: 'chart',  ph: 0.55 },
    { x: 320,  y: 150,  w: 214, h: 132, z: 0.76, t: 'quote',  ph: 0.71 },
    { x: 150,  y: 248,  w: 204, h: 102, z: 1.30, t: 'form',   ph: 0.86 },
    { x: -118, y: 244,  w: 164, h: 92,  z: 0.62, t: 'cal',    ph: 0.29 }
  ];
  var frac = function (v) { return v - Math.floor(v); };
  var smooth = function (a, b, v) { var k = Math.min(1, Math.max(0, (v - a) / (b - a))); return k * k * (3 - 2 * k); };
  function rr(x, y, w, h, r) { X.beginPath(); if (X.roundRect) X.roundRect(x, y, w, h, r); else X.rect(x, y, w, h); }
  function bar(x, y, w, h, a, col) { rr(x, y, w, h, h / 2); X.fillStyle = 'rgba(' + (col || CLOUD) + ',' + a + ')'; X.fill(); }

  function content(p, x, y, w, h, done) {
    var pad = 14, ix = x + pad, iy = y + pad, iw = w - pad * 2, k;
    bar(ix, iy, iw * 0.34, 6, 0.28);
    var top = iy + 18;
    if (p.t === 'chat') {
      rr(ix, top, iw * 0.66, 26, 9); X.fillStyle = 'rgba(' + CLOUD + ',.12)'; X.fill();
      rr(ix + iw * 0.3, top + 34, iw * 0.7, 26, 9); X.fillStyle = 'rgba(' + LIME + ',' + (0.16 + 0.34 * done) + ')'; X.fill();
      bar(ix + 10, top + 10, iw * 0.4, 5, 0.32); bar(ix + iw * 0.3 + 10, top + 44, iw * 0.42, 5, 0.42 + 0.3 * done, done > 0.4 ? '20,43,59' : CLOUD);
    } else if (p.t === 'crm') {
      for (k = 0; k < 3; k++) {
        var ry = top + k * 34; rr(ix, ry, 22, 22, 6); X.fillStyle = 'rgba(' + CLOUD + ',.14)'; X.fill();
        bar(ix + 32, ry + 3, iw * 0.42, 5, 0.3); bar(ix + 32, ry + 13, iw * 0.28, 4, 0.16);
        bar(ix + iw - 42, ry + 5, 42, 12, k === 0 ? 0.25 + 0.55 * done : 0.12, k === 0 ? LIME : CLOUD);
      }
    } else if (p.t === 'toggle') {
      bar(ix, top + 8, iw * 0.46, 6, 0.24);
      rr(ix + iw - 50, top, 50, 26, 13); X.fillStyle = 'rgba(' + (done > 0.2 ? LIME : CLOUD) + ',' + (0.14 + 0.6 * done) + ')'; X.fill();
      rr(ix + iw - 50 + 4 + 24 * done, top + 4, 18, 18, 9); X.fillStyle = 'rgba(' + CLOUD + ',.85)'; X.fill();
    } else if (p.t === 'chart') {
      for (k = 0; k < 4; k++) { X.fillStyle = 'rgba(' + STEEL + ',.08)'; X.fillRect(ix, top + 8 + k * 22, iw, 1); }
      var pts = [0.82, 0.7, 0.74, 0.55, 0.5, 0.36, 0.22];
      X.beginPath();
      pts.forEach(function (v, i) { var px = ix + i * iw / (pts.length - 1), py = top + 4 + v * 82; if (i) X.lineTo(px, py); else X.moveTo(px, py); });
      X.strokeStyle = 'rgba(' + LIME + ',' + (0.45 + 0.5 * done) + ')'; X.lineWidth = 2.2; X.lineJoin = 'round'; X.stroke();
    } else if (p.t === 'quote') {
      for (k = 0; k < 3; k++) { bar(ix, top + k * 20, iw * 0.46, 5, 0.22); bar(ix + iw * 0.7, top + k * 20, iw * 0.3, 5, 0.3); }
      X.fillStyle = 'rgba(' + STEEL + ',.18)'; X.fillRect(ix, top + 60, iw, 1);
      bar(ix, top + 70, iw * 0.3, 7, 0.4); bar(ix + iw * 0.55, top + 69, iw * 0.45, 9, 0.3 + 0.55 * done, done > 0.3 ? LIME : CLOUD);
    } else if (p.t === 'form') {
      rr(ix, top, iw, 20, 6); X.strokeStyle = 'rgba(' + STEEL + ',.3)'; X.lineWidth = 1; X.stroke();
      rr(ix, top + 28, iw * 0.62, 20, 6); X.stroke();
      rr(ix + iw - 66, top + 28, 66, 20, 10); X.fillStyle = 'rgba(' + LIME + ',' + (0.3 + 0.6 * done) + ')'; X.fill();
    } else if (p.t === 'cal') {
      for (var r = 0; r < 3; r++) for (k = 0; k < 6; k++) {
        var on = r === 1 && k === 3; rr(ix + k * (iw / 6), top + r * 16, iw / 6 - 4, 11, 3);
        X.fillStyle = on ? 'rgba(' + LIME + ',' + (0.3 + 0.6 * done) + ')' : 'rgba(' + CLOUD + ',.08)'; X.fill();
      }
    }
  }

  // Halo lima del W_ dibujado una sola vez (shadowBlur en cada cuadro es muy costoso)
  var halo = document.createElement('canvas');
  halo.width = halo.height = 344;
  (function (h) {
    h.shadowColor = 'rgba(' + LIME + ',.5)'; h.shadowBlur = 60;
    h.beginPath(); if (h.roundRect) h.roundRect(100, 100, 144, 144, 30); else h.rect(100, 100, 144, 144);
    h.fillStyle = '#142B3B'; h.fill();
  })(halo.getContext('2d'));

  // ---------- Lienzo ajustado como el video (cubre la pantalla, centrado) ----------
  var S = 1, OX = 0, OY = 0, dpr = 1, quality = 1;
  function resize() {
    var cw = C.clientWidth || window.innerWidth, ch = C.clientHeight || window.innerHeight;
    // Fondo suave: se dibuja a ~1 px por píxel CSS y como máximo 1600 px de ancho (antes hasta 2600 × 1625 por cuadro)
    dpr = Math.min(window.devicePixelRatio || 1, 1.25, 1600 / cw) * quality;
    C.width = Math.round(cw * dpr); C.height = Math.round(ch * dpr);
    S = Math.max(C.width / W, C.height / H);
    OX = (C.width - W * S) / 2; OY = (C.height - H * S) / 2;
  }

  // ---------- Cursor: el W_ se acerca a él con suavidad (posición en coordenadas de la escena) ----------
  var target = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, mouse = null;
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    var r = C.getBoundingClientRect();
    mouse = { x: ((e.clientX - r.left) * dpr - OX) / S, y: ((e.clientY - r.top) * dpr - OY) / S };
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', function () { mouse = null; });

  function scene(t) {
    var camX = 24 * Math.sin(TAU * t), camY = 12 * Math.sin(TAU * 2 * t + 0.6), zoom = 1 + 0.03 * Math.sin(TAU * t + 1);
    var baseX = CX + camX * 0.9, baseY = CY + camY * 0.9;
    // a dónde quiere ir el W_: hacia el cursor, con un límite para no invadir el texto
    if (mouse) {
      target.x = Math.max(-170, Math.min(150, (mouse.x - baseX) * 0.32));
      target.y = Math.max(-110, Math.min(110, (mouse.y - baseY) * 0.32));
    } else { target.x = 0; target.y = 0; }
    var mx = cur.x / 150, my = cur.y / 110;        // -1…1 para el paralaje de los paneles

    X.setTransform(1, 0, 0, 1, 0, 0);
    X.fillStyle = '#0D1F2C'; X.fillRect(0, 0, C.width, C.height);
    X.setTransform(S, 0, 0, S, OX, OY);
    var hx = baseX + cur.x, hy = baseY + cur.y;
    var g = X.createRadialGradient(hx * 0.6 + CX * 0.4, CY, 40, hx, hy, 760);
    g.addColorStop(0, 'rgba(28,58,79,.95)'); g.addColorStop(1, 'rgba(13,31,44,0)');
    X.fillStyle = g; X.fillRect(-W, -H, W * 3, H * 3);
    // retícula muy tenue
    X.strokeStyle = 'rgba(' + STEEL + ',.045)'; X.lineWidth = 1;
    var ox = (camX * 0.3 - mx * 6) % 80, oy = (camY * 0.3 - my * 6) % 80, gx0 = -OX / S - 80, gx1 = (C.width - OX) / S + 80, gy0 = -OY / S - 80, gy1 = (C.height - OY) / S + 80;
    for (var x = Math.floor(gx0 / 80) * 80 + ox; x < gx1; x += 80) { X.beginPath(); X.moveTo(x, gy0); X.lineTo(x, gy1); X.stroke(); }
    for (var y = Math.floor(gy0 / 80) * 80 + oy; y < gy1; y += 80) { X.beginPath(); X.moveTo(gx0, y); X.lineTo(gx1, y); X.stroke(); }

    var pos = P.map(function (p, i) {
      var px = CX + p.x * zoom + camX * p.z * 1.4 + 10 * p.z * Math.sin(TAU * (t + p.ph)) - mx * 22 * p.z;
      var py = CY + p.y * zoom + camY * p.z * 1.4 + 8 * p.z * Math.cos(TAU * (t + p.ph)) - my * 14 * p.z;
      var u = frac(2 * t + i / P.length);
      var done = smooth(0.86, 0.98, u) * (1 - smooth(0.98, 1, u)) + (u < 0.35 ? 1 - smooth(0, 0.35, u) : 0);
      return { p: p, px: px, py: py, u: u, done: done };
    });
    // conexiones y pulsos hacia el W_ (siguen su posición)
    var flash = 0;
    pos.forEach(function (o) {
      var px = o.px, py = o.py, u = o.u;
      var c1x = px + (hx - px) * 0.55, c2x = px + (hx - px) * 0.45;
      X.beginPath(); X.moveTo(px, py); X.bezierCurveTo(c1x, py, c2x, hy, hx, hy);
      X.strokeStyle = 'rgba(' + STEEL + ',' + (0.08 + 0.1 * o.p.z) + ')'; X.lineWidth = 1.2; X.stroke();
      var B = function (s) { var m = 1 - s; return [m * m * m * px + 3 * m * m * s * c1x + 3 * m * s * s * c2x + s * s * s * hx, m * m * m * py + 3 * m * m * s * py + 3 * m * s * s * hy + s * s * s * hy]; };
      if (u < 0.92) {
        var a = Math.max(0, u - 0.1), steps = 14; X.beginPath();
        for (var k = 0; k <= steps; k++) { var b = B(a + (u - a) * k / steps); if (k) X.lineTo(b[0], b[1]); else X.moveTo(b[0], b[1]); }
        X.strokeStyle = 'rgba(' + LIME + ',' + (0.75 * smooth(0, 0.08, u)) + ')'; X.lineWidth = 2.6; X.lineCap = 'round'; X.stroke();
      }
      flash = Math.max(flash, smooth(0.86, 0.92, u) * (1 - smooth(0.92, 1, u)));
    });
    // fragmentos de interfaz (lejanos primero, con desenfoque de profundidad)
    pos.slice().sort(function (a, b) { return a.p.z - b.p.z; }).forEach(function (o) {
      var p = o.p, s = 0.82 + 0.22 * p.z, w = p.w * s, h = p.h * s, x = o.px - w / 2, y = o.py - h / 2;
      // La profundidad se marca con transparencia (el filtro blur por cuadro era lo más costoso del dibujo)
      X.save(); X.globalAlpha = p.z < 0.9 ? 0.32 + 0.4 * p.z : 0.55 + 0.4 * Math.min(1, p.z);
      rr(x, y, w, h, 14); X.fillStyle = 'rgba(' + CLOUD + ',' + (0.045 + 0.02 * p.z) + ')'; X.fill();
      X.strokeStyle = o.done > 0.05 ? 'rgba(' + LIME + ',' + (0.2 + 0.45 * o.done) + ')' : 'rgba(' + STEEL + ',.2)'; X.lineWidth = 1.2; X.stroke();
      content(p, x, y, w, h, o.done);
      X.restore();
    });
    // sistema central W_ (brilla más mientras se mueve con el cursor)
    var move = Math.min(1, Math.hypot(target.x - cur.x, target.y - cur.y) / 60);
    var glow = Math.max(flash, 0.35 * move);
    X.save(); X.globalAlpha = 0.3 + 0.7 * glow; X.drawImage(halo, hx - 172, hy - 172, 344, 344); X.restore();
    rr(hx - 72, hy - 72, 144, 144, 30); X.fillStyle = '#142B3B'; X.fill();
    rr(hx - 72, hy - 72, 144, 144, 30); X.strokeStyle = 'rgba(' + LIME + ',' + (0.3 + 0.5 * glow) + ')'; X.lineWidth = 1.5; X.stroke();
    X.font = '700 56px Unbounded'; X.fillStyle = 'rgba(247,248,244,.95)'; X.textBaseline = 'alphabetic';
    var mw = X.measureText('W').width, total = mw + 0.62 * 56, tx = hx - total / 2, base = hy + 20;
    X.fillText('W', tx, base); X.fillStyle = 'rgba(' + LIME + ',1)'; X.fillRect(tx + mw + 5.6, base - 8.4, 29, 7.3);
    // viñeta
    X.setTransform(1, 0, 0, 1, 0, 0);
    g = X.createRadialGradient(C.width * 0.62, C.height / 2, C.height * 0.25, C.width * 0.62, C.height / 2, C.width * 0.62);
    g.addColorStop(0, 'rgba(4,10,16,0)'); g.addColorStop(1, 'rgba(4,10,16,.5)');
    X.fillStyle = g; X.fillRect(0, 0, C.width, C.height);
  }

  // ---------- Bucle: solo mientras el hero está en pantalla y la pestaña visible ----------
  var SECONDS = 12, raf = 0, visible = true, last = 0, avg = 16.7, tuned = 0;
  function frame(now) {
    var dt = last ? Math.min(64, now - last) : 16.7; last = now;
    // Equipos lentos: si el promedio pasa de ~22 ms por cuadro, se dibuja a menor resolución (hasta 2 veces)
    avg = avg * 0.95 + dt * 0.05;
    if (avg > 22 && quality > 0.6 && now - tuned > 1500) { quality -= 0.2; tuned = now; avg = 16.7; resize(); }
    var f = 1 - Math.pow(0.9, dt / 16.7);         // seguimiento suave del cursor
    cur.x += (target.x - cur.x) * f; cur.y += (target.y - cur.y) * f;
    scene(frac(now / 1000 / SECONDS));
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!raf && visible && document.visibilityState === 'visible') { last = 0; raf = requestAnimationFrame(frame); } }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  resize();
  window.addEventListener('resize', resize);
  var xh = document.querySelector('.xh');
  if ('IntersectionObserver' in window && xh) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); else stop(); }).observe(xh);
  }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') start(); else stop(); });
  var go = function () { start(); };
  if (document.fonts && document.fonts.load) document.fonts.load('700 56px Unbounded').then(go, go); else go();
})();
