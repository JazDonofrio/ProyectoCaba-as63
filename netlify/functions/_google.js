// Módulo compartido: habla con la API de Google Sheets usando una cuenta de
// servicio (sin paquetes externos, solo módulos propios de Node).
const crypto = require('crypto');

function b64url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

let cachedToken = null; // { token, exp }

async function getAccessToken() {
  if (cachedToken && cachedToken.exp > Date.now() / 1000 + 30) {
    return cachedToken.token;
  }
  const email = process.env.GOOGLE_SA_EMAIL;
  const rawKey = process.env.GOOGLE_SA_KEY;
  if (!email || !rawKey) throw new Error('Faltan GOOGLE_SA_EMAIL o GOOGLE_SA_KEY en las variables de entorno.');
  const privateKey = rawKey.includes('BEGIN PRIVATE KEY') ? rawKey.replace(/\\n/g, '\n') : Buffer.from(rawKey, 'base64').toString('utf8');

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  };
  const signingInput = b64url(JSON.stringify(header)) + '.' + b64url(JSON.stringify(claim));
  const signature = crypto.sign('RSA-SHA256', Buffer.from(signingInput), privateKey).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const jwt = signingInput + '.' + signature;

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') + '&assertion=' + jwt
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error('Google auth falló: ' + JSON.stringify(data));
  cachedToken = { token: data.access_token, exp: now + data.expires_in };
  return data.access_token;
}

async function sheetsFetch(path, opts) {
  const token = await getAccessToken();
  const sheetId = process.env.SHEET_ID;
  if (!sheetId) throw new Error('Falta SHEET_ID en las variables de entorno.');
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}${path}`;
  const resp = await fetch(url, {
    ...opts,
    headers: { ...(opts && opts.headers), Authorization: `Bearer ${token}` }
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error('Sheets API falló: ' + JSON.stringify(data));
  return data;
}

// Devuelve las filas de una pestaña como arrays (incluye el encabezado en la fila 0)
async function getRows(tabName) {
  const data = await sheetsFetch(`/values/${encodeURIComponent(tabName)}`, { method: 'GET' });
  return data.values || [];
}

// Agrega una fila al final de una pestaña
async function appendRow(tabName, row) {
  await sheetsFetch(`/values/${encodeURIComponent(tabName)}:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] })
  });
}

// Sobrescribe un rango (ej: "Precios!A2:B13"). `rows` es un array de filas (cada fila, un array).
async function setRange(range, rows) {
  await sheetsFetch(`/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: rows })
  });
}

module.exports = { getRows, appendRow, setRange };
