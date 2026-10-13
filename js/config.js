/* Frame Works · configuración del sitio
   =====================================================================
   Aquí se completan los datos que todavía están PENDIENTES. No hace falta
   tocar ningún otro archivo para activarlos.

   - whatsapp:  número comercial en formato internacional, SOLO dígitos,
                sin "+", espacios ni guiones. Ejemplo de formato (no real):
                "57" (Colombia) + número de 10 dígitos → "573001234567".
                Vacío = el botón "Escríbenos" lleva al formulario de contacto.
   - ga4Id:     identificador de Google Analytics 4 ("G-XXXXXXXXXX").
                Vacío = no se carga ninguna analítica ni aparece el aviso
                de cookies. Con un ID, la analítica solo se activa si el
                visitante la acepta en el aviso.
   - siteUrl:   dominio definitivo. No lo edites a mano: lo escribe
                _herramientas/preparar-dominio.py junto con las URL
                canónicas, el sitemap y robots.txt.
   ===================================================================== */
window.FW_CONFIG = {
  whatsapp: '',          // PENDIENTE: número comercial de WhatsApp
  whatsappMessage: 'Hola, quiero información sobre los servicios de Frame Works.',
  ga4Id: '',             // PENDIENTE (opcional): ID de Google Analytics 4
  siteUrl: ''            // PENDIENTE: se completa con _herramientas/preparar-dominio.py
};
