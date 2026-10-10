const { crearCookie } = require('./_session');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { body = {}; }
  const { usuario, clave } = body;

  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;
  if (!ADMIN_USER || !ADMIN_PASS) {
    return { statusCode: 500, body: JSON.stringify({ error: 'El panel no está configurado todavía (faltan variables de entorno).' }) };
  }

  if (usuario !== ADMIN_USER || clave !== ADMIN_PASS) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Usuario o contraseña incorrectos.' }) };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': crearCookie() },
    body: JSON.stringify({ ok: true })
  };
};
