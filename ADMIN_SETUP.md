# Cómo activar el panel de administración (`/admin.html`)

Ya no hace falta Google Cloud ni ninguna cuenta de servicio — todo se resuelve con
un script adentro de la misma planilla (Google Apps Script) más unas variables en Netlify.

## 1) Pegar el script en la planilla

1. Abrí tu Google Sheet (la misma de las cabañas y el coworking).
2. Arriba, **Extensions → Apps Script** (si no lo ves, puede decir "Extensiones → Apps Script").
3. Se abre un editor con un archivo `Código.gs` vacío (o con una función `myFunction` de ejemplo). Borrá todo lo que haya y pegá el contenido completo del archivo **`apps_script.gs`** que te dejé en el repo.
4. En la línea `var SECRET = 'PONER-ACA-UN-TEXTO-LARGO-E-INVENTADO-123';`, cambiá ese texto por cualquier contraseña larga inventada por vos. Copiala, la vas a necesitar en el paso 3.
5. Guardá (ícono de disquete o Ctrl+S).

## 2) Publicarlo como Web App

1. Arriba a la derecha, botón **"Deploy" → "New deployment"**.
2. Al lado de "Select type", tocá el engranaje ⚙️ y elegí **"Web app"**.
3. En "Who has access" elegí **"Anyone"** (esto permite que el sitio lo llame; la contraseña del paso 1.4 es la que lo protege igual).
4. **"Deploy"**. La primera vez te va a pedir autorizar permisos — es tu propia cuenta de Google pidiéndote confirmar que vos autorizaste el script, nada raro: "Authorize access" → elegís tu cuenta → "Advanced" → "Go to (nombre del proyecto)" → "Allow".
5. Te va a dar una **URL que termina en `/exec`** — copiala, es la que necesitás para el paso 3.

## 3) Crear las pestañas en la planilla

Igual que antes, dos pestañas nuevas:

- **`Precios`**, con:

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

- **`Estadisticas`**, solo con el encabezado:

  | fecha_hora | tipo | detalle | referrer |
  |---|---|---|---|

## 4) Variables de entorno en Netlify

**Project configuration → Environment variables → Add a variable**, cargá estas 5:

| Variable | Valor |
|---|---|
| `ADMIN_USER` | el usuario que quieras para entrar al panel |
| `ADMIN_PASS` | la contraseña que quieras |
| `SESSION_SECRET` | cualquier texto largo y random (distinto al del paso 1) |
| `APPS_SCRIPT_URL` | la URL que copiaste en el paso 2.5 (termina en `/exec`) |
| `APPS_SCRIPT_SECRET` | el mismo texto que pusiste en `SECRET` dentro del script (paso 1.4) |

Guardá, reactivá los builds (estaban pausados) y esperá a que termine el deploy.

## Listo

Entrando a `tudominio.netlify.app/admin.html` ya debería pedir usuario y contraseña, y mostrar
precios editables y estadísticas (arrancan en cero, se van llenando solas con el uso real del sitio).

## Si en algún momento preferís volver a la versión con Google Cloud

No hace falta — esta versión hace exactamente lo mismo. La dejamos de lado directamente.
