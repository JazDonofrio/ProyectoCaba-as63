# Cabañas & Apart Ruta 63 — sitio web

Sitio de muestra para **Cabañas & Apart Ruta 63** (Villa Lago Meliquina, Neuquén), armado como pieza de venta de [Zenith](https://somos-zenith-arg.netlify.app).

## Estructura

```
├── index.html       → sitio principal (home, cabañas, apart, coworking, opiniones, tarifas, cómo llegar, contacto)
├── coworking.html    → página de reserva de las oficinas de coworking
└── assets/           → logo en versión horizontal y cuadrada (SVG editable + PNG transparente)
```

Los dos `.html` son autocontenidos (CSS, fuentes e imágenes embebidas), así que **alcanza con subir los dos archivos al mismo hosting, en la misma carpeta**, para que funcionen y se enlacen entre sí correctamente.

## Cómo publicarlo (Netlify)

1. Arrastrar la carpeta (o conectar este repo) a [Netlify](https://app.netlify.com) → "Deploy manually" o "Import from Git".
2. No hace falta build command ni carpeta de publish especial: son archivos HTML planos en la raíz.
3. Conectar el dominio propio (`ruta63.com.ar`) una vez verificado que todo funciona en la URL temporal de Netlify.

## Asistente de disponibilidad (calendario + Google Sheets)

Tanto `index.html` (cabañas) como `coworking.html` (oficinas) tienen un calendario que bloquea visualmente las fechas ya ocupadas. Leen esos datos desde una Google Sheet publicada como CSV — **sin necesidad de backend ni base de datos**.

### Cómo conectarlo

1. Crear una Google Sheet con una pestaña por cada sistema:
   - **Cabañas:** columnas `tipo | desde | hasta` (tipo = `Cabaña` o `Apart`, fechas en formato `AAAA-MM-DD`).
   - **Coworking:** columnas `oficina | desde | hasta` (oficina = `Oficina 1` u `Oficina 2`).
2. En Google Sheets: **Archivo → Compartir → Publicar en la Web** → elegir la pestaña correspondiente (no "Documento completo") → formato **CSV** → Publicar.
3. Copiar el link que termina en `output=csv` y pegarlo en la línea `SHEET_CSV_URL` de cada archivo:
   - En `index.html`, buscar `SHEET_CSV_URL` dentro del script del asistente de cabañas (`<!-- ASISTENTE DE DISPONIBILIDAD -->`).
   - En `coworking.html`, buscar `SHEET_CSV_URL` cerca del final del archivo.

Mientras ese link esté vacío, o si falla la carga, el calendario usa datos de ejemplo (dejados a propósito para poder mostrar la demo funcionando).

> **Nota:** la lectura de la planilla solo funciona una vez que el sitio está en un hosting real (Netlify, por ejemplo) — los entornos de vista previa en sandbox (como el de Claude) bloquean pedidos a sitios externos por seguridad.

## Reservas reales

Los botones "Reservar ahora" del sitio de cabañas apuntan al sistema real de reservas (`https://www.ruta63.com.ar/book-a-room`, Wix Hotels). El calendario propio es un complemento para responder disponibilidad rápido desde el chat del sitio — la reserva final siempre se cierra en el sistema oficial, para evitar dobles reservas.

## Logo

En `/assets` están las dos versiones (horizontal para encabezados/membretes, cuadrada para redes sociales/favicon), cada una en SVG editable y PNG con fondo transparente.
