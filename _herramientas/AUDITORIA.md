# Auditoría técnica · wontex-devs.com

**WONTEX** · Automatización e IA para negocios · 25 de octubre de 2026
Alcance: SEO técnico, seguridad, cookies, privacidad (Colombia), accesibilidad (WCAG 2.2 AA), rendimiento y control
de calidad. **Sin rediseño:** no se cambiaron diseño, colores, tipografías, video, textos comerciales, secciones ni
animaciones (verificado elemento por elemento, ver §11).

> Este documento no es asesoría legal. Los textos legales son **borradores para revisión jurídica**.

---

## 1. Diagnóstico inicial

| Estado | Hallazgo |
|---|---|
| ✅ | `http` y `www` ya redirigían con 301 a `https://wontex-devs.com`; `/pagina.html` → `/pagina` (308). |
| ✅ | El dominio tiene correo en Hostinger (MX `mx1/mx2.hostinger.com`, SPF): `info@wontex-devs.com` puede recibir. |
| ✅ | Imagen para compartir 1200 × 630 accesible; un `<h1>` por página; 404 con `noindex`. |
| ✅ | Sin analítica ni píxeles: ningún rastreador antes del consentimiento. Sin `eval`; `innerHTML` solo con textos propios. |
| 🔴 | **Formulario hacia `frameworkscol@gmail.com`, que ya no existe**: las solicitudes se perdían. El correo estaba también en el contacto, JSON-LD, páginas legales, README y la herramienta de dominio. |
| 🟠 | Sin `Content-Security-Policy`, HSTS, `Permissions-Policy` ni COOP; no existían `_headers` ni `_redirects`. |
| 🟠 | Google Fonts en las 5 páginas (IP del visitante a Google y ~1,35 s de bloqueo de renderizado según PageSpeed). |
| 🟠 | **Idioma por defecto inglés** traducido con JavaScript en la misma URL: Google solo veía español, sin `hreflang`. |
| 🟡 | Sitemap y canónicas legales con `.html` (URLs que redirigen). JSON-LD con servicios que ya no se ofrecen ("marketing digital"). |
| 🟡 | Páginas legales con 14 datos `[PENDIENTE]` indexables; proveedores desactualizados (Gmail, GitHub Pages, Google Fonts). |
| 🟡 | Formulario sin casillas de Aviso legal y Privacidad ni constancia de aceptación. |
| 🟡 | Foco de teclado lima también sobre fondos claros (contraste 1,19:1). Scripts en línea (incompatibles con una CSP estricta). |

## 2. Decisiones tomadas contigo

- Idioma principal **español en `/`**, inglés en **`/en/`**.
- Aviso de cookies: **no se muestra** mientras no haya analítica; queda listo para GA4.
- Video del inicio: **sin botón de pausa** (ver riesgo en §9).
- Páginas legales: **`noindex`** hasta completarlas.
- HSTS **sin `preload`** (no confirmado).

## 3. Cambios realizados

1. **Correo oficial** `info@wontex-devs.com` en formulario (`data-endpoint` y `data-mailto`), contacto, JSON-LD,
   legales, README y herramientas.
2. **Fuentes locales**: Unbounded e Inter (`woff2` oficiales de Google Fonts, licencias OFL en `assets/fonts/`),
   mismas declaraciones que Google (pesos, rangos, `font-display: swap`) y `preload` de la principal.
3. **Idiomas indexables**: `en/index.html` estático generado desde el mismo HTML y diccionario; selector EN/ES como
   enlace; el español ya no descarga el diccionario (-14 KB).
4. **SEO por página**: títulos (51–55 caracteres) y descripciones (142–151) únicos; canónicas sin `.html`;
   `hreflang` es/en/x-default; `max-image-preview:large`; 404 `noindex, follow`; legales `noindex, follow`.
5. **Datos estructurados** nuevos (ver §5).
6. **Seguridad**: `_headers` con CSP estricta y cabeceras; sin scripts en línea (`js/head.js`, `js/legal.js`); alturas del
   gráfico ilustrativo pasadas de `style=""` a CSS (mismo resultado).
7. **Cookies**: aviso con Aceptar, Rechazar y Configurar, vigencia de 12 meses, enlace "Preferencias de cookies" en
   el pie de todas las páginas (oculto mientras no haya analítica).
8. **Legales** actualizados (ver §7) y **formulario** con casillas separadas y constancia.
9. **Accesibilidad**: foco con contraste 3:1, `role="region"` en el carrusel de ejemplos, mensaje "Revisa los campos
   marcados" en el área de estado del formulario.
10. **Rendimiento**: `preload` de la imagen fija del video con `fetchpriority="high"`; caché de un año para CSS, JS,
    fuentes y video.
11. **Herramienta** `_herramientas/preparar-dominio.py` reescrita: SEO de todas las páginas + página en inglés + sitemap.
12. README actualizado.

## 4. SEO técnico

| Página | URL canónica | Robots | Sitemap |
|---|---|---|---|
| Inicio (es) | `https://wontex-devs.com/` | index, follow, max-image-preview:large | Sí, con alternativas es/en/x-default |
| Inicio (en) | `https://wontex-devs.com/en/` | index, follow, max-image-preview:large | Sí, con alternativas |
| Aviso legal, Privacidad, Cookies | `https://wontex-devs.com/aviso-legal` (etc.) | noindex, follow (datos pendientes) | No, hasta completarlas (automático) |
| 404 | — | noindex, follow | No |

- Un solo `<h1>` por página, `lang` correcto (`es-419` / `en`), `alt=""` en imágenes decorativas de las demostraciones.
- Open Graph y Twitter Card con URL absolutas e imagen 1200 × 630.
- Enlaces de idioma, legales y contacto estáticos en el HTML.
- URLs únicas: `http`→`https`, `www`→sin `www` (regla 301 en Cloudflare), `.html`→sin extensión (308), `/es`→`/` (`_redirects`).

## 5. Datos estructurados (JSON-LD)

- **Inicio (es/en)**: `@graph` con `ProfessionalService` (nombre, URL, logo, imagen, descripción real, lema
  "Soluciones inteligentes. Resultados reales.", `email: info@wontex-devs.com`, servicios: sitios web, automatización
  con IA, CRM y gestión comercial, GoHighLevel, herramientas de negocio; idiomas es/en; área: Colombia) y `WebSite`.
- **Legales**: `BreadcrumbList` (Inicio → página).
- Sin `sameAs` (no hay redes oficiales registradas), sin teléfono ni dirección (pendientes), sin `aggregateRating`.
- Se agregan solos al completar `_herramientas/datos-negocio.json` y ejecutar el script.
- Recomendado tras publicar: validar en https://search.google.com/test/rich-results y https://validator.schema.org

## 6. Seguridad

**Servidor (`_headers`, Cloudflare Pages):**

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self';
  media-src 'self'; connect-src 'self' https://formsubmit.co; form-action 'self' https://formsubmit.co;
  manifest-src 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff · X-Frame-Options: DENY · Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=() · Cross-Origin-Opener-Policy: same-origin
```

No hizo falta `'unsafe-inline'` ni hashes: el sitio no tiene scripts ni estilos en línea.

**Código:** sin `eval`; `innerHTML` solo con textos propios del sitio (nunca con lo que escribe el visitante); enlaces
externos (WhatsApp) con `rel="noopener"`; el formulario conserva campo trampa, tiempo mínimo, límite de envíos y
máximo de enlaces, más el filtro de FormSubmit; no se guardan datos personales en el navegador.

**Cloudflare · ofuscación de correos (activada en la zona):** Cloudflare reemplaza los correos visibles por
`[email protected]` y los restaura con un script propio (`/cdn-cgi/scripts/…/email-decode.min.js`), compatible con la
CSP porque se sirve desde el mismo dominio. Reduce el spam, pero quien navega sin JavaScript y algunos buscadores ven
el texto de reemplazo. Se puede desactivar en Cloudflare → `wontex-devs.com` → Scrape Shield → Email Address
Obfuscation (decisión tuya; no se cambió).

**Pendiente de medir tras publicar:** calificación real en https://securityheaders.com y
https://developer.mozilla.org/en-US/observatory (no se puede medir antes de subir `_headers`).

## 7. Cookies, privacidad y textos legales

**Cookies:** el sitio no usa cookies. Almacenamiento de sesión: `fw-sends` (técnico, sin datos personales). Desde el
26/10/2026 el PC de «Tecnología aplicada» carga, al llegar a esa sección, una propuesta de sitio web alojada en GitHub
Pages (GitHub, Inc.); está declarado en privacidad y cookies y permitido en la CSP con `frame-src`. Con GA4 activado: nada se carga antes de aceptar; Aceptar, Rechazar y
Configurar con el mismo peso visual; preferencia `fw-consent` por 12 meses máximo; "Preferencias de cookies" en todas
las páginas.

**Textos actualizados** (aviso legal, privacidad, cookies):
- Encargados reales: **Cloudflare** (alojamiento), **FormSubmit** (formulario), **Hostinger** (correo), **WhatsApp**
  (si se usa). Se retiraron Gmail, Google Fonts y GitHub Pages. Transmisión internacional autorizada por el titular.
- Autorización previa, expresa e informada; casillas desmarcadas; el silencio no es autorización; prueba conservada.
- Consultas en 10 días hábiles (+5) y reclamos en 15 (+8), con subsanación en 5 días.
- Términos de uso, aceptación electrónica como mensaje de datos, derechos de autor, contenido ilustrativo ficticio.
- Versión `2026-10-25` en cada documento (coincide con `LEGAL_VERSION` del formulario).

**Formulario:** tres casillas separadas y desmarcadas (autorización de datos, Aviso legal, Política de privacidad),
envío bloqueado si falta alguna, y **constancia** con el mensaje: formulario, fecha y hora ISO `-05:00`, versión de
documentos, página e idioma.

**Normativa consultada (fuentes oficiales):**

| Norma | Qué se verificó | Fuente |
|---|---|---|
| Ley 1581 de 2012 | Arts. 14 (consultas 10 + 5 días hábiles), 15 (reclamos 15 + 8, subsanación 5 días), 26 (transferencias) — texto verificado | http://www.secretariasenado.gov.co/senado/basedoc/ley_1581_2012.html |
| Decreto 1377 de 2013 | Art. 7 (el silencio no es conducta inequívoca), art. 8 (prueba de la autorización) — texto verificado; compilado en el Decreto 1074 de 2015 | https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=53646 |
| Decreto 1074 de 2015 | Decreto Único del sector Comercio, Industria y Turismo (compila el 1377) | https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=76608 |
| SIC · cookies | Criterio de la Superintendencia sobre datos recogidos con cookies: **pendiente de verificar en una fuente oficial de la SIC** (no se pudo consultar en esta sesión) | https://www.sic.gov.co |
| Ley 1480 de 2011 | Art. 50 (comercio electrónico): hoy **no aplica** porque el sitio no vende ni cobra en línea; revisar si se agregan pagos | http://www.secretariasenado.gov.co/senado/basedoc/ley_1480_2011.html |
| Ley 527 de 1999 | Mensajes de datos: base de la constancia de aceptación | http://www.secretariasenado.gov.co/senado/basedoc/ley_0527_1999.html |
| Ley 23 de 1982 | Derechos de autor de textos, diseño, animación e imágenes | http://www.secretariasenado.gov.co/senado/basedoc/ley_0023_1982.html |

Conclusiones jurídicas: corresponden a un abogado. Los documentos siguen como borradores.

## 8. Rendimiento

**Medido con PageSpeed Insights el 25/10/2026 sobre el sitio publicado ANTES de estos cambios:**

| | Rendimiento | Accesibilidad | Prácticas | SEO | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|---|---|---|
| Móvil | 83 | 100 | 100 | 100 | 2,7 s | 3,2 s | 40 ms | 0 | 6,7 s |
| Escritorio | 99 | 100 | 100 | 100 | 0,8 s | 0,8 s | 0 ms | 0,02 | 0,9 s |

- INP: **sin datos de usuarios reales** todavía (sitio nuevo, sin informe CrUX).
- Principal oportunidad detectada: "solicitudes que bloquean el renderizado (~1,35 s)" = hoja de Google Fonts →
  **resuelto** con fuentes locales. Caché ineficiente → resuelto en `_headers`.
- **Medir de nuevo después de publicar** (no se puede medir la versión nueva antes de subirla).
- Peso total ~7 MB por el video del inicio (se reproduce mientras descarga; la versión de 1440 p solo en pantallas ≥ 1200 px).
- No se agregó `width`/`height` a las fotos de la demostración de página web: hacerlo cambiaba su tamaño dentro del
  teléfono ilustrativo (el CSS no fija su alto). Están en un contenedor de tamaño fijo, por lo que no generan saltos (CLS 0).

## 9. Accesibilidad (WCAG 2.2 AA)

- ✅ "Saltar al contenido", menú operable con teclado (Esc cierra y el foco vuelve al botón), etiquetas en todos los
  campos, errores con `aria-invalid` + `aria-describedby` y área `role="status"`.
- ✅ Foco visible con contraste ≥ 3:1 en todos los elementos enfocables (Midnight sobre claro, lima sobre oscuro).
- ✅ Contraste de textos verificado en revisiones anteriores; texto sobre el video con capa oscura.
- ✅ Campos del formulario a 17 px en celular (sin zoom en iPhone). Sin desborde horizontal a 320 px.
- ✅ Video sin sonido; con "reducir movimiento" se muestra la imagen fija.
- ⚠️ **Riesgo aceptado (WCAG 2.2.2 Pausar, detener, ocultar):** el video se mueve en bucle más de 5 segundos sin control
  de pausa. Quien tenga activado "reducir movimiento" no lo ve, pero un visitante sin esa preferencia no puede
  detenerlo. Es un incumplimiento del criterio 2.2.2 (nivel A). Recomendación: agregar un botón de pausa discreto.

## 10. Imágenes, video y derechos

| Recurso | Origen | Licencia / estado |
|---|---|---|
| Propuesta de sitio web de hotel (mostrada en vivo en el PC) | Diseñada por Wontex, publicada en GitHub Pages | Marcas e imágenes de ese sitio: confirmar autorización del hotel y origen de sus fotos |
| ~~`assets/img/arca/*.jpg`~~ | Unsplash | Ya no se usan (archivadas el 26/10/2026) |
| `assets/video/wontex-hero*.mp4` y póster | Animación creada para Wontex (render propio con la paleta de la marca) | Propia de Wontex |
| `assets/og-image.jpg`, favicons, íconos | Creados para Wontex con el logotipo | Propios de Wontex |
| Logotipo WONTEX | Texto en Unbounded + cursor en CSS | Propio; tipografía OFL |
| `assets/fonts/*.woff2` | Google Fonts (Unbounded, Inter) | SIL Open Font License 1.1 (archivos `OFL-*.txt`) |

No hay fotos de clientes reales; los nombres de las demostraciones son ficticios y el aviso legal lo indica.

## 11. Pruebas y resultados (ejecutadas en local antes de publicar)

| Prueba | Resultado |
|---|---|
| Validador W3C (Nu) en las 6 páginas | **0 errores, 0 avisos** |
| Enlaces y recursos (href, src, anclas, `url()` de CSS, sitemap) | **0 rotos**, 0 recursos externos |
| CSP en el navegador (servidor local que aplica `_headers`) | **0 violaciones**, consola sin errores, video se reproduce |
| Red antes del consentimiento | **0 peticiones a terceros** |
| Formulario (envío interceptado, sin mandar nada) | Bloquea sin las 3 casillas (mensaje por casilla); envía a `formsubmit.co/ajax/info@wontex-devs.com` con la constancia |
| Página en inglés | `lang="en"`, canónica y `hreflang` correctos; todo traducido salvo nombres ficticios de las demos |
| Comparación visual antes/después: estilos calculados de ~710 elementos a 320, 375, 768, 1100 y 1440 px, en es y en | **0 diferencias inesperadas**. Esperadas: las 2 casillas nuevas, el correo más corto (pie algo más bajo) |
| Desborde horizontal a 320 px (inicio, inglés, legales) | Ninguno |

**Pendientes tras publicar:** cabeceras reales (`curl -I`), securityheaders.com / Observatory, PageSpeed de la versión
nueva, envío real de prueba del formulario y activación de FormSubmit.

## 12. Prioridades

1. 🔴 Autorizar la publicación y **activar FormSubmit** (hasta entonces el formulario no entrega mensajes).
2. 🟠 Entregar los datos legales pendientes (§13) y pasar los borradores a revisión jurídica.
3. 🟠 Registrar el sitio en Google Search Console y Bing (§14).
4. 🟡 Decidir el botón de pausa del video (§9).
5. 🟡 Confirmar la autorización del hotel para mostrar su propuesta y el origen de sus fotos.
6. ⚪ Al activar GA4: actualizar `cookies.html` y la CSP.

## 13. Datos que debes entregar

- Nombre o razón social del titular, NIT o cédula, domicilio (ciudad y dirección), teléfono y, si es sociedad, matrícula mercantil.
- Área o cargo responsable de atender consultas y reclamos de datos personales.
- Fecha de publicación y de entrada en vigencia de los documentos legales.
- Plazo de conservación de los datos (por ejemplo, 24 meses desde el último contacto).
- Número comercial de WhatsApp (opcional).
- ID de Google Analytics 4 (opcional).
- Redes sociales oficiales, si existen (para `sameAs`).
- Confirmación de que el hotel autoriza mostrar la propuesta de sitio web.

## 14. Instrucciones

### Publicar (cuando lo autorices)
`git push` a la rama `main`; Cloudflare Pages publica solo en ~1 minuto. Luego verificar:
`curl -I https://wontex-devs.com` (deben aparecer `content-security-policy` y `strict-transport-security`).

### Activar FormSubmit
1. Abre https://wontex-devs.com, completa el formulario con un dato de prueba y envíalo.
2. Revisa `info@wontex-devs.com`: llega un correo de FormSubmit; pulsa **Activate Form**.
3. Envía otra prueba y confirma que llega con la tabla de datos y la **constancia**.
4. (Recomendado) FormSubmit muestra una dirección alternativa (cadena aleatoria): pégala en `data-endpoint` del
   formulario en `index.html` en lugar del correo, ejecuta `python3 _herramientas/preparar-dominio.py https://wontex-devs.com`
   y publica.

### Google Search Console
1. Entra a https://search.google.com/search-console → **Agregar propiedad** → tipo **Dominio** → `wontex-devs.com`.
2. Google muestra un registro **TXT** (`google-site-verification=…`). En Cloudflare → `wontex-devs.com` → **DNS → Records →
   Add record**: tipo `TXT`, nombre `@`, contenido el texto de Google. Guarda y pulsa **Verificar** en Search Console
   (puede tardar unos minutos).
3. **Sitemaps** → envía `https://wontex-devs.com/sitemap.xml`.
4. **Inspección de URL** → `https://wontex-devs.com/` y `https://wontex-devs.com/en/` → **Solicitar indexación**.

### Bing Webmaster Tools
1. Entra a https://www.bing.com/webmasters → **Importar desde Google Search Console** (trae el sitio y el sitemap).
2. Si no, agrega `https://wontex-devs.com`, verifica con un registro DNS en Cloudflare y envía el sitemap.

### Perfil de Empresa de Google
Solo si Wontex tiene dirección física o área de servicio real: https://business.google.com, con el mismo nombre,
correo, teléfono y dirección de las páginas legales.

## 15. Resultados tras publicar (27/10/2026)

| Verificación | Resultado |
|---|---|
| Cabeceras en `https://wontex-devs.com` (`curl -I`) | CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy y COOP presentes |
| securityheaders.com | **A+** |
| Mozilla Observatory | **A+ (130 puntos, 12/12 pruebas)** |
| PageSpeed móvil (nueva versión) | Rendimiento **94** (antes 83) · Accesibilidad 97 · Prácticas 92 · SEO 100 · LCP 2,7 s (antes 3,2 s) · TBT 0 ms · CLS 0,001 |
| Contraste "(opcional)" en el formulario (causa del 97) | Corregido y publicado (5,3:1) |
| Violaciones de CSP en el sitio publicado | Solo el script de **Cloudflare Web Analytics** (`static.cloudflareinsights.com`), que Cloudflare inyecta en el proyecto y la CSP bloquea: causa el 92 en Prácticas. Pendiente de decisión: desactivarlo en Cloudflare o permitirlo en la CSP y declararlo en privacidad/cookies |
| Rutas | `/es` → `/` (301); README, `_herramientas/` y `AUDITORIA.md` → 404 |

---

# Auditoría SEO y funcional · 27/10/2026

## A. Diagnóstico y causa raíz

**Problema:** Wontex no aparece en Google ni siquiera buscando la marca. **Confirmado**: en buscadores no hay
ningún resultado de `wontex-devs.com`, y "Wontex" se interpreta como error de "Wintex" (varias empresas textiles).

**Causa raíz (confirmada):** el dominio es nuevo. `wontex-devs.com` se registró el **26/10/2026** (WHOIS, Hostinger);
el sitio se publica ahí desde el 25-26/10 y hasta el 25/10 la versión en GitHub Pages tenía `noindex`. Google aún no
lo ha descubierto: no está verificado en Search Console y no hay enlaces externos hacia él.
**No había bloqueos técnicos**: robots.txt permite todo, sin `noindex` ni `X-Robots-Tag` en páginas públicas,
canónicas correctas, HTTPS y redirecciones 301, HTML estático (el contenido no depende de JavaScript).

## B. Errores encontrados

| Gravedad | Problema | Evidencia | Impacto | Estado |
|---|---|---|---|---|
| Alta | Dominio nuevo, sin Search Console ni enlaces | WHOIS 26/10/2026; sin resultados en buscadores | Google no conoce el sitio | Search Console: **Corregido** (dominio verificado con wontex.developer@gmail.com y sitemap enviado el 27/10/2026, 6 URL, estado Correcto). Falta solicitar indexación y conseguir enlaces (§F) |
| Alta | Copias duplicadas indexables | `wontex-devs-website.pages.dev` y `wontex-devs.github.io/Wontex-devs-website/` sirven el mismo sitio | Contenido duplicado | pages.dev: **Corregido y verificado** (`X-Robots-Tag: noindex`). GitHub Pages: **Corregido y verificado** (desactivado el 27/10/2026; la dirección responde 404) |
| Media | Una sola página para todos los servicios | Sin URLs para "desarrollo web", "CRM", etc. | Poca relevancia para búsquedas de servicios | **Corregido y verificado** (4 páginas) |
| Media | Título y H1 abstractos | Título "Sitios web, automatización y CRM…", H1 "…que simplifican tu negocio" | Google entiende peor la actividad | **Corregido y verificado** |
| Media | Marca confundible ("Wontex" → "Wintex") | Resultados de búsqueda | Búsquedas de marca muestran otras empresas | Datos estructurados reforzados; resto **pendiente externo** (perfiles, Search Console, Perfil de Empresa) |
| Baja | Desbordes a 320 px en 2 páginas | Medición en navegador | Scroll horizontal en celulares pequeños | **Corregido y verificado** |
| Baja | Error de consola por Cloudflare Web Analytics bloqueado por la CSP | PageSpeed "Prácticas" 92 | Solo calificación | **Corregido y verificado** (Web Analytics desactivado el 27/10/2026; el script ya no se inyecta) |

## C. Correcciones implementadas

- `index.html`: título "Wontex | Desarrollo Web y Automatización Empresarial"; H1 "Soluciones digitales y automatización
  para empresas."; descripción con Barranquilla y toda Colombia; texto de presentación (actividad, público y área);
  "Automatización e inteligencia artificial"; enlaces visibles a cada servicio; servicios en el pie. Versión en inglés regenerada.
- `_herramientas/servicios.py` (nuevo) → `/desarrollo-web/`, `/automatizacion-e-inteligencia-artificial/`, `/crm/`,
  `/herramientas-digitales/`: problemas que resuelve, qué incluye, beneficios sin promesas, ejemplos ilustrativos,
  proceso, llamada a la acción, otros servicios; metadatos propios, canónica, Open Graph, JSON-LD `Service` + `BreadcrumbList`.
- `_herramientas/preparar-dominio.py`: genera las páginas de servicios y las añade al sitemap; organización con
  servicios reales y área Barranquilla + Colombia (sin dirección física, teléfono ni reseñas).
- `_headers`: `X-Robots-Tag: noindex` para `wontex-devs-website.pages.dev` y sus vistas previas.
- `js/head.js`: la animación de entrada solo en el inicio. `css/site.css`: estilos de servicios y ajustes a 320 px.

## D. Palabras clave (hipótesis por validar; sin datos de volumen)

No se usaron herramientas con volúmenes de búsqueda: son hipótesis basadas en la oferta real y en una revisión de
resultados (en Barranquilla dominan directorios y pocas agencias con páginas dedicadas; en CRM pesa mucho WhatsApp).

| Grupo | Intención | Palabras clave priorizadas | Página | Título | H1 |
|---|---|---|---|---|---|
| A · Desarrollo web | Comercial | desarrollo de páginas web para empresas · diseño web Barranquilla · páginas web para pequeñas empresas | /desarrollo-web/ | Desarrollo de páginas web para empresas \| Wontex | Desarrollo de páginas web para empresas |
| B+C · Automatización e IA | Comercial / informativa | automatización de procesos empresariales · automatización de WhatsApp · chatbots para empresas · inteligencia artificial para empresas | /automatizacion-e-inteligencia-artificial/ | Automatización de procesos e IA para empresas \| Wontex | Automatización de procesos e inteligencia artificial para empresas |
| D · CRM | Comercial | implementación de CRM para empresas · CRM para pequeñas empresas · automatización de ventas · seguimiento de clientes potenciales | /crm/ | Implementación de CRM y automatización comercial \| Wontex | Implementación de CRM y automatización comercial |
| E · Herramientas | Comercial (nicho) | desarrollo de cotizadores digitales · dashboards empresariales · herramientas digitales para empresas | /herramientas-digitales/ | Herramientas digitales y cotizadores para empresas \| Wontex | Herramientas digitales a la medida para empresas |
| F · Marca | Navegacional | Wontex · Wontex desarrollo web · Wontex automatización | / | Wontex \| Desarrollo Web y Automatización Empresarial | Soluciones digitales y automatización para empresas |

Validar con Search Console (consultas reales, 4-8 semanas después de indexar) y, si se desea, con Google Keyword Planner.

## E. Pruebas ejecutadas

| Prueba | Cómo | Resultado |
|---|---|---|
| Acceso de Googlebot | `curl` con agente de Googlebot a las 6 páginas públicas | 200, sin `X-Robots-Tag` · **Verificado** |
| robots.txt y sitemap | Lectura y análisis XML | Permite todo; sitemap válido con 6 URLs canónicas · **Verificado** |
| Dominio | http, www, `/index.html`, `/crm` sin barra | 301/308 a la URL canónica · **Verificado** |
| Copias duplicadas | Cabeceras de pages.dev | `X-Robots-Tag: noindex` · **Verificado** |
| HTML | Validador W3C, 9 páginas | 0 errores, 0 avisos · **Verificado** |
| Datos estructurados | Análisis JSON de cada bloque | Válidos (ProfessionalService, WebSite, Service, BreadcrumbList) · Pendiente Rich Results Test |
| Enlaces y anclas | Script sobre 9 páginas (30 URLs) | 0 rotos · **Verificado** |
| Responsive | 9 páginas × 320/375/768/1024/1440 px | 0 desbordes (tras corregir 2) · **Verificado** |
| Menú móvil, Esc y foco | Navegador, 375 px | Abre, cierra con Esc y devuelve el foco · **Verificado** |
| Consola y CSP | Navegador con las cabeceras reales (local) | 0 errores en inicio y servicios; en producción solo el script de Cloudflare Web Analytics |
| Formulario | Envío interceptado (sin enviar datos reales) | Validaciones, 3 casillas y constancia correctas · Envío real **pendiente** (activar FormSubmit) |
| WhatsApp | Configuración | Sin número: el botón lleva al formulario · **Verificado** |
| PageSpeed móvil (inicio) | pagespeed.web.dev | Rendimiento 95 · Accesibilidad 100 · Prácticas 92 · SEO 100 · LCP 2,7 s · CLS 0,001 · TBT 0 ms |
| PageSpeed móvil (/crm/) | pagespeed.web.dev | 98 · 100 · 92 · 100 · LCP 1,8 s · CLS 0,082 · TBT 0 ms |
| INP | — | Sin datos de usuarios reales todavía (sitio nuevo) |

## F. Pendientes externos (requieren tu acceso)

1. **Google Search Console**: ~~verificar el dominio~~ y ~~enviar el sitemap~~ · hechos el 27/10/2026 (cuenta
   wontex.developer@gmail.com, registro TXT `google-site-verification` en Cloudflare: no borrarlo). Falta
   **Inspección de URLs → Solicitar indexación** de `/` y las 4 páginas de servicios (§14).
2. ~~**Bing Webmaster Tools**: importar desde Search Console~~ · hecho el 27/10/2026 (importado con wontex.developer@gmail.com,
   sitemap enviado y las 6 URL enviadas con URL Submission).
3. ~~Desactivar GitHub Pages~~ · hecho el 27/10/2026.
4. **Señales de marca**: crear perfiles oficiales (LinkedIn, Instagram…) que enlacen a wontex-devs.com y agregarlos a
   `_herramientas/datos-negocio.json` (`redesSociales`) para `sameAs`; Perfil de Empresa de Google como negocio de
   área de servicio (Barranquilla), sin dirección pública si no hay local.
5. **FormSubmit**: activar con un envío de prueba desde la web.
6. ~~Cloudflare Web Analytics~~ · desactivado el 27/10/2026.

## G. Riesgos residuales

- La indexación depende de Google: aunque todo esté técnicamente listo, puede tardar días o semanas.
- La marca se confunde con "Wintex": sin perfiles y enlaces externos, Google puede seguir corrigiendo la búsqueda.
- LCP móvil del inicio en 2,7 s (objetivo 2,5 s): lo frenan las hojas de estilo que bloquean el renderizado.
- Páginas legales en `noindex` hasta completar sus datos.
- Las páginas de servicios están solo en español.

## H. Próximos pasos (por prioridad)

1. Search Console: verificar, enviar el sitemap y solicitar indexación (hoy).
2. ~~Desactivar GitHub Pages y Cloudflare Web Analytics~~ · hecho.
3. Crear perfiles oficiales de la marca y el Perfil de Empresa; agregarlos a `sameAs`.
4. Activar FormSubmit y probar un envío real.
5. A las 1-2 semanas: revisar en Search Console las páginas indexadas y los errores de cobertura.
6. A las 4-8 semanas: revisar consultas, impresiones, clics y posiciones por página y ajustar textos.
7. Optimizar el LCP móvil (CSS crítico en línea o reducir las hojas de estilo) sin cambiar el diseño.
