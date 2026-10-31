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
        "title": "Diseño de páginas web para empresas | Wontex",
        "desc": "Diseñamos y desarrollamos páginas web profesionales para empresas: rápidas, adaptadas a celulares y con SEO desde el inicio. En Barranquilla, toda Colombia y el exterior.",
        "h1": "Diseño y desarrollo de páginas web para empresas",
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
        "faq": [('¿Cuánto cuesta una página web para mi empresa?', 'Depende del tipo de sitio (una landing page, un sitio corporativo o un catálogo), de la cantidad de secciones y de las funciones que necesites. Primero conocemos tu negocio y después te enviamos una cotización con el alcance definido.'), ('¿Cuánto tiempo toma tener mi página lista?', 'Depende del alcance y de qué tan listos estén los textos y las fotos. En la propuesta te indicamos las etapas y los tiempos estimados para que sepas qué esperar desde el inicio.'), ('¿La página web incluye SEO?', 'Sí. Cada sitio se entrega con la configuración para buscadores: estructura de títulos, textos y descripciones, velocidad de carga, versión para celulares y mapa del sitio para Google.'), ('¿Mi página se verá bien en el celular?', 'Sí. Diseñamos cada sitio para celulares, tabletas y computadores, porque la mayoría de tus clientes te va a visitar desde el teléfono.'), ('¿Pueden rediseñar la página web que ya tengo?', 'Sí. Revisamos tu sitio actual y lo actualizamos para que sea más claro, más rápido y más fácil de usar, sin perder lo que ya funciona.'), ('¿Cómo me llegan los mensajes de los clientes?', 'Los formularios y botones de contacto pueden llegar a tu correo, a tu WhatsApp o a tu CRM, según cómo prefieras atender a tus clientes.')],
    },
    {
        "slug": "automatizacion-e-inteligencia-artificial",
        "nav": "Automatización e IA",
        "title": "Automatización de procesos y WhatsApp con IA | Wontex",
        "desc": "Automatizamos procesos, WhatsApp y tareas repetitivas de tu empresa, e integramos chatbots y asistentes de inteligencia artificial que atienden a tus clientes.",
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
        "faq": [('¿Qué procesos de mi empresa se pueden automatizar?', 'Las tareas que siguen siempre los mismos pasos: registrar datos de formularios, responder preguntas frecuentes, enviar recordatorios, documentos o reportes, y pasar información entre herramientas.'), ('¿Se puede automatizar WhatsApp para mi negocio?', 'Sí. Configuramos respuestas automáticas, captura de datos de tus clientes y asignación de conversaciones a tu equipo, para que ningún mensaje se quede sin respuesta.'), ('¿Un chatbot reemplaza a mi equipo de atención?', 'No. El chatbot atiende al instante las dudas más comunes y pasa la conversación a una persona cuando hace falta. Tu equipo se dedica a los casos que de verdad lo necesitan.'), ('¿Qué es un asistente de inteligencia artificial para empresas?', 'Es una herramienta que ayuda a tu equipo a redactar, clasificar solicitudes, resumir información o consultar documentos internos, adaptada a la forma de trabajar de tu empresa.'), ('¿La automatización funciona con las herramientas que ya uso?', 'En la mayoría de los casos, sí. Revisamos las plataformas que ya tienes y las conectamos para que la información pase de una a otra sin doble digitación.')],
    },
    {
        "slug": "crm",
        "nav": "CRM",
        "title": "Implementación de CRM para empresas y pymes | Wontex",
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
        "faq": [('¿Qué es un CRM y para qué sirve?', 'Un CRM es un sistema que reúne en un solo lugar a tus clientes, sus conversaciones y tus oportunidades de venta. Sirve para hacer seguimiento ordenado y que ninguna venta se quede en el camino.'), ('¿Mi negocio necesita un CRM?', 'Si recibes clientes por varios canales, haces cotizaciones o seguimientos, o agendas citas, un CRM te ayuda a tenerlo todo organizado. Si no estás seguro, revisamos tu caso contigo.'), ('¿El CRM se conecta con WhatsApp e Instagram?', 'Sí. La bandeja única reúne WhatsApp, Instagram, Facebook, correo y SMS, con el historial completo de cada cliente.'), ('¿Ustedes configuran el CRM y capacitan a mi equipo?', 'Sí. Configuramos el CRM según cómo vende tu equipo, lo capacitamos para usarlo y hacemos ajustes a medida que lo van usando.'), ('¿Puedo pasar al CRM los contactos que ya tengo?', 'Por lo general, sí: los contactos que tienes en hojas de cálculo o en otras herramientas se pueden importar. Lo revisamos contigo al inicio del proyecto.')],
    },
    {
        "slug": "herramientas-digitales",
        "nav": "Herramientas digitales",
        "title": "Cotizadores digitales y herramientas para empresas | Wontex",
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
        "faq": [('¿Qué es un cotizador digital?', 'Es una herramienta que calcula automáticamente precios, cantidades e impuestos y genera la propuesta en PDF con tu marca, en lugar de armar cada cotización a mano.'), ('¿Las herramientas se adaptan a cómo trabaja mi empresa?', 'Sí. Las diseñamos a la medida, a partir de tus procesos reales, para que la herramienta se ajuste a tu forma de trabajar y no al revés.'), ('¿Puedo ver los indicadores de mi negocio en un solo lugar?', 'Sí. Creamos dashboards y reportes con los números clave de tu operación en una sola pantalla, para tomar decisiones con información actualizada.'), ('¿Se pueden conectar con las plataformas que ya uso?', 'En la mayoría de los casos, sí. Integramos tus herramientas para evitar la doble digitación y que la información esté siempre al día.')],
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
        faq = '\n'.join('      <details class="faq__item" name="faq"><summary class="faq__q">%s</summary><div class="faq__a"><p>%s</p></div></details>' % (e(q), e(a)) for q, a in sv['faq'])
        ld["@graph"].append({"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in sv['faq']]})
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
    <p class="svc-hero__area">Trabajamos con empresas en Barranquilla, en toda Colombia y en el exterior.</p>
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

<section class="xs xs--faq svc-faq" id="preguntas">
  <div class="container faq">
    <header class="xs__head faq__head"><p class="xs__label">Preguntas frecuentes</p><h2 class="xs__title">Lo que suelen preguntarnos.</h2></header>
    <div class="faq__list">
{faq}
    </div>
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
