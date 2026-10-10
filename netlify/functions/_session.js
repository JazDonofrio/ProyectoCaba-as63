// Cookie de sesión firmada con HMAC — no hace falta guardar sesiones en ningún lado,
// la propia cookie se autovalida (nadie puede fabricar una sin conocer SESSION_SECRET).
const crypto = require('crypto');

const DURACION_HORAS = 12;
const COOKIE_NAME = 'r63_admin';

function sign(value) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('Falta SESSION_SECRET en las variables de entorno.');
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

function crearCookie() {
  const exp = Date.now() + DURACION_HORAS * 3600 * 1000;
  const payload = String(exp);
  const firma = sign(payload);
  const valor = `${payload}.${firma}`;
  return `${COOKIE_NAME}=${valor}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${DURACION_HORAS * 3600}`;
}

function cookieDeLogout() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

function sesionValida(headers) {
  const cookieHeader = (headers && (headers.cookie || headers.Cookie)) || '';
  const match = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith(COOKIE_NAME + '='));
  if (!match) return false;
  const valor = match.slice(COOKIE_NAME.length + 1);
  const [payload, firma] = valor.split('.');
  if (!payload || !firma) return false;
  let firmaEsperada;
  try { firmaEsperada = sign(payload); } catch (e) { return false; }
  const ok = firma.length === firmaEsperada.length && crypto.timingSafeEqual(Buffer.from(firma), Buffer.from(firmaEsperada));
  if (!ok) return false;
  return Number(payload) > Date.now();
}

module.exports = { crearCookie, cookieDeLogout, sesionValida };
