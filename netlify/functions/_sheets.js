// Módulo compartido: habla con el Google Apps Script publicado como Web App
// (ver apps_script.gs). Mucho más simple que la API de Google Cloud: no hace
// falta ninguna cuenta de servicio ni credenciales descargadas.

function baseUrl() {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) throw new Error('Falta APPS_SCRIPT_URL en las variables de entorno.');
  return url;
}
function secret() {
  const s = process.env.APPS_SCRIPT_SECRET;
  if (!s) throw new Error('Falta APPS_SCRIPT_SECRET en las variables de entorno.');
  return s;
}

async function llamar(params, opts) {
  const qs = new URLSearchParams({ secret: secret(), ...params }).toString();
  const resp = await fetch(`${baseUrl()}?${qs}`, opts);
  const data = await resp.json();
  if (data.error) throw new Error('Apps Script: ' + data.error);
  return data;
}

// Devuelve las filas de una pestaña como arrays (incluye el encabezado en la fila 0)
async function getRows(tab) {
  const data = await llamar({ action: 'get', tab });
  return data.values || [];
}

// Agrega una fila al final de una pestaña
async function appendRow(tab, row) {
  await llamar({ action: 'append' }, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tab, row })
  });
}

// Sobrescribe varias filas seguidas a partir de startRow (ej: startRow=2 → empieza en la fila 2)
async function setRows(tab, startRow, rows) {
  await llamar({ action: 'setRows' }, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tab, startRow, rows })
  });
}

module.exports = { getRows, appendRow, setRows };
