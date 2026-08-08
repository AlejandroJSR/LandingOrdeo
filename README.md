# Ordeo — landing page

Sitio estático (HTML/CSS/JS puro, sin build) para presentar el proyecto: qué es, cómo funciona, el roadmap, y un formulario para solicitar demo.

## Ver en local

Abrí `index.html` directo en el navegador, o para que las rutas relativas funcionen igual que en producción:

```bash
npx serve .
```

## Subir a Vercel

**Opción rápida (sin GitHub), desde esta carpeta:**

```bash
npm install -g vercel
vercel
```

Te va a preguntar por el proyecto (aceptá los valores por defecto, es un sitio estático) y al final te da una URL ya publicada. Para volver a publicar después de un cambio: `vercel --prod`.

**Opción con GitHub (recomendada a mediano plazo):** subí esta carpeta como un repo nuevo en GitHub, y en [vercel.com/new](https://vercel.com/new) importalo — Vercel detecta que es un sitio estático solo, sin configuración extra. Cada push a la rama principal lo vuelve a publicar solo.

## El formulario de demo

Hoy no tiene backend propio: al enviar, arma un `mailto:` con los datos precargados hacia `ordeoapp@gmail.com` y abre el cliente de correo del visitante (`script.js`). Funciona sin cuentas ni configuración, pero depende de que la persona tenga un cliente de correo configurado en su navegador.

Cuando quieras algo más prolijo (que llegue un mail solo, sin que el visitante tenga que apretar "enviar" en su propio correo), las dos opciones más simples:

- **Formspree** (gratis para volumen bajo): creás un formulario en [formspree.io](https://formspree.io), y cambiás el `<form>` de `index.html` para que apunte a esa URL en vez de usar el JS de `mailto`.
- **Función serverless de Vercel + Resend**: requiere convertir esto en un proyecto con `api/` (o migrar a Next.js) y una cuenta de [resend.com](https://resend.com) para mandar el mail desde el servidor.

## Capturas del producto

Las imágenes reales están en `assets/` (`modal.png` en el hero; `pedidos.png`, `mesas1.png` y `recetas.png` en la sección "Así se ve de verdad"). Son de una sucursal con marca en naranja, distinta al dorado de esta landing — es intencional, son capturas reales, no se retocan para que combinen con la web.

Para cambiar o sumar una captura: agregá el archivo a `assets/`, y en `index.html` buscá el bloque `.device` correspondiente y actualizá el `src` del `<img>`.
