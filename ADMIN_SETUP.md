# Cómo activar el panel de administración (`/admin.html`)

El panel necesita 3 cosas configuradas para funcionar: una cuenta de servicio de Google
(para leer/escribir la planilla), dos pestañas nuevas en el Google Sheet, y unas
variables de entorno en Netlify. Son los únicos pasos manuales — el código ya está listo.

## 1) Crear la cuenta de servicio de Google (una sola vez)

1. Entrá a [console.cloud.google.com](https://console.cloud.google.com) con la cuenta de Google que ya usás para la planilla.
2. Creá un proyecto nuevo (o usá uno existente) — el nombre no importa, ej: "Ruta63 Panel".
3. Buscá **"Google Sheets API"** en el buscador de arriba y hacé clic en **"Habilitar"** (Enable).
4. Andá a **"APIs y servicios" → "Credenciales"** → **"Crear credenciales" → "Cuenta de servicio"**.
5. Ponele un nombre (ej: `ruta63-panel`) y creala. No hace falta asignarle ningún rol especial.
6. Entrá a la cuenta de servicio recién creada → pestaña **"Claves" (Keys)** → **"Agregar clave" → "Crear clave nueva"** → formato **JSON** → Crear. Se descarga un archivo `.json` — guardalo, lo vas a necesitar en el paso 3.
7. Copiá el **email** de la cuenta de servicio (termina en `...iam.gserviceaccount.com`, está tanto en la pantalla como dentro del JSON como `client_email`).

## 2) Compartir la planilla y crear las pestañas

1. Abrí tu Google Sheet (la misma que ya usás para las cabañas y el coworking).
2. Botón **"Compartir"** → pegá el email de la cuenta de servicio (paso 1.7) → dejalo como **Editor** → Enviar.
3. Creá una pestaña nueva llamada exactamente **`Precios`**, con estas filas (fila 1 = encabezado):

   | unidad | precio_usd |
   |---|---|
   | Cabaña Arroyo | 85 |
   | Cabaña Lago | 85 |
   | Cabaña Río | 85 |
   | Depto 2 | 80 |
   | Depto 3 | 80 |
   | Depto 4 | 80 |
   | Depto 5 | 80 |
   | Depto 6 | 80 |
   | Depto 7 | 80 |
   | Depto 8 | 80 |
   | Oficina 1 | 80 |
   | Oficina 2 | 80 |

4. Creá otra pestaña llamada exactamente **`Estadisticas`**, con solo el encabezado:

   | fecha_hora | tipo | detalle | referrer |
   |---|---|---|---|

   (esta la va llenando el sitio solo, no hace falta cargar nada más ahí).

## 3) Variables de entorno en Netlify

En el panel de Netlify: **Project configuration → Environment variables → Add a variable**, y cargá estas 6:

| Variable | Valor |
|---|---|
| `ADMIN_USER` | el usuario que quieras para entrar al panel |
| `ADMIN_PASS` | la contraseña que quieras |
| `SESSION_SECRET` | cualquier texto largo y random (ej: generá uno en [1password.com/password-generator](https://1password.com/password-generator) o similar) |
| `SHEET_ID` | el ID de tu planilla — es la parte de la URL entre `/d/` y `/edit`, ej: en `docs.google.com/spreadsheets/d/ABC123XYZ/edit`, el ID es `ABC123XYZ` |
| `GOOGLE_SA_EMAIL` | el email de la cuenta de servicio (paso 1.7) |
| `GOOGLE_SA_KEY` | el valor del campo `private_key` de adentro del archivo `.json` que descargaste (copiarlo completo, con los `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----` incluidos) |

Guardá cada una y volvé a activar los builds (estaban pausados para no gastar créditos) para que Netlify
reconstruya el sitio con las variables nuevas.

## Listo

Entrando a `tudominio.netlify.app/admin.html` ya debería pedir usuario y contraseña, y una vez adentro
mostrar los precios (editables) y las estadísticas (que van a empezar en cero y se van a ir llenando
con las visitas y consultas reales a partir de ese momento).
