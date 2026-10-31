#!/usr/bin/env python3
"""Wontex · SEO del sitio y página en inglés.

Uso (desde la carpeta web/), cada vez que cambies index.html, las páginas legales o el diccionario:
    python3 _herramientas/preparar-dominio.py https://wontex-devs.com

Qué hace (se puede ejecutar las veces que quieras; siempre deja el mismo resultado):
  1. index.html (español, la página principal): URL canónica, hreflang (es, en, x-default), Open Graph,
     Twitter Card y datos estructurados (ProfessionalService + WebSite) dentro del bloque DOMINIO.
  2. Páginas legales: URL canónica sin .html, BreadcrumbList y meta robots. Mientras una página tenga
     textos "[PENDIENTE", queda en "noindex, follow" y fuera del sitemap.
  2b. Páginas de servicios (/desarrollo-web/, /automatizacion-e-inteligencia-artificial/, /crm/,
     /herramientas-digitales/) desde _herramientas/servicios.py, con su SEO y datos estructurados (Service).
  3. en/index.html: la misma página traducida con el diccionario de js/i18n-en.js (textos, atributos
     accesibles, título y descripciones), con sus propias canónica y hreflang. No se edita a mano.
  4. sitemap.xml (solo páginas indexables, con sus alternativas de idioma) y robots.txt.
  5. siteUrl en js/config.js.
Los datos de negocio reales (teléfono, dirección, horario, redes) se toman de _herramientas/datos-negocio.json;
los campos vacíos no se publican. No usa internet ni instala nada.
"""
import datetime
import hashlib
import html
import json
import os
import re
import sys

WEB = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEGAL = ["aviso-legal.html", "privacidad.html", "cookies.html"]
BLOCK = re.compile(r"(<!-- DOMINIO:INICIO.*?-->)(.*?)(\s*<!-- DOMINIO:FIN -->)", re.S)
ROBOTS_ON = "index, follow, max-image-preview:large"
ROBOTS_OFF = "noindex, follow"

TEXT = {
    "es": {
        "description": "Desarrollo de páginas web con SEO, automatización de procesos empresariales, inteligencia "
                       "artificial (chatbots y asistentes), implementación de CRM y herramientas digitales para "
                       "emprendedores y pequeñas y medianas empresas de Barranquilla y toda Colombia.",
        "knowsAbout": ["Desarrollo de páginas web", "Posicionamiento en buscadores (SEO)", "Automatización de procesos empresariales",
                       "Inteligencia artificial para empresas", "Chatbots y asistentes virtuales", "Implementación de CRM",
                       "Automatización comercial", "Cotizadores digitales", "Dashboards e integraciones"],
        "slogan": "Soluciones inteligentes. Resultados reales.",
        "home": "Inicio",
    },
    "en": {
        "description": "Website development with SEO, business process automation, artificial intelligence "
                       "(chatbots and assistants), CRM implementation and digital tools for entrepreneurs and small "
                       "and medium-sized businesses in Barranquilla and across Colombia.",
        "knowsAbout": ["Website development", "Search engine optimization (SEO)", "Business process automation",
                       "Artificial intelligence for business", "Chatbots and virtual assistants", "CRM implementation",
                       "Sales automation", "Digital quoting tools", "Dashboards and integrations"],
        "slogan": "Smart solutions. Real results.",
        "home": "Home",
    },
}


def fail(msg):
    print("Error: " + msg)
    sys.exit(1)


def read(name):
    with open(os.path.join(WEB, name), encoding="utf-8") as f:
        return f.read()


def write(name, text):
    path = os.path.join(WEB, name)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def business_data():
    path = os.path.join(WEB, "_herramientas", "datos-negocio.json")
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def clean_url(site, page):
    return site + "/" + ("" if page == "index.html" else page[:-5])


def ld(obj):
    return '  <script type="application/ld+json">%s</script>' % json.dumps(obj, ensure_ascii=False)


def org_graph(site, d, lang):
    t = TEXT[lang]
    org = {
        "@type": "ProfessionalService",
        "@id": site + "/#organizacion",
        "name": "Wontex",
        "url": site + "/",
        "logo": site + "/assets/icon-512.png",
        "image": site + "/assets/og-image.jpg",
        "description": t["description"],
        "slogan": t["slogan"],
        "email": "info@wontex-devs.com",
        "knowsAbout": t["knowsAbout"],
        "knowsLanguage": ["es", "en"],
        "areaServed": [{"@type": "City", "name": "Barranquilla"}, {"@type": "Country", "name": "Colombia"}],
    }
    if d.get("nombreLegal"):
        org["legalName"] = d["nombreLegal"]
    if d.get("telefono"):
        org["telephone"] = d["telefono"]
    addr = {k: v for k, v in {
        "streetAddress": d.get("direccion"), "addressLocality": d.get("ciudad"),
        "addressRegion": d.get("departamento"), "postalCode": d.get("codigoPostal"),
    }.items() if v}
    if addr:
        addr["@type"] = "PostalAddress"
        addr["addressCountry"] = d.get("pais") or "CO"
        org["address"] = addr
    if d.get("horario"):
        org["openingHours"] = d["horario"]
    if d.get("redesSociales"):
        org["sameAs"] = d["redesSociales"]   # solo redes oficiales que existan
    site_node = {"@type": "WebSite", "@id": site + "/#sitio", "url": site + "/", "name": "Wontex",
                 "inLanguage": ["es", "en"], "publisher": {"@id": site + "/#organizacion"}}
    return {"@context": "https://schema.org", "@graph": [org, site_node]}


FAQ_ITEM = re.compile(r'<details class="faq__item"[^>]*>\s*<summary[^>]*>(.*?)</summary>\s*<div class="faq__a">(.*?)</div>', re.S)


def faq_graph(page_html):
    # Preguntas frecuentes: se leen de la sección #preguntas para que Google vea exactamente el texto visible
    text = lambda h: html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", h))).strip()
    items = [{"@type": "Question", "name": text(q), "acceptedAnswer": {"@type": "Answer", "text": text(a)}}
             for q, a in FAQ_ITEM.findall(page_html)]
    return {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": items} if items else None


def home_lines(site, d, lang, page_html=""):
    url = site + ("/en/" if lang == "en" else "/")
    faq = faq_graph(page_html)
    return [
        '  <meta name="robots" content="%s">' % ROBOTS_ON,
        '  <link rel="canonical" href="%s">' % url,
        '  <link rel="alternate" hreflang="es" href="%s/">' % site,
        '  <link rel="alternate" hreflang="en" href="%s/en/">' % site,
        '  <link rel="alternate" hreflang="x-default" href="%s/">' % site,
        '  <meta property="og:url" content="%s">' % url,
        '  <meta property="og:image" content="%s/assets/og-image.jpg">' % site,
        '  <meta property="og:image:width" content="1200">',
        '  <meta property="og:image:height" content="630">',
        '  <meta name="twitter:image" content="%s/assets/og-image.jpg">' % site,
        ld(org_graph(site, d, lang)),
    ] + ([ld(faq)] if faq else [])


def set_block(page_html, lines, page):
    new, n = BLOCK.subn(lambda m: m.group(1) + "\n" + "\n".join(lines) + m.group(3), page_html)
    if n != 1:
        fail("no encontré el bloque DOMINIO en %s." % page)
    return new


# ---------- Página en inglés ----------
TOKEN = re.compile(r"(<!--.*?-->|<script\b.*?</script>|<style\b.*?</style>|<[^>]+>)", re.S | re.I)
ATTRS = ("alt", "aria-label", "placeholder", "title", "data-alt")
META_TEXT = re.compile(r'(<meta\s+(?:name|property)="(?:description|og:description|twitter:description|og:title|twitter:title)"\s+content=")([^"]*)(")')
URL_ATTR = re.compile(r'(\s(?:href|src|poster)=")([^"]*)(")')
SPANISH = re.compile(r"[áéíóúñ¿¡]|\b(de|para|que|los|las|una|con|tu|tus|del)\b", re.I)


def make_translator(dic):
    missing = []

    def tr(text, where=""):
        key = re.sub(r"\s+", " ", text).strip()
        if not key:
            return text
        if key in dic:
            lead = re.match(r"^\s*", text).group(0)
            trail = re.search(r"\s*$", text).group(0)
            return lead + dic[key] + trail
        if SPANISH.search(key):
            missing.append((where, key))
        return text
    return tr, missing


def absolute(url):
    if not url or re.match(r"^(https?:|//|/|#|mailto:|tel:|data:|javascript:)", url):
        return url
    return "/" + url


def build_english(es_html, site, d):
    dic = json.loads(read("js/i18n-en.js").split("window.FW_EN = ", 1)[1].rstrip().rstrip(";"))
    tr, missing = make_translator(dic)
    out = []
    for part in TOKEN.split(es_html):
        if not part:
            continue
        if part.startswith("<!--") or re.match(r"<style\b", part, re.I):
            out.append(part)
        elif re.match(r"<script\b", part, re.I):
            # contenido intacto; solo se ajusta la ruta del archivo (src) en la etiqueta de apertura
            opening, rest = part.split(">", 1)
            out.append(URL_ATTR.sub(lambda m: m.group(1) + absolute(m.group(2)) + m.group(3), opening) + ">" + rest)
        elif part.startswith("<"):
            tag = part
            for a in ATTRS:
                tag = re.sub(r'(\s%s=")([^"]*)(")' % a,
                             lambda m: m.group(1) + html.escape(tr(html.unescape(m.group(2)), "atributo " + a)) + m.group(3), tag)
            tag = META_TEXT.sub(lambda m: m.group(1) + html.escape(tr(html.unescape(m.group(2)), "meta")) + m.group(3), tag)
            tag = URL_ATTR.sub(lambda m: m.group(1) + absolute(m.group(2)) + m.group(3), tag)
            out.append(tag)
        else:
            out.append(html.escape(tr(html.unescape(part), "texto"), quote=False))
    en = "".join(out)
    en = re.sub(r"<title>(.*?)</title>", lambda m: "<title>%s</title>" % html.escape(tr(html.unescape(m.group(1)), "título"), quote=False), en, 1)
    en = en.replace('<html lang="es-419" data-intro>', '<html lang="en" data-intro>', 1)
    en = en.replace('<meta property="og:locale" content="es_LA">', '<meta property="og:locale" content="en_US">', 1)
    en = en.replace('<meta property="og:locale:alternate" content="en_US">', '<meta property="og:locale:alternate" content="es_LA">', 1)
    en = set_block(en, home_lines(site, d, "en", en), "en/index.html")
    # Selector de idioma: en esta página el actual es EN
    en, n = re.subn(r'<a href="/en/" hreflang="en" lang="en">EN</a>\s*<a href="/" hreflang="es" aria-current="page">ES</a>',
                    '<a href="/en/" hreflang="en" aria-current="page">EN</a>\n      <a href="/" hreflang="es" lang="es">ES</a>', en)
    if n != 1:
        fail("no encontré el selector de idioma en index.html.")
    # El diccionario solo lo necesita la página en inglés (mensajes que genera el código)
    en, n = re.subn(r'(<script src="/js/i18n\.js[^"]*" defer></script>)',
                    lambda m: '<script src="/js/i18n-en.js?v=%s" defer></script>\n' % version("js/i18n-en.js") + m.group(1), en)
    if n != 1:
        fail("no encontré js/i18n.js en index.html.")
    return en, missing


def version(name):
    # huella del contenido: cambia solo cuando cambia el archivo (evita que el navegador use una copia vieja)
    with open(os.path.join(WEB, name), "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()[:10]


def main():
    if len(sys.argv) != 2:
        fail("indica el dominio. Ejemplo: python3 _herramientas/preparar-dominio.py https://wontex-devs.com")
    site = sys.argv[1].strip().rstrip("/")
    if not re.fullmatch(r"https://([a-z0-9-]+(\.[a-z0-9-]+)+)", site, re.I):
        fail("el dominio debe empezar por https:// y no llevar rutas (ejemplo: https://wontex-devs.com).")
    data = business_data()
    today = datetime.date.today().isoformat()

    es = read("index.html")
    es = set_block(es, home_lines(site, data, "es", es), "index.html")
    write("index.html", es)

    # Páginas de servicios (contenido en _herramientas/servicios.py)
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import servicios
    svc = servicios.build(site, es)
    for path, content in svc.items():
        write(path, content)
        print("%-17s generada" % path.split("/")[0][:17])

    indexable = []
    for page in LEGAL:
        page_html = read(page)
        draft = "[PENDIENTE" in page_html
        title = re.search(r"<h1>(.*?)<", page_html).group(1).strip()
        crumbs = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": TEXT["es"]["home"], "item": site + "/"},
            {"@type": "ListItem", "position": 2, "name": title, "item": clean_url(site, page)}]}
        lines = ['  <meta name="robots" content="%s">' % (ROBOTS_OFF if draft else ROBOTS_ON),
                 '  <link rel="canonical" href="%s">' % clean_url(site, page), ld(crumbs)]
        write(page, set_block(page_html, lines, page))
        if not draft:
            indexable.append(page)
        print("%-17s %s" % (page, "borrador (noindex, fuera del sitemap)" if draft else "indexable"))

    en, missing = build_english(es, site, data)
    write("en/index.html", en)
    print("en/index.html     generada")
    for where, text in missing:
        print("  ⚠ sin traducción (%s): %s" % (where, text[:90]))

    alt = ('    <xhtml:link rel="alternate" hreflang="es" href="{s}/"/>\n'
           '    <xhtml:link rel="alternate" hreflang="en" href="{s}/en/"/>\n'
           '    <xhtml:link rel="alternate" hreflang="x-default" href="{s}/"/>\n').format(s=site)
    urls = "".join("  <url>\n    <loc>%s</loc>\n    <lastmod>%s</lastmod>\n%s  </url>\n" % (u, today, alt)
                   for u in (site + "/", site + "/en/"))
    urls += "".join("  <url>\n    <loc>%s</loc>\n    <lastmod>%s</lastmod>\n  </url>\n" % (clean_url(site, p), today)
                    for p in indexable)
    urls += "".join("  <url>\n    <loc>%s/%s</loc>\n    <lastmod>%s</lastmod>\n  </url>\n" % (site, path[:-len("index.html")], today)
                    for path in svc)
    write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n'
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
          + urls + "</urlset>\n")
    write("robots.txt", "# Wontex · robots.txt\nUser-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n" % site)

    cfg = read("js/config.js")
    cfg, n = re.subn(r"siteUrl: '[^']*'", "siteUrl: '%s'" % site, cfg)
    if n != 1:
        fail("no encontré siteUrl en js/config.js.")
    write("js/config.js", cfg)

    print("Listo: " + site + ". Revisa los cambios y súbelos a GitHub (Cloudflare Pages publica solo).")


if __name__ == "__main__":
    main()
