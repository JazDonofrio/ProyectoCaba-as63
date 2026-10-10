const crypto = require('crypto');
const { crearCookie } = require('./_session');

// Límite simple de intentos fallidos por IP (en memoria del proceso).
// No es a prueba de balas (Netlify puede repartir pedidos entre varias
// instancias), pero frena un script básico de prueba-y-error.
const intentos = new Map(); // ip -> { count, resetAt }
const MAX_INTENTOS = 8;
const VENTANA_MS = 10 * 60 * 1000; // 10 minutos

function compararSeguro(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const ip = (event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || 'desconocida');
  const ahora = Date.now();
  const registro = intentos.get(ip);
  if (registro && registro.resetAt > ahora && registro.count >= MAX_INTENTOS) {
    return { statusCode: 429, body: JSON.stringify({ error: 'Demasiados intentos. Probá de nuevo en unos minutos.' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { body = {}; }
  const { usuario, clave } = body;

  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;
  if (!ADMIN_USER || !ADMIN_PASS) {
    return { statusCode: 500, body: JSON.stringify({ error: 'El panel no está configurado todavía (faltan variables de entorno).' }) };
  }

  const ok = compararSeguro(usuario || '', ADMIN_USER) && compararSeguro(clave || '', ADMIN_PASS);

  if (!ok) {
    const nuevo = (registro && registro.resetAt > ahora) ? { count: registro.count + 1, resetAt: registro.resetAt } : { count: 1, resetAt: ahora + VENTANA_MS };
    intentos.set(ip, nuevo);
    return { statusCode: 401, body: JSON.stringify({ error: 'Usuario o contraseña incorrectos.' }) };
  }

  intentos.delete(ip);
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': crearCookie() },
    body: JSON.stringify({ ok: true })
  };
};
