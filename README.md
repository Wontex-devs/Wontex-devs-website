# Wontex · sitio web

Sitio **estático** de una sola página (HTML, CSS y JavaScript, sin compilación ni servidor).
Funciona en cualquier alojamiento estático. Hoy se publica en GitHub Pages en una dirección **provisional**.

```
web/
├── index.html              Página principal
├── aviso-legal.html        Aviso legal            ┐
├── privacidad.html         Política de privacidad ├ datos marcados [PENDIENTE]
├── cookies.html            Política de cookies    ┘
├── 404.html                Página de error
├── robots.txt · site.webmanifest · favicon.ico
├── css/styles.css          Estilos de la página principal
├── css/legal.css           Estilos de las páginas legales y 404
├── js/config.js            ← DATOS PENDIENTES (WhatsApp, analítica, dominio)
├── js/main.js              Interacciones
├── js/consent.js           Aviso de cookies (solo actúa si hay analítica configurada)
├── js/i18n.js · i18n-en.js Cambio de idioma (inglés por defecto, español opcional)
├── assets/                 Imágenes, favicons e imagen para compartir (og-image.jpg)
└── _herramientas/          No se publica (GitHub Pages ignora carpetas con "_")
    ├── preparar-dominio.py Configura el dominio definitivo
    └── datos-negocio.json  Datos reales del negocio para Google (opcional)
```

## Verlo en local

```bash
python3 -m http.server 4321
```

Luego abre http://localhost:4321

## Datos pendientes (no se inventaron)

| Dato | Dónde se completa | Si no se completa |
|---|---|---|
| Número de WhatsApp comercial | `js/config.js` → `whatsapp: '573001234567'` (solo dígitos, con indicativo 57) | El botón "Escríbenos" lleva al formulario |
| Dominio definitivo | `python3 _herramientas/preparar-dominio.py https://www.tudominio.com` | La web no se indexa en Google |
| Titular, NIT o cédula, dirección y teléfono | Páginas legales: buscar `[PENDIENTE` | Las páginas muestran el aviso de dato pendiente |
| Fecha de publicación y plazo de conservación de datos | `privacidad.html`, `aviso-legal.html`, `cookies.html` | Se ve como pendiente |
| ID de Google Analytics 4 (opcional) | `js/config.js` → `ga4Id: 'G-XXXXXXXXXX'` | No hay analítica ni aviso de cookies |
| Datos para Google (teléfono, dirección, horario, redes) | `_herramientas/datos-negocio.json` y volver a ejecutar el script de dominio | Google solo recibe nombre, correo y servicios |

Las políticas legales describen lo que el sitio hace realmente (FormSubmit, Gmail, Google Fonts, WhatsApp,
alojamiento). Son una base: **conviene que las revise un abogado** antes de publicar.

## Formulario de contacto

- Se envía a **FormSubmit** (`formsubmit.co`), que reenvía cada solicitud a `frameworkscol@gmail.com`.
- **Activación (una sola vez):** envía una prueba desde la web publicada; llegará un correo de FormSubmit para
  confirmar. Hasta entonces los envíos no se entregan.
- Después de activarlo, FormSubmit ofrece una dirección alternativa (una cadena aleatoria) para no mostrar el correo
  en el código: reemplázala en `data-endpoint` del formulario en `index.html`.
- Antispam: campo trampa invisible, tiempo mínimo de llenado (3 s), máximo 3 envíos cada 10 minutos por
  navegador, máximo 2 enlaces por mensaje y el filtro propio de FormSubmit.
- Casilla obligatoria de autorización de datos (Ley 1581 de 2012) con enlace a la política de privacidad.

## Cookies y analítica

- Hoy el sitio **no usa cookies**. Solo guarda en el navegador la preferencia de idioma (`fw-lang`) y un contador
  antispam temporal (`fw-sends`). Por eso no se muestra ningún aviso.
- Si se agrega un ID de Google Analytics 4 en `js/config.js`, aparece un aviso para aceptar o rechazar; la
  analítica solo se carga si el visitante acepta, y en el pie aparece "Preferencias de cookies".
  Antes de activarla, actualiza `cookies.html` con las cookies de Google Analytics (`_ga`, `_ga_*`).

## Idiomas

- El HTML está en español; `js/i18n.js` lo cambia al inglés con `js/i18n-en.js`.
- El diccionario completo se mantiene fuera de la web; `i18n-en.js` solo publica las traducciones que se usan.
  Si cambias un texto en español, agrega su traducción (clave = texto español exacto).
- Las páginas legales están solo en español (legislación colombiana).

## Publicar en el dominio definitivo (pasos exactos)

1. Completa los datos `[PENDIENTE` de las páginas legales y, si ya lo tienes, el WhatsApp en `js/config.js`.
2. Compra o define el dominio (por ejemplo `www.tudominio.com`).
3. Desde la carpeta `web/` ejecuta:
   ```bash
   python3 _herramientas/preparar-dominio.py https://www.tudominio.com
   ```
   Esto escribe las URL canónicas, la imagen para compartir, los datos estructurados, `sitemap.xml`,
   `robots.txt`, el archivo `CNAME` y quita el bloqueo de indexación.
4. Sube los cambios a GitHub.
5. En GitHub → repositorio → **Settings → Pages → Custom domain**, escribe el dominio y guarda.
6. En el proveedor del dominio crea los registros DNS que indica GitHub:
   - `www` → registro **CNAME** hacia `frameworkscol.github.io`
   - dominio raíz → registros **A** hacia `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
7. Cuando GitHub muestre el certificado listo, activa **Enforce HTTPS**. GitHub redirige http → https y el dominio raíz ↔ www.
8. Envía una prueba del formulario y confirma la activación de FormSubmit.
9. En **Google Search Console**: agrega el dominio, verifica la propiedad y envía `https://www.tudominio.com/sitemap.xml`.
10. En **Google Business Profile**: crea el perfil con el mismo nombre, correo, teléfono y dirección (o zona de
    servicio) que pusiste en las páginas legales y en `datos-negocio.json`, y agrega la URL del sitio.

### Sobre el alojamiento

GitHub Pages sirve para este sitio: es estático, admite dominio propio, HTTPS gratuito, redirección www y
la página `404.html`. **No** ejecuta código de servidor ni permite cabeceras de seguridad personalizadas;
si más adelante se quieren (CSP, etc.), Cloudflare Pages publica esta misma carpeta sin cambios.

## Imágenes

- En uso: `servicios.jpg`, `nosotros-banda.jpg`, `nosotros-equipo.jpg` (Unsplash), `ads/` (NOIR creada con IA,
  FLUX.1 schnell, Apache 2.0; VOLT y AURA de Unsplash), `arca/` (Unsplash). El logotipo WONTEX es texto (fuente Unbounded) con un cursor dibujado en CSS, no una imagen.
- Las fotos de secciones eliminadas se movieron a `../archivo-fotos-web/` (fuera de la web publicada).
- Espacios ocultos listos para cuando haya contenido real: logos de clientes (`<!-- CLIENTES -->`) y sello
  de alianza (`<!-- SELLO DE ALIANZA -->`). No publiques logos ni sellos que no sean reales.
