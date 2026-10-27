# Wontex · sitio web

Sitio **estático** (HTML, CSS y JavaScript, sin compilación ni servidor). Se publica en **Cloudflare Pages**
(proyecto `wontex-devs-website`, conectado al repositorio `Wontex-devs/Wontex-devs-website`): cada cambio en la
rama `main` se publica solo. Dominio: **https://wontex-devs.com** (respaldo: https://wontex-devs-website.pages.dev).
En Cloudflare: comando de compilación `rm -rf _herramientas README.md _config.yml` (no publica archivos internos);
carpeta de salida: la raíz. La auditoría técnica completa está en `_herramientas/AUDITORIA.md` (no se publica).

```
web/
├── index.html              Página principal en español (/)
├── en/index.html           Página en inglés (/en/) · GENERADA, no se edita a mano
├── aviso-legal.html        Aviso legal            ┐ borradores con datos [PENDIENTE]:
├── privacidad.html         Política de privacidad ├ quedan en noindex y fuera del sitemap
├── cookies.html            Política de cookies    ┘ hasta completarlos
├── 404.html                Página de error (noindex)
├── _headers · _redirects   Cabeceras de seguridad/caché y redirecciones de Cloudflare Pages
├── robots.txt · sitemap.xml · site.webmanifest · favicon.ico
├── css/fonts.css           Tipografías Unbounded e Inter alojadas en el sitio (assets/fonts, licencia OFL)
├── css/styles.css · site.css · legal.css   Estilos
├── js/head.js              Se ejecuta en el <head> (sin scripts en línea, por la CSP)
├── js/config.js            ← DATOS PENDIENTES (WhatsApp, analítica)
├── js/main.js · consent.js · legal.js      Interacciones, aviso de cookies (solo con analítica), año del pie
├── js/i18n.js · i18n-en.js Idioma de los mensajes del código y diccionario español → inglés
├── assets/                 Imágenes, fuentes, video, favicons e imagen para compartir (og-image.jpg)
└── _herramientas/          No se publica
    ├── preparar-dominio.py SEO de todas las páginas + genera en/index.html, sitemap.xml y robots.txt
    └── datos-negocio.json  Datos reales del negocio para Google (opcional)
```

## Después de cada cambio (importante)

Si cambias `index.html`, las páginas legales o el diccionario, ejecuta desde `web/`:

```bash
python3 _herramientas/preparar-dominio.py https://wontex-devs.com
```

Regenera la página en inglés, las canónicas, `hreflang`, datos estructurados, `sitemap.xml` y `robots.txt`, y
avisa si algún texto nuevo no tiene traducción. Si cambias un CSS o JS, sube su `?v=` en el HTML (tienen caché
de un año); las fuentes se renombran si cambian.

## Verlo en local

```bash
python3 -m http.server 4321
```

Luego abre http://localhost:4321 (las cabeceras de `_headers` solo se aplican en Cloudflare).

## Datos pendientes (no se inventaron)

| Dato | Dónde se completa | Si no se completa |
|---|---|---|
| Número de WhatsApp comercial | `js/config.js` → `whatsapp: '573001234567'` (solo dígitos, con indicativo 57) | El botón "Escríbenos" lleva al formulario |
| Titular, NIT o cédula, dirección, teléfono, matrícula, área de atención | Páginas legales: buscar `[PENDIENTE` | Las páginas muestran el dato pendiente y no se indexan |
| Fecha de publicación, vigencia y plazo de conservación de datos | `privacidad.html`, `aviso-legal.html`, `cookies.html` | Se ve como pendiente |
| ID de Google Analytics 4 (opcional) | `js/config.js` → `ga4Id: 'G-XXXXXXXXXX'` y dominios de Google en `_headers` | No hay analítica ni aviso de cookies |
| Datos para Google (teléfono, dirección, horario, redes oficiales) | `_herramientas/datos-negocio.json` y volver a ejecutar el script | Google solo recibe nombre, correo y servicios |

Los textos legales describen lo que el sitio hace realmente (Cloudflare, FormSubmit, correo en Hostinger,
WhatsApp). Son **borradores**: deben revisarlos un abogado antes de darlos por aprobados.

## Formulario de contacto

- Se envía a **FormSubmit** (`formsubmit.co`), que reenvía cada solicitud a `info@wontex-devs.com` (correo en Hostinger).
- **Activación (una sola vez):** envía una prueba desde https://wontex-devs.com; llegará a `info@wontex-devs.com`
  un correo de FormSubmit para confirmar. Hasta entonces los envíos no se entregan.
- Después de activarlo, FormSubmit ofrece una dirección alternativa (una cadena aleatoria) para no mostrar el correo
  en el código: reemplázala en `data-endpoint` del formulario en `index.html` y ejecuta el script de dominio.
- Tres casillas obligatorias, separadas y desmarcadas: autorización de datos (Ley 1581), Aviso legal y Política de
  privacidad. Cada envío incluye una **constancia** (fecha y hora `-05:00`, versión de los documentos, página e
  idioma). Si cambias los textos legales, actualiza `LEGAL_VERSION` en `js/main.js`.
- Antispam: campo trampa invisible, tiempo mínimo de llenado (3 s), máximo 3 envíos cada 10 minutos por
  navegador, máximo 2 enlaces por mensaje y el filtro propio de FormSubmit.

## Cookies y analítica

- Hoy el sitio **no usa cookies ni recursos de terceros**. Solo guarda en el navegador, durante la visita,
  `fw-intro` (animación de entrada ya vista) y `fw-sends` (contador antispam). Por eso no se muestra ningún aviso.
- Si se agrega un ID de Google Analytics 4: aparece el aviso con **Aceptar, Rechazar y Configurar**; la analítica
  solo se carga si el visitante acepta; la elección dura 12 meses como máximo y se cambia desde "Preferencias de
  cookies" en el pie de todas las páginas. Antes de activarla: actualiza `cookies.html` (`_ga`, `_ga_*`) y agrega
  los dominios de Google a la CSP de `_headers` (instrucciones dentro del archivo).

## Idiomas

- Español en `/` (principal) e inglés en `/en/`, cada uno con su HTML estático, `lang`, canónica y `hreflang`
  recíprocos. El selector EN/ES es un enlace entre ambas páginas.
- `en/index.html` lo genera `preparar-dominio.py` desde `index.html` con el diccionario `js/i18n-en.js`
  (clave = texto en español exacto). Para cambiar un texto en inglés, edita el diccionario y vuelve a generar.
- Las páginas legales están solo en español (legislación colombiana).

## Seguridad

`_headers` aplica en Cloudflare: Content-Security-Policy estricta (solo recursos propios y FormSubmit), HSTS
(sin `preload`), `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` y `Cross-Origin-Opener-Policy`.
Por eso no se deben agregar scripts ni atributos `style` en línea: van en archivos `.js` y `.css`.
Redirecciones: `http` → `https` y `www` → sin `www` (regla 301 en Cloudflare), `.html` → sin extensión (Cloudflare Pages).

## Estructura de la página

1. **Hero audiovisual** (`#top`): video de fondo fijo mientras se desplaza; las frases cambian con el scroll
   (intro → 4 frases → cierre WONTEX). El video no se reinicia ni bloquea el desplazamiento.
2. **Nuestro enfoque** (`#enfoque`): frase que se "llena" al desplazarse.
3. **Soluciones** (`#soluciones`): Sitios web, Automatización, CRM y gestión comercial, Herramientas de negocio.
   "Conocer más" despliega el detalle; "Cotizar…" lleva al formulario con el interés ya marcado.
4. **Tecnología aplicada** (`#aplicada`): ejemplos ilustrativos (CRM, página web, cotizador). Los nombres que
   aparecen en las pantallas son ficticios y la sección lo indica.
5. **Cómo trabajamos** (`#proceso`): 4 pasos.
6. **Contacto** (`#contacto`): correo real configurado y formulario.

Con `prefers-reduced-motion` el hero se muestra estático (sin video ni frases animadas).

## Video del hero

- La animación de la marca se renderiza en **nativo** (dibujo vectorial, sin ampliar), con tratamiento de
  color (saturación, contraste, viñeta) y un grano fijo muy fino que evita bandas en los degradados oscuros:
  - `assets/video/wontex-hero-1440.mp4`: 2560×1440, ~11 MB, para pantallas de 1200 px o más.
  - `assets/video/wontex-hero.mp4`: 1920×1080, ~7 MB, para celulares y pantallas medianas.
  - `assets/video/wontex-hero-poster.jpg`: primer fotograma; se ve mientras carga o si el video falla.
- Ambos: 12 s en bucle, H.264 sin audio, con el índice al inicio (empiezan a reproducirse sin descargarse completos).
- Versiones anteriores en `../archivo-fotos-web/` (`video-hero-provisional-v1/` y `video-hero-video2x-1080/`).
- Si cambias el video o el póster, sube el número `?v=` en `index.html` y `css/site.css` para que los
  navegadores no muestren la versión guardada.

## Imágenes, fuentes y derechos

- Inventario completo con origen y licencia en `_herramientas/AUDITORIA.md`.
- En uso: `arca/` (Unsplash), en el ejemplo de página web; tipografías Unbounded e Inter (SIL OFL 1.1, licencias en
  `assets/fonts/`). El logotipo WONTEX es texto (fuente Unbounded) con un
  cursor dibujado en CSS, no una imagen.
- Las fotos que dejaron de usarse con el rediseño están en `../archivo-fotos-web/sin-uso-rediseno-2026-10/`
  (fuera de la web publicada).
- No publiques logos de clientes, testimonios ni cifras que no sean reales.
