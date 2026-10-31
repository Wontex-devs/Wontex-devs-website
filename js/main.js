/* Wontex · interacciones del sitio. Sin dependencias. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var T = window.FW_T || function (s) { return s; };
  window.scrollTo(0, 0);

  /* ---------- Entrada del logo: se retira tras la animación (o al hacer clic) ---------- */
  var intro = document.getElementById('intro');
  var root = document.documentElement;
  function endIntro() {
    if (!intro || intro.classList.contains('is-done')) return;
    intro.classList.add('is-done');
    root.classList.remove('intro-playing');
    setTimeout(function () { if (intro) intro.remove(); }, 700);
  }
  if (intro) {
    if (!root.classList.contains('intro-playing')) intro.remove();
    else {
      // Alguien escribe "WIN", se da cuenta, borra hasta la W y escribe bien "WONTEX".
      // Luego aparece la frase y el cursor queda parpadeando un momento antes de abrir la página.
      var introText = document.getElementById('introText');
      var introLive = introText ? introText.parentNode : null;
      var steps = [
        [380, 'W'], [130, 'I'], [150, 'N'],      // error (la I está junto a la O en el teclado)
        [460, '<'], [110, '<'],                   // pausa, se da cuenta y borra
        [260, 'O'], [120, 'N'], [130, 'T'], [110, 'E'], [140, 'X']
      ];
      var k = 0;
      var nextStep = function () {
        if (intro.classList.contains('is-done')) return;
        if (k >= steps.length) {
          introLive.classList.remove('is-typing');
          setTimeout(function () { intro.classList.add('show-tag'); }, 220);
          setTimeout(endIntro, 1250);
          return;
        }
        var st = steps[k++];
        setTimeout(function () {
          introLive.classList.add('is-typing');
          introText.textContent = st[1] === '<' ? introText.textContent.slice(0, -1) : introText.textContent + st[1];
          nextStep();
        }, st[0]);
      };
      if (introText) nextStep(); else setTimeout(endIntro, 1450);
      intro.addEventListener('click', endIntro);
      // Quien ya quiere avanzar no espera: rueda, deslizar o cualquier tecla abren la página
      ['wheel', 'touchmove', 'keydown'].forEach(function (ev) { window.addEventListener(ev, endIntro, { once: true, passive: true }); });
    }
  }

  /* ---------- Header: fondo al hacer scroll, se oculta al bajar y aparece al subir ---------- */
  var header = document.getElementById('header');
  var lastY = window.scrollY;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    var menuOpen = document.body.classList.contains('menu-open');
    if (!menuOpen && y > 320 && y > lastY + 4) header.classList.add('is-hidden');
    else if (y < lastY - 4 || y <= 320) header.classList.remove('is-hidden');
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Menú para celular ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var mobileNav = document.getElementById('mobileNav');

  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('.menu-btn__label').textContent = open ? T('Cerrar') : T('Menú');
    mobileNav.hidden = !open;
    mobileNav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    header.classList.add('is-scrolled');
    if (open) header.classList.remove('is-hidden');
    else onScroll();
  }
  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  mobileNav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', function (mq) {
    if (mq.matches) setMenu(false);
  });

  /* ---------- Aparición al hacer scroll ---------- */
  /* Titulares palabra por palabra: envuelve cada palabra en una máscara */
  window.FW_split = function (el) {
    var i = 0;
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var w = document.createElement('span'); w.className = 'w';
        var inner = document.createElement('span'); inner.className = 'w__in';
        inner.style.setProperty('--wi', i++);
        inner.textContent = part;
        w.appendChild(inner); frag.appendChild(w);
      });
      node.parentNode.replaceChild(frag, node);
    });
  };
  document.querySelectorAll('[data-split]').forEach(window.FW_split);
  /* Listas en cascada: cada elemento entra un poco después del anterior */
  document.querySelectorAll('[data-stagger]').forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (child, i) { child.style.setProperty('--si', i); });
  });

  var revealEls = document.querySelectorAll('[data-reveal], [data-split], [data-stagger]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Navegación: marca la sección activa ---------- */
  var navLinks = document.querySelectorAll('.nav a');
  if ('IntersectionObserver' in window) {
    var sectionIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['top', 'enfoque', 'soluciones', 'aplicada', 'proceso', 'contacto'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionIO.observe(el);
    });
  }

  /* ---------- Parallax suave en fotos grandes ---------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('.parallax'));
  function updateParallax() {
    if (reduceMotion) return;
    var vh = window.innerHeight;
    parallaxEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var progress = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1
      el.style.setProperty('--py', (progress * -60).toFixed(1) + 'px');
    });
  }

  var scrollTicking = false;
  /* Barra de progreso y botón flotante */
  var progressBar = document.getElementById('progressBar');
  var floatCta = document.getElementById('floatCta');
  var heroEl = document.querySelector('.hero');
  var contactEl = document.getElementById('contacto');
  /* Botón flotante: abre WhatsApp solo si js/config.js tiene un número válido
     (formato internacional, solo dígitos). Sin número sigue llevando al formulario,
     así nunca apunta a un enlace inválido. */
  var CFG = window.FW_CONFIG || {};
  var waNumber = String(CFG.whatsapp || '').trim();
  var hasWhatsapp = /^[1-9]\d{7,14}$/.test(waNumber);
  var setFloatCta = function () {
    if (!floatCta) return;
    if (hasWhatsapp) {
      floatCta.href = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(T(CFG.whatsappMessage || 'Hola, quiero información sobre los servicios de Wontex.'));
      floatCta.setAttribute('aria-label', T('Escríbenos por WhatsApp (se abre en otra pestaña)'));
    } else {
      floatCta.setAttribute('aria-label', T('Escríbenos: ir al formulario de contacto'));
    }
  };
  if (floatCta) {
    if (hasWhatsapp) {
      floatCta.target = '_blank';
      floatCta.rel = 'noopener';
      floatCta.classList.add('is-whatsapp');
      floatCta.querySelector('svg').outerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.2-.2-.4-.3Z"/></svg>';
      floatCta.querySelector('span').textContent = T('WhatsApp');
    }
    setFloatCta();
    document.addEventListener('fw:lang', setFloatCta);
  }
  function updateScrollUI() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0) + ')';
    if (floatCta) {
      var pastHero = heroEl ? heroEl.getBoundingClientRect().bottom < 0 : window.scrollY > 600;
      var atContact = contactEl ? contactEl.getBoundingClientRect().top < window.innerHeight * 0.6 : false;
      // Con WhatsApp configurado el botón queda siempre visible; sin número aparece tras el inicio
      floatCta.classList.toggle('is-on', hasWhatsapp || (pastHero && !atContact));
    }
  }

  function onScrollEffects() {
    updateScrollUI();
    updateParallax();
    scrollTicking = false;
  }
  window.addEventListener('scroll', function () {
    if (!scrollTicking) { requestAnimationFrame(onScrollEffects); scrollTicking = true; }
  }, { passive: true });
  window.addEventListener('resize', onScrollEffects);
  onScrollEffects();

  /* ---------- Servicios: el detalle de cada área se abre al hacer clic en su tarjeta ----------
     Empiezan cerrados; al elegir una tarjeta se abre solo esa área, debajo de las tarjetas,
     y la página baja hasta ella. Un segundo clic en la misma tarjeta la cierra. */
  // Cada servicio muestra su descripción solo al hacer clic en el nombre
  document.querySelectorAll('.svc2__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.svc2__item');
      var open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      q.setAttribute('aria-expanded', String(open));
    });
  });
  var svcCards = Array.prototype.slice.call(document.querySelectorAll('.svc2__card'));
  var svcPanels = Array.prototype.slice.call(document.querySelectorAll('.svc2__panel'));
  svcCards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      var panel = document.querySelector(card.getAttribute('href'));
      if (!panel) return;
      e.preventDefault();
      var opening = !panel.classList.contains('is-open');
      svcPanels.forEach(function (p) { p.classList.toggle('is-open', p === panel && opening); });
      svcCards.forEach(function (c) {
        c.classList.toggle('is-featured', c === card && opening);
        c.setAttribute('aria-expanded', String(c === card && opening));
      });
      if (opening) {
        var nav = document.querySelector('.svc2__cards');
        window.scrollTo({ top: nav.getBoundingClientRect().top + window.scrollY - 24, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  });

  /* ---------- Casos a pantalla completa: se desliza a los lados (pestañas, teclado y arrastre) ----------
     Cada celular reproduce un flujo paso a paso. Las escenas (.sc) y piezas (.pop) cambian de clase según
     una línea de tiempo; la etiqueta bajo el celular dice en qué paso va. */
  var cxTrack = document.getElementById('cxTrack');
  if (cxTrack) {
    var cxSlides = Array.prototype.slice.call(cxTrack.querySelectorAll('.cx__slide'));
    var cxTabs = Array.prototype.slice.call(document.querySelectorAll('.cx__tab'));
    var cxIndex = 0, cxVisible = false;

    // [ms, selector, clase, quitar?]  ·  steps: ms en que empieza cada paso
    var FLOWS = {
      // CRM: formulario web → nuevo lead en el CRM → WhatsApp automático → conversación → cita en el embudo
      crm: { dur: 23500, steps: [0, 4700, 8800, 18200], ev: [
        [0, '.cr-web', 'on'], [500, '.w1', 'on'], [1500, '.w2', 'on'], [2500, '.w3', 'on'], [3500, '.w4', 'tap'], [3900, '.w5', 'on'],
        [4700, '.cr-web', 'gone'], [4700, '.cr-crm', 'on'], [5100, '.c1', 'on'], [5800, '.c2', 'on'], [6600, '.c3', 'on'], [7700, '.c3', 'run'],
        [8800, '.cr-crm', 'gone'], [8800, '.cr-chat', 'on'], [9300, '.m1', 'on'],
        [10800, '.t1', 'on'], [12000, '.t1', 'on', 1], [12000, '.m2', 'on'], [13300, '.m3', 'on'],
        [14500, '.t1', 'on'], [15500, '.t1', 'on', 1], [15500, '.m4', 'on'], [16700, '.m5', 'on'],
        [18200, '.cr-chat', 'gone'], [18200, '.cr-pipe', 'on'], [18600, '.p1', 'on'], [19600, '.cr-pipe', 'run'], [20600, '.p3', 'on']] },
      reel: { dur: 12500, steps: [0, 3000, 6500, 8600], ev: [
        [0, '.sc-plan', 'on'], [500, '.k1', 'on'], [900, '.k2', 'on'], [1300, '.k3', 'on'],
        [3000, '.sc-plan', 'gone'], [3000, '.sc-make', 'on'], [3300, '.sc-make', 'run'], [5600, '.g2', 'on'],
        [6500, '.sc-make', 'gone'], [6500, '.sc-post', 'on'], [8600, '.n1', 'on'], [9300, '.n2', 'on'], [10000, '.n3', 'on']] },
      web: { dur: 14500, steps: [0, 2600, 6000, 8500, 11500], ev: [
        [0, '.sc-search', 'on'], [300, '.r1', 'on'], [600, '.r2', 'on'], [1700, '.se-res--top', 'tap'],
        [2600, '.sc-search', 'gone'], [2600, '.sc-site', 'on'], [3100, '.web-scroll', 's1'], [4700, '.web-scroll', 's2'],
        [6000, '.w1', 'on'], [6700, '.w2', 'on'], [7600, '.web-send', 'tap'],
        [8500, '.sc-site', 'gone'], [8500, '.sc-lead', 'on'], [8900, '.l1', 'on'], [9600, '.l2', 'on'],
        [11500, '.sc-lead', 'gone'], [11500, '.sc-brand', 'on']] },
      quote: { dur: 13000, steps: [0, 3000, 6200, 9000], ev: [
        [0, '.sc-q1', 'on'], [300, '.c1', 'on'], [700, '.c2', 'on'], [1100, '.c3', 'on'], [1700, '.c4', 'on'],
        [3000, '.sc-q1', 'gone'], [3000, '.sc-q2', 'on'], [3300, '.i1', 'on'], [3900, '.i2', 'on'], [4600, '.i3', 'on'],
        [6200, '.sc-q2', 'gone'], [6200, '.sc-q3', 'on'], [6500, '.h1', 'on'], [6900, '.h2', 'on'], [7300, '.h3', 'on'], [7700, '.h4', 'on'], [8300, '.sc-q3 .q-btn', 'tap'],
        [9000, '.sc-q3', 'gone'], [9000, '.sc-q4', 'on'], [9800, '.o1', 'on']] }
    };
    var FLOW_STEPS = {
      crm: ['Un cliente llena el formulario de tu web', 'El CRM registra el lead', 'Le escribe por WhatsApp al instante', 'El lead avanza solo en tu embudo'],
      reel: ['Planeamos el contenido', 'Creamos la pieza con IA', 'Se publica en tus redes', 'Llegan reacciones y mensajes'],
      web: ['Un cliente te encuentra en internet', 'Recorre tu sitio desde el celular', 'Te deja sus datos', 'La solicitud te llega al instante', 'Sitio web creado por Wontex'],
      quote: ['Registras el cliente', 'Agregas ítems y el total se calcula', 'Eliges las condiciones', 'La propuesta sale en PDF']
    };
    var FLOW_CLS = ['on', 'gone', 'tap', 'run', 's1', 's2'];
    var flow = null;
    var flowReset = function (ui) {
      ui.querySelectorAll('.' + FLOW_CLS.join(',.')).forEach(function (el) {
        FLOW_CLS.forEach(function (c) { el.classList.remove(c); });
      });
    };
    var flowPill = function (slide, key, s) {
      var pill = slide.querySelector('.cx__step');
      if (!pill) return;
      pill.classList.add('swap');
      setTimeout(function () {
        pill.querySelector('.cx__step-n').textContent = s + 1;
        pill.querySelector('.cx__step-of').textContent = '/' + Math.min(4, FLOW_STEPS[key].length);
        pill.classList.toggle('is-brand', s >= 4);
        pill.querySelector('.cx__step-t').textContent = T(FLOW_STEPS[key][s]);
        pill.classList.remove('swap');
      }, 220);
    };
    var flowStop = function () {
      if (flow) { cancelAnimationFrame(flow.raf); flow = null; }
    };
    var flowStart = function (slide) {
      flowStop();
      var ui = slide.querySelector('.ui[data-flow]');
      if (!ui) return;
      var key = ui.getAttribute('data-flow'), f = FLOWS[key];
      var st = { t0: performance.now(), fired: 0, step: -1, raf: 0 };
      flowReset(ui);
      var frame = function (now) {
        var t = now - st.t0;
        if (t >= f.dur) { flowReset(ui); st.t0 = now; st.fired = 0; t = 0; }
        while (st.fired < f.ev.length && f.ev[st.fired][0] <= t) {
          var e = f.ev[st.fired++];
          ui.querySelectorAll(e[1]).forEach(function (el) { el.classList[e[3] ? 'remove' : 'add'](e[2]); });
        }
        var s = 0;
        for (var k = 0; k < f.steps.length; k++) if (t >= f.steps[k]) s = k;
        if (s !== st.step) { st.step = s; flowPill(slide, key, s); }
        st.raf = requestAnimationFrame(frame);
      };
      st.raf = requestAnimationFrame(frame);
      flow = st;
    };

    var cxSet = function (i) {
      if (i === cxIndex && cxSlides[i].classList.contains('is-active')) return;
      cxIndex = i;
      cxSlides.forEach(function (sl, k) { sl.classList.toggle('is-active', k === i); });
      cxTabs.forEach(function (t, k) { t.classList.toggle('is-on', k === i); t.setAttribute('aria-current', String(k === i)); });
      if (cxVisible) flowStart(cxSlides[i]);
    };
    var cxGo = function (i) {
      i = (i + cxSlides.length) % cxSlides.length;
      cxTrack.scrollTo({ left: i * cxTrack.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
      cxSet(i);
    };
    var cxTick = false;
    cxTrack.addEventListener('scroll', function () {
      if (cxTick) return;
      cxTick = true;
      requestAnimationFrame(function () {
        cxTick = false;
        var i = Math.round(cxTrack.scrollLeft / Math.max(1, cxTrack.clientWidth));
        if (i !== cxIndex) cxSet(Math.max(0, Math.min(cxSlides.length - 1, i)));
      });
    }, { passive: true });
    cxTabs.forEach(function (t, k) { t.addEventListener('click', function () { cxGo(k); }); });
    cxTrack.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); cxGo(cxIndex + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); cxGo(cxIndex - 1); }
    });
    // Arrastre con el mouse (en pantallas táctiles el deslizamiento es nativo)
    var cxDown = false, cxX = 0, cxLeft = 0, cxMoved = false;
    cxTrack.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      cxDown = true; cxMoved = false; cxX = e.clientX; cxLeft = cxTrack.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!cxDown) return;
      var dx = e.clientX - cxX;
      if (!cxMoved && Math.abs(dx) > 6) { cxMoved = true; cxTrack.classList.add('is-dragging'); }
      if (cxMoved) cxTrack.scrollLeft = cxLeft - dx;
    });
    window.addEventListener('pointerup', function (e) {
      if (!cxDown) return;
      cxDown = false;
      if (!cxMoved) return;
      cxTrack.classList.remove('is-dragging');
      var dx = e.clientX - cxX, w = cxTrack.clientWidth;
      var start = Math.round(cxLeft / w);
      cxGo(Math.abs(dx) > w * 0.12 ? start + (dx < 0 ? 1 : -1) : start);
    });
    window.addEventListener('resize', function () { cxTrack.scrollLeft = cxIndex * cxTrack.clientWidth; });

    // El flujo solo corre con la sección en pantalla; al cambiar de idioma vuelve a empezar
    var cxSection = cxTrack.closest('.cx');
    var cxRun = function () { if (cxVisible && !document.hidden) flowStart(cxSlides[cxIndex]); else flowStop(); };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { cxVisible = en[0].isIntersecting; cxRun(); }, { threshold: 0.25 }).observe(cxSection);
    } else { cxVisible = true; cxRun(); }
    document.addEventListener('visibilitychange', cxRun);
    document.addEventListener('fw:lang', cxRun);
  }

  /* ---------- Botones magnéticos: se inclinan suavemente hacia el cursor ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
    document.querySelectorAll('.btn, .circle-btn, .float-cta').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        btn.style.transform = 'translate(' + (x * 10).toFixed(1) + 'px,' + (y * 8).toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- Rediseño · hero audiovisual, enfoque, soluciones y proceso ----------
     Un solo manejador de scroll (con requestAnimationFrame) actualiza:
     - el hero: progreso 0–1 de la sección alta; cada tramo muestra una frase (las demás quedan inertes);
     - la frase de enfoque, que se "rellena" mientras se lee;
     - la línea del proceso.
     El video nunca se reinicia: solo se pausa fuera de pantalla o con movimiento reducido. */
  var clamp01 = function (v) { return Math.min(1, Math.max(0, v)); };
  var xh = document.querySelector('.xh');
  var xhSteps = xh ? Array.prototype.slice.call(xh.querySelectorAll('.xh__step')) : [];
  var xhRail = document.getElementById('heroRail');
  var heroVideo = document.getElementById('heroVideo');
  var headerBar = document.getElementById('header');
  var statementFill = document.querySelector('#statement .fill');
  var steps2 = document.getElementById('steps2');
  var steps2Items = steps2 ? Array.prototype.slice.call(steps2.children) : [];
  var xhCurrent = -1;

  function xhSetStep(k) {
    if (k === xhCurrent) return;
    xhCurrent = k;
    xhSteps.forEach(function (st, i) {
      st.classList.toggle('is-on', i === k);
      st.classList.toggle('is-past', i < k);
      if (i === k) st.removeAttribute('inert'); else st.setAttribute('inert', '');
    });
  }
  // Valores objetivo (según el scroll) y valores mostrados, que los siguen con suavidad.
  // Así la rueda del mouse, que avanza a saltos, se percibe continua sin secuestrar el scroll.
  var story = { hp: 0, sf: 0, pp: 0 }, shown = { hp: 0, sf: 0, pp: 0 }, storyRAF = 0;
  var stepsN = xhSteps.length;

  function storyTarget() {
    var vh = window.innerHeight;
    if (xh) {
      var r = xh.getBoundingClientRect(), total = r.height - vh;
      story.hp = total > 0 ? clamp01(-r.top / total) : 0;
      if (headerBar) headerBar.classList.toggle('is-over', r.bottom > 72);
    }
    if (statementFill) {
      var sr = statementFill.parentNode.getBoundingClientRect();
      story.sf = reduceMotion ? 1 : clamp01((vh * 0.88 - sr.top) / (vh * 0.55));
    }
    if (steps2) {
      var pr = steps2.getBoundingClientRect();
      story.pp = reduceMotion ? 1 : clamp01((vh * 0.82 - pr.top) / (pr.height + vh * 0.25));
    }
  }
  function storyPaint() {
    var p = shown.hp;
    if (xh) {
      xh.style.setProperty('--xp', p.toFixed(4));
      xh.classList.toggle('is-scrolled', story.hp > 0.02);
      if (!reduceMotion && stepsN) {
        // Cada frase ocupa un tramo; dentro de él entra, se sostiene y sale. La primera ya está visible
        // al llegar y la última se queda al final.
        var pos = p * stepsN, best = 0, bestA = -1;
        xhSteps.forEach(function (st, i) {
          var t = pos - i;                       // 0…1 dentro de su tramo
          var a = i === 0 ? 1 : clamp01(t / 0.28);
          var out = i === stepsN - 1 ? 0 : clamp01((t - 0.72) / 0.28);
          a = Math.min(a, 1 - out);
          var y = i === 0 && t < 0.72 ? 0 : (t < 0.5 ? (1 - clamp01(t / 0.28)) : -out);
          st.style.opacity = a.toFixed(3);
          st.style.setProperty('--sy', y.toFixed(3));
          if (a > bestA) { bestA = a; best = i; }
        });
        xhSetStep(best);
      }
    }
    if (statementFill) statementFill.style.setProperty('--fill', (shown.sf * 100).toFixed(1) + '%');
    if (steps2) {
      steps2.style.setProperty('--p', shown.pp.toFixed(3));
      steps2Items.forEach(function (li, i) { li.classList.toggle('is-on', shown.pp > i / steps2Items.length + 0.04 || shown.pp > 0.995); });
    }
  }
  var storyLast = 0;
  function storyLoop(now) {
    // Suavizado por tiempo (no por cuadro): igual en pantallas de 60 y 120 Hz; ~95 % del recorrido en 0,33 s
    var dt = storyLast ? Math.min(64, now - storyLast) : 16.7;
    storyLast = now;
    var f = reduceMotion ? 1 : 1 - Math.pow(0.86, dt / 16.7);
    var moving = false;
    ['hp', 'sf', 'pp'].forEach(function (k) {
      var d = story[k] - shown[k];
      if (Math.abs(d) > 0.0004) { shown[k] += d * f; moving = true; } else shown[k] = story[k];
    });
    storyPaint();
    if (moving) storyRAF = requestAnimationFrame(storyLoop); else { storyRAF = 0; storyLast = 0; }
  }
  function storyUpdate() {
    storyTarget();
    if (!storyRAF) storyRAF = requestAnimationFrame(storyLoop);
  }
  window.addEventListener('scroll', storyUpdate, { passive: true });
  window.addEventListener('resize', storyUpdate);
  storyTarget();
  shown.hp = story.hp; shown.sf = story.sf; shown.pp = story.pp;
  storyPaint();

  if (heroVideo) {
    // Con mouse, hero-live.js dibuja la animación en vivo y el video no se usa (ni se descarga)
    if (reduceMotion || window.FW_LIVE_HERO) { heroVideo.pause(); heroVideo.removeAttribute('autoplay'); }
    else {
      var heroPlay = function () { var pl = heroVideo.play(); if (pl && pl.catch) pl.catch(function () { /* el navegador no permite autoplay: queda la imagen fija */ }); };
      if ('IntersectionObserver' in window && xh) {
        new IntersectionObserver(function (en) { if (en[0].isIntersecting) heroPlay(); else heroVideo.pause(); }).observe(xh);
      } else heroPlay();
      // Al volver a la pestaña, retoma el video si el hero sigue en pantalla
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible' && xh && xh.getBoundingClientRect().bottom > 0) heroPlay();
      });
    }
  }

  /* CRM · experiencia del cliente: animación automática en bucle (no interactiva), 5 escenas de 4 s */
  document.querySelectorAll('[data-journey]').forEach(function (box) {
    var steps = Array.prototype.slice.call(box.querySelectorAll('.cj-steps li'));
    var setStep = function (k) { steps.forEach(function (li, i) { li.classList.toggle('is-on', i === k); }); };
    var all = function (sel) { return Array.prototype.slice.call(box.querySelectorAll(sel)); };
    if (reduceMotion) {   // imagen fija: la agenda con el día y la hora elegidos
      all('.cj-s3, .cj-day, .cj-slot').forEach(function (el) { el.classList.add('on'); });
      setStep(2);
      return;
    }
    var EV = [
      [0, '.cj-s1', 'on'], [300, '.cj-a1', 'on'], [900, '.cj-typed', 'on'], [2300, '.cj-send', 'tap'], [2500, '.cj-typed', 'gone'], [2500, '.cj-s1 .cj-bub--out', 'on'],
      [4000, '.cj-s1', 'gone'], [4000, '.cj-s2', 'on'], [4400, '.cj-b1', 'on'], [5800, '.cj-link', 'tap'],
      [8000, '.cj-s2', 'gone'], [8000, '.cj-s3', 'on'], [8800, '.cj-day', 'on'], [9600, '.cj-slot', 'on'], [10600, '.cj-btn', 'tap'],
      [12000, '.cj-s3', 'gone'], [12000, '.cj-s4', 'on'], [12400, '.cj-d1', 'on'], [14000, '.cj-d2', 'on'],
      [16000, '.cj-s4', 'gone'], [16000, '.cj-s5', 'on'], [16300, '.cj-e1', 'on'], [16900, '.cj-e2', 'on'], [17100, '.cj-e3', 'on'],
      [17300, '.cj-e4', 'on'], [17500, '.cj-e5', 'on'], [17700, '.cj-e6', 'on'], [18200, '.cj-e7', 'on'], [18800, '.cj-e8', 'on']
    ];
    var DUR = 20000, t0 = 0, fired = 0, raf = 0, step = -1;
    var reset = function () { all('.on, .gone, .tap').forEach(function (el) { el.classList.remove('on', 'gone', 'tap'); }); fired = 0; step = -1; };
    var frame = function (now) {
      if (!t0) t0 = now;
      var t = now - t0;
      if (t >= DUR) { reset(); t0 = now; t = 0; }
      while (fired < EV.length && EV[fired][0] <= t) {
        var e = EV[fired++];
        all(e[1]).forEach(function (el) {
          if (e[2] === 'gone') el.classList.remove('on');
          el.classList.add(e[2]);
          if (e[2] === 'tap') setTimeout(function () { el.classList.remove('tap'); }, 260);
        });
      }
      var k = Math.min(4, Math.floor(t / 4000));
      if (k !== step) { step = k; setStep(k); }
      raf = requestAnimationFrame(frame);
    };
    var run = function (on) {
      if (on && !raf) { reset(); t0 = 0; raf = requestAnimationFrame(frame); }
      else if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
    };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { run(en[0].isIntersecting); }, { threshold: 0.2 }).observe(box);
    else run(true);
  });

  /* Soluciones: "Conocer más" despliega el detalle del servicio */
  document.querySelectorAll('.sol__more').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var det = document.getElementById(btn.getAttribute('aria-controls'));
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      if (!det) return;
      clearTimeout(det._fwT);
      if (open) {
        det.hidden = false;
        void det.offsetHeight;                   // fija el estado cerrado antes de animar la apertura
        det.classList.add('is-open');
      } else {
        det.classList.remove('is-open');
        // Se oculta (para lectores de pantalla y teclado) cuando termina de cerrarse
        det._fwT = setTimeout(function () { if (btn.getAttribute('aria-expanded') !== 'true') det.hidden = true; }, reduceMotion ? 0 : 520);
      }
    });
  });
  /* "Cotizar …" deja marcado ese servicio en el formulario */
  document.querySelectorAll('[data-interest]').forEach(function (a) {
    a.addEventListener('click', function () {
      var v = a.getAttribute('data-interest');
      document.querySelectorAll('#contactForm input[name="interes"]').forEach(function (cb) { if (cb.value === v) cb.checked = true; });
    });
  });

  /* ---------- Formulario de contacto ----------
     Se envía a FormSubmit (data-endpoint), que reenvía el mensaje al correo de Wontex.
     Si está vacío, abre el correo del visitante con el mensaje ya redactado. */
  var form = document.getElementById('contactForm');
  var LEGAL_VERSION = '2026-10-31';   // cámbiala cuando se actualicen el Aviso legal o la Política de privacidad
  if (form) {
    var status = document.getElementById('formStatus');

    function fieldError(input, msg) {
      var field = input.closest('.field');
      var err = field.querySelector('.err');
      field.classList.toggle('is-invalid', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg) {
        if (!err) {
          err = document.createElement('span');
          err.className = 'err';
          err.id = input.id + '-err';
          field.appendChild(err);
          input.setAttribute('aria-describedby', err.id);
        }
        err.textContent = msg;
      } else if (err) {
        err.remove();
        input.removeAttribute('aria-describedby');
      }
    }

    function validate() {
      var ok = true;
      var name = form.elements.nombre, email = form.elements.email, msg = form.elements.mensaje;
      fieldError(name, name.value.trim() ? '' : T('Escribe tu nombre.'));
      if (!name.value.trim()) ok = false;
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      fieldError(email, emailOk ? '' : T('Revisa el correo: parece incompleto.'));
      if (!emailOk) ok = false;
      fieldError(msg, msg.value.trim() ? '' : T('Cuéntanos brevemente qué te gustaría mejorar.'));
      if (!msg.value.trim()) ok = false;
      // Más de dos enlaces en el mensaje suele ser spam
      if (msg.value.trim() && (msg.value.match(/https?:\/\/|www\./gi) || []).length > 2) {
        fieldError(msg, T('Por seguridad, el mensaje no puede incluir más de dos enlaces.'));
        ok = false;
      }
      // Casillas obligatorias y separadas (ninguna viene marcada): autorización de datos, aviso legal y privacidad
      [['autorizacion', 'Para enviar la solicitud debes autorizar el tratamiento de tus datos.'],
       ['acepta_aviso_legal', 'Para enviar la solicitud debes aceptar el Aviso legal.'],
       ['leyo_privacidad', 'Para enviar la solicitud debes confirmar que leíste la Política de privacidad.']].forEach(function (c) {
        var box = form.elements[c[0]];
        if (!box) return;
        fieldError(box, box.checked ? '' : T(c[1]));
        if (!box.checked) ok = false;
      });
      return ok;
    }

    /* Antispam sin servicios externos: campo trampa invisible, tiempo mínimo de llenado
       y máximo de envíos por sesión. A un robot se le responde como si todo saliera bien. */
    var formLoadedAt = Date.now();
    var MIN_FILL_MS = 3000, MAX_SENDS = 3, WINDOW_MS = 10 * 60 * 1000;
    var sendLog = function () {
      try { return JSON.parse(sessionStorage.getItem('fw-sends') || '[]').filter(function (t) { return Date.now() - t < WINDOW_MS; }); }
      catch (e) { return []; }
    };
    var fakeSuccess = function () {
      form.reset();
      status.className = 'form__status is-ok';
      status.textContent = T('Gracias. Recibimos tu mensaje y te escribiremos pronto.');
    };

    form.addEventListener('input', function (e) {
      if (e.target.closest('.field.is-invalid')) validate();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form__status';
      status.textContent = '';
      if (!validate()) {
        var firstBad = form.querySelector('[aria-invalid="true"]');
        status.textContent = T('Revisa los campos marcados.');
        if (firstBad) firstBad.focus();
        return;
      }

      if (form.elements._honey.value || Date.now() - formLoadedAt < MIN_FILL_MS) { fakeSuccess(); return; }
      var sent = sendLog();
      if (sent.length >= MAX_SENDS) {
        status.textContent = T('Ya recibimos varias solicitudes desde este navegador. Si necesitas algo más, escríbenos a') + ' ' + form.dataset.mailto + '.';
        return;
      }

      // Constancia de aceptación que viaja con el mensaje (Ley 527 de 1999: mensaje de datos):
      // formulario, fecha y hora de Colombia (-05:00), versión de los documentos aceptados y página de envío.
      var co = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString().slice(0, 19) + '-05:00';
      form.elements.constancia.value = 'Formulario: contacto web · Fecha y hora: ' + co +
        ' · Aceptó: autorización de tratamiento de datos, Aviso legal y Política de privacidad (versión ' + LEGAL_VERSION + ')' +
        ' · Página: ' + location.origin + location.pathname + ' · Idioma: ' + (window.FW_LANG ? window.FW_LANG() : 'es');

      var endpoint = form.dataset.endpoint;
      var data = new FormData(form);

      if (!endpoint) {
        var body = 'Idioma: ' + (window.FW_LANG ? window.FW_LANG() : 'es') + '\nNombre: ' + data.get('nombre') + '\nCorreo: ' + data.get('email') +
          '\nEmpresa: ' + (data.get('empresa') || '-') +
          '\nMe interesa: ' + (data.getAll('interes').join(', ') || '-') + '\n\n' + data.get('mensaje') +
          '\n\n' + data.get('constancia');
        window.location.href = 'mailto:' + form.dataset.mailto +
          '?subject=' + encodeURIComponent('Diagnóstico · ' + data.get('nombre')) +
          '&body=' + encodeURIComponent(body);
        status.textContent = T('Se abrió tu correo con el mensaje listo. Si no se abrió, escríbenos a') + ' ' + form.dataset.mailto + '.';
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      status.textContent = T('Enviando…');
      fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          return res.json().catch(function () { return {}; });
        })
        .then(function (d) {
          // FormSubmit responde success "false" si el envío no se aceptó (por ejemplo, antes de activar el correo)
          if (d && String(d.success) === 'false') throw new Error(d.message || 'rechazado');
          sent.push(Date.now());
          try { sessionStorage.setItem('fw-sends', JSON.stringify(sent)); } catch (e) { /* sin almacenamiento */ }
          form.reset();
          status.className = 'form__status is-ok';
          status.textContent = T('Gracias. Recibimos tu mensaje y te escribiremos pronto.');
        })
        .catch(function () {
          status.textContent = T('No se pudo enviar. Inténtalo de nuevo o escríbenos a') + ' ' + form.dataset.mailto + '.';
        })
        .finally(function () { btn.disabled = false; });
    });
  }

  /* ---------- Titular del inicio: tamaño ajustado para que cada línea quepa sin partirse ---------- */
  var heroTitle = document.querySelector('.hero__title');
  var wideMQ = window.matchMedia('(min-width: 901px)');
  function fitHeroTitle() {
    if (!heroTitle) return;
    if (!wideMQ.matches) { heroTitle.style.fontSize = ''; return; }
    heroTitle.style.fontSize = '100px';
    var avail = heroTitle.getBoundingClientRect().width;
    var widest = 0;
    heroTitle.querySelectorAll('.line > span').forEach(function (s) { widest = Math.max(widest, s.getBoundingClientRect().width); });
    if (widest > 0) heroTitle.style.fontSize = Math.max(40, Math.min(112, Math.floor(100 * avail / widest) - 1)) + 'px';
  }
  fitHeroTitle();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHeroTitle);
  window.addEventListener('resize', fitHeroTitle);
  document.addEventListener('fw:lang', fitHeroTitle);

  /* ---------- Computador del inicio: "arranque" de Wontex ----------
     Reposo con el logo → se escriben líneas de terminal → del centro sale una red que
     conecta los servicios → mensaje final → la red se recoge y vuelve al reposo.
     Se repite solo; al pasar el cursor arranca de inmediato. */
  var boot = document.getElementById('boot');
  if (boot) {
    var bootLines = Array.prototype.slice.call(boot.querySelectorAll('.boot__l'));
    var bootReady = boot.querySelector('.boot__ready');
    var bootMotions = Array.prototype.slice.call(boot.querySelectorAll('animateMotion'));
    var bootT = [], bootBusy = false, bootVisible = false;
    var bAt = function (ms, fn) { bootT.push(setTimeout(fn, ms)); };
    function typeInto(el, txt, ms) {
      var i = 0; el.textContent = '';
      el.classList.add('is-typing');
      (function tick() {
        el.textContent = txt.slice(0, ++i);
        if (i < txt.length) bootT.push(setTimeout(tick, ms));
        else el.classList.remove('is-typing');
      })();
    }
    function bootReset() {
      bootT.forEach(clearTimeout); bootT = [];
      boot.className = 'boot';
      bootLines.forEach(function (l) { l.textContent = ''; l.classList.remove('is-typing'); });
      bootReady.textContent = '';
      bootBusy = false;
    }
    function bootRun() {
      if (bootBusy) return;
      bootReset(); bootBusy = true;
      var t = 0, CH = 22;
      bAt(t, function () { boot.classList.add('is-term'); });
      bootLines.forEach(function (l) {
        var txt = T(l.dataset.t);
        (function (start, txt) { bAt(start, function () { typeInto(l, '> ' + txt, CH); }); })(t + 250, txt);
        t += 250 + (txt.length + 2) * CH;
      });
      bAt(t + 300, function () { boot.classList.add('is-hub'); });
      bAt(t + 700, function () { boot.classList.add('is-net'); });
      bAt(t + 1700, function () {
        boot.classList.add('is-live');
        bootMotions.forEach(function (m, i) { try { m.beginElement(); } catch (e) {} });
        typeInto(bootReady, '> ' + T(bootReady.dataset.t), 18);
      });
      bAt(t + 5600, function () { boot.classList.add('is-out'); });
      bAt(t + 6600, function () { bootReset(); bAt(2600, function () { if (bootVisible) bootRun(); }); });
    }
    if (reduceMotion) {
      boot.classList.add('is-term', 'is-hub', 'is-net', 'is-live');
      bootLines.forEach(function (l) { l.textContent = '> ' + T(l.dataset.t); });
      bootReady.textContent = '> ' + T(bootReady.dataset.t);
    } else {
      var startBoot = function () { if (!bootBusy && bootVisible) bootRun(); };
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (en) {
          bootVisible = en[0].isIntersecting;
          if (bootVisible) setTimeout(startBoot, document.documentElement.classList.contains('intro-playing') ? 1600 : 600);
          else bootReset();
        }, { threshold: .3 }).observe(boot);
      } else { bootVisible = true; startBoot(); }
      boot.closest('.mac').addEventListener('mouseenter', startBoot);
    }
  }

  /* ---------- Al cambiar de idioma: actualizar textos generados por el código ---------- */
  document.addEventListener('fw:lang', function () {
    var label = document.querySelector('.menu-btn__label');
    if (label) label.textContent = document.body.classList.contains('menu-open') ? T('Cerrar') : T('Menú');
    document.querySelectorAll('.field .err').forEach(function (e) { e.remove(); });
    document.querySelectorAll('.field.is-invalid').forEach(function (f) { f.classList.remove('is-invalid'); });
    var st = document.getElementById('formStatus'); if (st) st.textContent = '';
  });

  /* ---------- Año del footer ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
