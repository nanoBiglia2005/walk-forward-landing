# Walk Forward Landing

Landing page para hosting en WNPower.

## Arquitectura

- **Export estático** (`output: "export"` en `next.config.ts`): el sitio se compila a HTML/CSS/JS estáticos con `npm run build`, generando la carpeta `out/`. No hay servidor Next.js ni API routes en producción.
- **Sin backend propio**: casi toda la app es frontend. La única excepción es el formulario de contacto, que enviará el mail al cliente a través de un servicio externo (por ejemplo Formspree, Web3Forms o EmailJS) llamado directamente desde el navegador — pendiente de elegir e integrar.
- Las imágenes usan `images.unoptimized: true` porque el export estático no soporta el optimizador de imágenes de Next.js.

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
