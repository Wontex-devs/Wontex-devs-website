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
          setTimeout(endIntro, 1650);
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
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') endIntro(); }, { once: true });
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
    ['metodo', 'servicios', 'casos', 'nosotros', 'problema', 'por-que', 'oferta', 'para-quien', 'faq', 'contacto', 'top'].forEach(function (id) {
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
      crm: { dur: 12500, steps: [0, 2900, 6300, 9000], ev: [
        [0, '.sc-chat', 'on'], [300, '.t1', 'on'], [1400, '.t1', 'on', 1], [1400, '.m1', 'on'],
        [2900, '.sc-chat', 'gone'], [2900, '.sc-new', 'on'], [3200, '.f0', 'on'], [3500, '.f1', 'on'], [3800, '.f2', 'on'], [4100, '.f3', 'on'], [4400, '.f4', 'on'], [5000, '.f5', 'on'],
        [6300, '.sc-new', 'gone'], [6300, '.sc-chat', 'gone', 1], [6900, '.m2', 'on'],
        [9000, '.sc-chat', 'gone'], [9000, '.sc-pipe', 'on'], [9400, '.p1', 'on'], [10200, '.p2', 'on']] },
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
      crm: ['Llega un mensaje por WhatsApp', 'El CRM registra el contacto', 'Responde en automático', 'Queda asignado con su seguimiento'],
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
    var cxSection = document.getElementById('casos');
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

  /* ---------- Formulario de contacto ----------
     Se envía a FormSubmit (data-endpoint), que reenvía el mensaje al correo de Wontex.
     Si está vacío, abre el correo del visitante con el mensaje ya redactado. */
  var form = document.getElementById('contactForm');
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
      var consent = form.elements.autorizacion;
      fieldError(consent, consent.checked ? '' : T('Para enviar la solicitud debes autorizar el tratamiento de tus datos.'));
      if (!consent.checked) ok = false;
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
        if (firstBad) firstBad.focus();
        return;
      }

      if (form.elements._honey.value || Date.now() - formLoadedAt < MIN_FILL_MS) { fakeSuccess(); return; }
      var sent = sendLog();
      if (sent.length >= MAX_SENDS) {
        status.textContent = T('Ya recibimos varias solicitudes desde este navegador. Si necesitas algo más, escríbenos a') + ' ' + form.dataset.mailto + '.';
        return;
      }

      var endpoint = form.dataset.endpoint;
      var data = new FormData(form);

      if (!endpoint) {
        var body = 'Idioma: ' + (window.FW_LANG ? window.FW_LANG() : 'es') + '\nNombre: ' + data.get('nombre') + '\nCorreo: ' + data.get('email') +
          '\nEmpresa: ' + (data.get('empresa') || '-') +
          '\nMe interesa: ' + (data.getAll('interes').join(', ') || '-') + '\n\n' + data.get('mensaje');
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
