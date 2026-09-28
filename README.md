# Walk Forward Landing

Landing page para hosting en WNPower.

## Arquitectura

- **Export estático** (`output: "export"` en `next.config.ts`): el sitio se compila a HTML/CSS/JS estáticos con `npm run build`, generando la carpeta `out/`. No hay servidor Next.js ni API routes en producción.
- **Sin backend propio**: casi toda la app es frontend. La única excepción es el formulario de contacto, que enviará el mail al cliente a través de un servicio externo (por ejemplo Formspree, Web3Forms o EmailJS) llamado directamente desde el navegador — pendiente de elegir e integrar.
- Las imágenes usan `images.unoptimized: true` porque el export estático no soporta el optimizador de imágenes de Next.js.

## Estructura

- `src/content/site.ts`: todos los textos, listas (servicios, marcas, clientes) y enlaces del sitio.
- `src/app/globals.css`: tokens del diseño de Figma (colores, estilos de texto, márgenes) y animaciones.
- `src/components/sections/`: una sección por archivo (hero, servicios, marcas, clientes, contacto).
- `src/components/trace/`: la pista de circuito. Cada sección describe su tramo a partir de la posición real de su contenido (`data-a="…"`), así se adapta a cualquier ancho. La pista se dibuja con el scroll y respeta `prefers-reduced-motion`.
- Layout desktop desde 1280 px (`lg`, redefinido en `globals.css`); por debajo, columna única como el diseño mobile.

## Pendientes antes de publicar

- **Formulario de contacto**: hoy valida y muestra la confirmación, pero no envía nada. Conectar el servicio de mail en `src/lib/inquiry.ts`.
- **WhatsApp**: los botones no tienen enlace. Para activarlos, completar `links.whatsapp` en `src/content/site.ts` (por ejemplo `https://wa.me/5491122945551`).
- **Carruseles**: muestran los nombres; faltan los logos de marcas y clientes.

## Desarrollo

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en el navegador.

## Build de producción (export estático)

```bash
npm run build
```

Esto genera la carpeta `out/` con los archivos estáticos listos para subir a WNPower.
