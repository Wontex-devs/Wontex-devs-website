"""Wontex · páginas de servicios (las genera preparar-dominio.py; no se editan a mano).

Cada página usa la misma cabecera, pie y estilos de la página principal, con contenido propio:
qué resuelve, qué incluye, beneficios, ejemplos de aplicación, cómo trabajamos y llamada a la acción.
Sin testimonios, clientes, cifras ni promesas que no se puedan verificar.
"""
import html
import json
import re

AREA = [{"@type": "City", "name": "Barranquilla"}, {"@type": "Country", "name": "Colombia"}]

PASOS = [
    ("Entendemos tu negocio", "Identificamos tus necesidades, los retos de tu operación y las oportunidades de mejora."),
    ("Diseñamos la solución", "Definimos el enfoque, las herramientas y el alcance adecuados para tus objetivos."),
    ("Implementamos y conectamos", "Construimos, configuramos y probamos cada solución para integrarla en tu operación."),
    ("Evolucionamos contigo", "Te acompañamos en la adopción y ajustamos las soluciones a medida que tu negocio crece."),
]

SERVICIOS = [
    {
        "slug": "desarrollo-web",
        "nav": "Desarrollo web",
        "title": "Desarrollo de páginas web para empresas | Wontex",
        "desc": "Diseñamos y desarrollamos páginas web profesionales, rápidas y adaptadas a celulares, con SEO desde el inicio, para empresas de Barranquilla y toda Colombia.",
        "h1": "Desarrollo de páginas web para empresas",
        "tipo": "Desarrollo de páginas web",
        "lead": "Creamos sitios web profesionales, rápidos y adaptados a cualquier pantalla, pensados para que tus clientes te encuentren, entiendan lo que ofreces y te contacten.",
        "problemas": [
            "Tu negocio no aparece cuando los clientes te buscan en Google.",
            "Tu sitio actual se ve desactualizado, carga lento o no funciona bien en el celular.",
            "Las visitas llegan, pero no te escriben ni te piden una cotización.",
            "Actualizar tu página depende de otra persona y toma demasiado tiempo.",
        ],
        "incluye": [
            ("Sitio web corporativo", "Presenta tu empresa, tus servicios y tus canales de contacto con una imagen profesional y coherente con tu marca."),
            ("Landing pages", "Páginas enfocadas en un solo objetivo: una campaña, un servicio o la captura de solicitudes."),
            ("Catálogo y portafolio web", "Muestra productos o proyectos de forma ordenada, con fotos, descripciones y una forma clara de pedir información."),
            ("Rediseño de sitio web", "Actualizamos tu sitio actual para que sea más claro, más rápido y más fácil de usar."),
            ("Posicionamiento en buscadores (SEO)", "Estructura, textos, velocidad y configuración técnica para que Google entienda tu sitio y pueda mostrarlo en búsquedas relevantes."),
            ("Formularios y conexión con WhatsApp", "Canales de contacto que llegan a tu correo, a tu WhatsApp o a tu CRM, sin solicitudes perdidas."),
        ],
        "beneficios": [
            "Se ve bien en celulares, tabletas y computadores.",
            "Carga rápida y buenas prácticas de seguridad.",
            "Configuración para buscadores desde el primer día.",
            "Contenido claro sobre lo que haces y para quién.",
            "Solicitudes que llegan organizadas a tus canales de contacto.",
        ],
        "ejemplos": [
            "Un consultorio que recibe solicitudes de cita desde su sitio web.",
            "Una empresa industrial que muestra su portafolio y recibe solicitudes de cotización.",
            "Un hotel que presenta sus habitaciones y servicios por ciudad.",
        ],
        "cta": "¿Necesitas una página web para tu empresa?",
        "interes": "Sitios web",
    },
    {
        "slug": "automatizacion-e-inteligencia-artificial",
        "nav": "Automatización e IA",
        "title": "Automatización de procesos e IA para empresas | Wontex",
        "desc": "Automatizamos tareas repetitivas y procesos administrativos y comerciales, e integramos chatbots y asistentes de inteligencia artificial en tu empresa.",
        "h1": "Automatización de procesos e inteligencia artificial para empresas",
        "tipo": "Automatización de procesos empresariales e inteligencia artificial",
        "lead": "Conectamos tus herramientas y automatizamos las tareas repetitivas para que tu equipo dedique su tiempo a lo que importa. Integramos inteligencia artificial donde aporta valor: atención, organización y respuesta.",
        "problemas": [
            "Tu equipo pierde horas copiando datos entre correos, hojas de cálculo y otras herramientas.",
            "Los mensajes de clientes se acumulan y algunos se responden tarde o nunca.",
            "Las mismas preguntas se responden una y otra vez a mano.",
            "Los procesos dependen de que alguien recuerde hacer cada paso.",
        ],
        "incluye": [
            ("Automatización de flujos de trabajo", "Tareas que se ejecutan solas cuando ocurre algo: un formulario nuevo, un pago, un mensaje o una fecha."),
            ("Automatización de procesos administrativos", "Registro de datos, envío de documentos, recordatorios y reportes sin hacerlos a mano."),
            ("Automatización de WhatsApp", "Respuestas automáticas, captura de datos y asignación de conversaciones a tu equipo."),
            ("Chatbots para preguntas frecuentes", "Atención inmediata a las dudas más comunes, en tu sitio web o en WhatsApp, con paso a una persona cuando hace falta."),
            ("Asistentes y agentes de inteligencia artificial", "Asistentes que ayudan a tu equipo a redactar, clasificar solicitudes, resumir información o consultar documentos internos."),
            ("Integración de herramientas", "Conectamos las plataformas que ya usas para que la información pase de una a otra sin doble digitación."),
        ],
        "beneficios": [
            "Menos tareas repetitivas y menos errores al copiar información.",
            "Respuestas más rápidas a tus clientes.",
            "Procesos que se cumplen igual todos los días.",
            "Información organizada en un solo lugar.",
            "Definimos contigo qué automatizar y qué debe seguir en manos de tu equipo.",
        ],
        "ejemplos": [
            "Un pedido por WhatsApp que se registra solo y llega organizado a la operación.",
            "Un formulario web que crea el contacto, envía una respuesta y avisa al vendedor.",
            "Un asistente que responde preguntas frecuentes sobre horarios, precios y servicios.",
        ],
        "cta": "¿Qué tarea te gustaría dejar de hacer a mano?",
        "interes": "Automatización",
    },
    {
        "slug": "crm",
        "nav": "CRM",
        "title": "Implementación de CRM y automatización comercial | Wontex",
        "desc": "Implementamos y configuramos tu CRM con automatización comercial: seguimiento de clientes potenciales, WhatsApp, agenda, recordatorios y reportes.",
        "h1": "Implementación de CRM y automatización comercial",
        "tipo": "Implementación de CRM y automatización comercial",
        "lead": "Organizamos tus clientes, conversaciones y oportunidades en un solo lugar, con seguimientos automáticos para que ninguna venta se quede en el camino.",
        "problemas": [
            "Los clientes potenciales llegan por WhatsApp, Instagram y correo, y nadie sabe en qué va cada uno.",
            "Se olvidan seguimientos y las oportunidades se enfrían.",
            "Las citas se agendan a mano y algunos clientes no llegan.",
            "No sabes de dónde vienen tus clientes ni cuántas ventas tienes en proceso.",
        ],
        "incluye": [
            ("Bandeja única de conversaciones", "WhatsApp, Instagram, Facebook, correo y SMS en un solo lugar, con el historial de cada cliente."),
            ("Embudo de ventas visual", "Cada oportunidad en su etapa, del primer contacto al cierre, para saber qué sigue con cada cliente."),
            ("Agenda en línea con recordatorios", "Tus clientes eligen día y hora, y reciben confirmación y recordatorios automáticos."),
            ("Seguimientos automáticos", "Mensajes y tareas programadas para que ningún cliente potencial se enfríe."),
            ("Campañas de correo y SMS", "Comunicaciones a tu base de clientes, segmentadas según su interés o su etapa."),
            ("Reseñas y reportes", "Solicitud automática de reseñas a clientes satisfechos y reportes de ventas, citas y origen de tus clientes."),
        ],
        "beneficios": [
            "Toda la información comercial en un solo lugar.",
            "Seguimiento ordenado de cada cliente potencial.",
            "Menos citas perdidas gracias a los recordatorios.",
            "Visibilidad de tus ventas para tomar decisiones.",
            "Configuración, capacitación y ajustes según cómo vende tu equipo.",
        ],
        "ejemplos": [
            "Una clínica que recibe solicitudes por WhatsApp, agenda citas en línea y envía recordatorios automáticos.",
            "Una distribuidora que sigue cada cotización desde el primer contacto hasta el cierre.",
            "Un negocio de servicios que pide reseñas a sus clientes después de cada atención.",
        ],
        "cta": "¿Quieres ordenar tus ventas y tus seguimientos?",
        "interes": "CRM y gestión comercial",
    },
    {
        "slug": "herramientas-digitales",
        "nav": "Herramientas digitales",
        "title": "Herramientas digitales y cotizadores para empresas | Wontex",
        "desc": "Creamos cotizadores digitales, formularios inteligentes, dashboards, herramientas internas e integraciones adaptadas a cómo funciona tu empresa.",
        "h1": "Herramientas digitales a la medida para empresas",
        "tipo": "Herramientas digitales empresariales",
        "lead": "Creamos herramientas digitales para organizar información, cotizar, analizar y gestionar procesos, adaptadas a cómo funciona tu negocio.",
        "problemas": [
            "Las cotizaciones se arman a mano en hojas de cálculo y cada una toma demasiado tiempo.",
            "La información está repartida entre archivos, correos y cuadernos.",
            "No tienes una vista clara de tus números para tomar decisiones.",
            "Tus herramientas no se comunican entre sí.",
        ],
        "incluye": [
            ("Cotizadores digitales", "Cálculo automático de precios e impuestos, consecutivos y propuestas en PDF con tu marca."),
            ("Formularios inteligentes", "Formularios que validan la información y la envían al lugar correcto, completa y ordenada."),
            ("Dashboards y reportes", "Los indicadores clave de tu operación en una sola pantalla."),
            ("Herramientas internas", "Aplicaciones sencillas para tareas específicas de tu equipo."),
            ("Integraciones entre plataformas", "Conectamos tus herramientas para evitar la doble digitación."),
        ],
        "beneficios": [
            "Procesos más rápidos y con menos errores.",
            "Información ordenada y fácil de consultar.",
            "Propuestas con una imagen profesional y coherente.",
            "Herramientas pensadas para tu forma de trabajar, no al revés.",
        ],
        "ejemplos": [
            "Una empresa industrial que genera cotizaciones en PDF con totales e IVA calculados.",
            "Un equipo comercial que consulta sus ventas del mes en un tablero.",
            "Un formulario de solicitud que llega organizado y sin datos incompletos.",
        ],
        "cta": "¿Qué herramienta haría más fácil tu trabajo?",
        "interes": "Herramientas de negocio",
    },
]

e = lambda t: html.escape(t, quote=False)


def _chrome(index_html):
    """Cabecera, menú móvil y pie de la página principal, con enlaces que apuntan a la portada."""
    a = index_html.index('<a class="skip"')
    b = index_html.index('<main')
    head = index_html[a:b]
    c = index_html.index('<footer')
    d = index_html.index('</div></div>', index_html.index('<div class="legal-bar">')) + len('</div></div>')
    foot = index_html[c:d]
    fix = lambda t: re.sub(r'href="#(?!main")', 'href="/#', t)
    head, foot = fix(head), fix(foot)
    head = head.replace('<header class="header is-over" id="header">', '<header class="header" id="header">')
    head = head.replace('href="/#top" aria-label="Wontex, inicio"', 'href="/" aria-label="Wontex, inicio"')
    head = re.sub(r'<a href="/en/" hreflang="en" lang="en">EN</a>', '<a href="/en/" hreflang="en" lang="en">EN</a>', head)
    foot = foot.replace('<a href="/#top" class="link-plain">Volver arriba ↑</a>', '<a href="#main" class="link-plain">Volver arriba ↑</a>')
    return head, foot


def _versions(index_html):
    v = dict(re.findall(r'(css/[a-z]+\.css|js/[a-z-]+\.js)\?v=([0-9a-z]+)', index_html))
    return lambda f: '/%s?v=%s' % (f, v.get(f, '1'))


def build(site, index_html):
    head_chrome, foot_chrome = _chrome(index_html)
    ver = _versions(index_html)
    pages = {}
    for sv in SERVICIOS:
        url = '%s/%s/' % (site, sv['slug'])
        otros = [o for o in SERVICIOS if o is not sv]
        ld = {"@context": "https://schema.org", "@graph": [
            {"@type": "Service", "@id": url + "#servicio", "name": sv['h1'], "serviceType": sv['tipo'],
             "description": sv['desc'], "url": url, "areaServed": AREA, "availableLanguage": ["es", "en"],
             "provider": {"@type": "ProfessionalService", "@id": site + "/#organizacion", "name": "Wontex", "url": site + "/"}},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Inicio", "item": site + "/"},
                {"@type": "ListItem", "position": 2, "name": sv['nav'], "item": url}]}]}
        incluye = '\n'.join('        <li class="svc-card"><h3>%s</h3><p>%s</p></li>' % (e(t), e(p)) for t, p in sv['incluye'])
        problemas = '\n'.join('        <li>%s</li>' % e(p) for p in sv['problemas'])
        beneficios = '\n'.join('        <li>%s</li>' % e(p) for p in sv['beneficios'])
        ejemplos = '\n'.join('        <li>%s</li>' % e(p) for p in sv['ejemplos'])
        pasos = '\n'.join('      <li data-reveal><h3>%s</h3><p>%s</p></li>' % (e(t), e(p)) for t, p in PASOS)
        rel = '\n'.join('        <li><a href="/%s/">%s <span aria-hidden="true">→</span></a></li>' % (o['slug'], e(o['h1'])) for o in otros)
        pages['%s/index.html' % sv['slug']] = f'''<!doctype html>
<html lang="es-419">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{e(sv['title'])}</title>
  <meta name="description" content="{html.escape(sv['desc'])}">
  <meta name="theme-color" content="#142B3B">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="{url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Wontex">
  <meta property="og:title" content="{html.escape(sv['title'])}">
  <meta property="og:description" content="{html.escape(sv['desc'])}">
  <meta property="og:url" content="{url}">
  <meta property="og:locale" content="es_LA">
  <meta property="og:image" content="{site}/assets/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{html.escape(sv['title'])}">
  <meta name="twitter:description" content="{html.escape(sv['desc'])}">
  <meta name="twitter:image" content="{site}/assets/og-image.jpg">
  <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preload" href="/assets/fonts/unbounded-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="{ver('css/fonts.css')}">
  <link rel="stylesheet" href="{ver('css/styles.css')}">
  <link rel="stylesheet" href="{ver('css/site.css')}">
  <script src="{ver('js/head.js')}"></script>
</head>
<body class="svc-page">
{head_chrome}
<main id="main">

<!-- Página generada por _herramientas/servicios.py: no editar a mano -->
<section class="svc-hero">
  <div class="container">
    <nav class="svc-crumbs" aria-label="Ruta de navegación"><a href="/">Inicio</a><span aria-hidden="true">/</span><a href="/#soluciones">Servicios</a><span aria-hidden="true">/</span><span aria-current="page">{e(sv['nav'])}</span></nav>
    <h1 class="svc-hero__title">{e(sv['h1'])}</h1>
    <p class="svc-hero__lead">{e(sv['lead'])}</p>
    <p class="svc-hero__area">Atendemos empresas en Barranquilla y en toda Colombia.</p>
    <div class="svc-hero__ctas">
      <a class="btn btn--pill" href="/#contacto"><span>Solicita tu cotización</span><span class="arr" aria-hidden="true">→</span></a>
      <a class="xh__link" href="#incluye">Qué incluye</a>
    </div>
  </div>
</section>

<section class="xs svc-sec">
  <div class="container svc-split">
    <header><p class="xs__label">Lo que resolvemos</p><h2 class="xs__title">Problemas que te ayudamos a resolver.</h2></header>
    <ul class="svc-list svc-list--x">
{problemas}
    </ul>
  </div>
</section>

<section class="xs svc-sec svc-sec--alt" id="incluye">
  <div class="container">
    <header class="xs__head"><p class="xs__label">Qué incluye</p><h2 class="xs__title">Soluciones que ofrece Wontex.</h2></header>
    <ul class="svc-grid">
{incluye}
    </ul>
  </div>
</section>

<section class="xs svc-sec">
  <div class="container svc-two">
    <div><p class="xs__label">Beneficios</p><h2 class="xs__title">Lo que gana tu negocio.</h2>
      <ul class="svc-list svc-list--ok">
{beneficios}
      </ul>
    </div>
    <div><p class="xs__label">Ejemplos de aplicación</p><h2 class="xs__title">Cómo se ve en la práctica.</h2>
      <ul class="svc-list svc-list--ex">
{ejemplos}
      </ul>
      <p class="svc-note">Ejemplos ilustrativos de lo que podemos construir.</p>
    </div>
  </div>
</section>

<section class="xs xs--process svc-sec--alt" id="proceso">
  <div class="container">
    <header class="xs__head"><p class="xs__label">Cómo trabajamos</p><h2 class="xs__title">De la idea a la solución.</h2></header>
    <ol class="steps2" id="steps2">
{pasos}
    </ol>
  </div>
</section>

<section class="svc-cta">
  <div class="container">
    <h2 class="svc-cta__title">{e(sv['cta'])}</h2>
    <p>Cuéntanos tu reto y te proponemos una solución. También puedes escribirnos a <a href="mailto:info@wontex-devs.com">info@wontex-devs.com</a>.</p>
    <a class="btn btn--pill" href="/#contacto"><span>Hablemos de tu negocio</span><span class="arr" aria-hidden="true">→</span></a>
  </div>
</section>

<section class="xs svc-sec svc-rel">
  <div class="container">
    <h2 class="xs__label svc-rel__h">Otros servicios</h2>
    <ul class="svc-rel__list">
{rel}
    </ul>
  </div>
</section>

</main>
{foot_chrome}

<script src="{ver('js/config.js')}" defer></script>
<script src="{ver('js/i18n.js')}" defer></script>
<script src="{ver('js/main.js')}" defer></script>
<script src="{ver('js/consent.js')}" defer></script>
</body>
</html>
'''
    return pages
