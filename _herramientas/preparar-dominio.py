#!/usr/bin/env python3
"""Frame Works · prepara la web para el dominio definitivo.

Uso (desde la carpeta web/):
    python3 _herramientas/preparar-dominio.py https://www.tudominio.com

Qué hace (se puede ejecutar de nuevo si cambias de dominio):
  1. index.html y páginas legales: escribe la URL canónica, og:url, la imagen
     para compartir y los datos estructurados (JSON-LD) con el dominio, y
     cambia "noindex" por "index, follow" para que Google pueda indexar.
  2. Crea sitemap.xml con las páginas públicas.
  3. Reescribe robots.txt con la línea "Sitemap:".
  4. Crea el archivo CNAME que GitHub Pages usa para el dominio propio.
  5. Guarda el dominio en js/config.js (siteUrl).
Los datos de negocio reales (teléfono, dirección, horario, redes) se toman de
_herramientas/datos-negocio.json; los campos vacíos no se publican.
No usa internet ni instala nada.
"""
import datetime
import json
import os
import re
import sys

WEB = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ["index.html", "aviso-legal.html", "privacidad.html", "cookies.html"]
BLOCK = re.compile(r"(<!-- DOMINIO:INICIO.*?-->)(.*?)(\s*<!-- DOMINIO:FIN -->)", re.S)


def fail(msg):
    print("Error: " + msg)
    sys.exit(1)


def read(name):
    with open(os.path.join(WEB, name), encoding="utf-8") as f:
        return f.read()


def write(name, text):
    with open(os.path.join(WEB, name), "w", encoding="utf-8") as f:
        f.write(text)


def business_data():
    path = os.path.join(WEB, "_herramientas", "datos-negocio.json")
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def json_ld(site, d):
    ld = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Frame Works",
        "url": site + "/",
        "logo": site + "/assets/icon-512.png",
        "image": site + "/assets/og-image.jpg",
        "description": "Automatización con IA, sitios web, marketing digital y herramientas de negocio para empresas.",
        "email": "frameworkscol@gmail.com",
        "knowsAbout": ["Automatización con inteligencia artificial", "Desarrollo de sitios web",
                       "Marketing digital", "CRM y herramientas de negocio"],
        "areaServed": {"@type": "Country", "name": "Colombia"},
    }
    if d.get("nombreLegal"):
        ld["legalName"] = d["nombreLegal"]
    if d.get("telefono"):
        ld["telephone"] = d["telefono"]
    addr = {k: v for k, v in {
        "streetAddress": d.get("direccion"), "addressLocality": d.get("ciudad"),
        "addressRegion": d.get("departamento"), "postalCode": d.get("codigoPostal"),
    }.items() if v}
    if addr:
        addr["@type"] = "PostalAddress"
        addr["addressCountry"] = d.get("pais") or "CO"
        ld["address"] = addr
    if d.get("horario"):
        ld["openingHours"] = d["horario"]
    if d.get("redesSociales"):
        ld["sameAs"] = d["redesSociales"]
    return json.dumps(ld, ensure_ascii=False)


def main():
    if len(sys.argv) != 2:
        fail("indica el dominio. Ejemplo: python3 _herramientas/preparar-dominio.py https://www.tudominio.com")
    site = sys.argv[1].strip().rstrip("/")
    m = re.fullmatch(r"https://([a-z0-9-]+(\.[a-z0-9-]+)+)", site, re.I)
    if not m:
        fail("el dominio debe empezar por https:// y no llevar rutas (ejemplo: https://www.tudominio.com).")
    host = m.group(1).lower()
    if host.endswith("github.io"):
        fail("la dirección de github.io es provisional; usa tu dominio definitivo.")
    data = business_data()

    for page in PAGES:
        html = read(page)
        url = site + "/" + ("" if page == "index.html" else page)
        lines = [
            '  <meta name="robots" content="index, follow">',
            '  <link rel="canonical" href="%s">' % url,
        ]
        if page == "index.html":
            lines += [
                '  <meta property="og:url" content="%s">' % url,
                '  <meta property="og:image" content="%s/assets/og-image.jpg">' % site,
                '  <meta property="og:image:width" content="1200">',
                '  <meta property="og:image:height" content="630">',
                '  <meta name="twitter:image" content="%s/assets/og-image.jpg">' % site,
                '  <script type="application/ld+json">%s</script>' % json_ld(site, data),
            ]
        new, n = BLOCK.subn(lambda mm: mm.group(1) + "\n" + "\n".join(lines) + mm.group(3), html)
        if n != 1:
            fail("no encontré el bloque DOMINIO en %s." % page)
        write(page, new)

    today = datetime.date.today().isoformat()
    urls = "".join(
        "  <url><loc>%s/%s</loc><lastmod>%s</lastmod></url>\n" % (site, "" if p == "index.html" else p, today)
        for p in PAGES)
    write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n'
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "</urlset>\n")
    write("robots.txt", "# Frame Works · robots.txt\nUser-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n" % site)
    write("CNAME", host + "\n")

    cfg = read("js/config.js")
    cfg, n = re.subn(r"siteUrl: '[^']*'", "siteUrl: '%s'" % site, cfg)
    if n != 1:
        fail("no encontré siteUrl en js/config.js.")
    write("js/config.js", cfg)

    print("Listo. Dominio configurado: " + site)
    print("Revisa los cambios, súbelos a GitHub y configura el DNS (ver README, sección Publicar).")


if __name__ == "__main__":
    main()
