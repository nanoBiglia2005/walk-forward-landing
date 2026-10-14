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
- **Carruseles**: GOP, HP y Belgrano Cargas y Logística se muestran como texto hasta tener su logo y sitio. Para sumarlos: archivo en `public/logos/` y `logo` + `url` en `src/content/site.ts`.

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

Esto genera la carpeta `out/` con los archivos estáticos.

## Vista previa en GitHub Pages (temporal)

Mientras el cliente revisa la página, el sitio se publica en `https://nanobiglia2005.github.io/walk-forward-landing/` con cada push a `master` (workflow en `.github/workflows/deploy-pages.yml`). Requiere, una sola vez, en GitHub: Settings → Pages → Source → "GitHub Actions".

GitHub Pages sirve el sitio bajo `/walk-forward-landing`, por eso `src/lib/base-path.ts` define `BASE_PATH`, que usan `next.config.ts` (`basePath`) y las imágenes.

## Pasar a WNPower

1. En `src/lib/base-path.ts`, cambiar `BASE_PATH` a `""` (WNPower sirve el sitio en la raíz del dominio).
2. Borrar `.github/workflows/deploy-pages.yml` si se deja de usar GitHub Pages.
3. `npm run build` y comprimir el **contenido** de `out/` (en PowerShell: `Compress-Archive -Path out\* -DestinationPath walk-forward.zip`).
4. En el cPanel de WNPower: Administrador de archivos → `public_html` → subir el zip → Extraer, de modo que `index.html` quede directamente en `public_html`.
