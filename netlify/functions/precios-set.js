const { sesionValida } = require('./_session');
const { setRange } = require('./_google');

exports.handler = async function (event) {
  if (!sesionValida(event.headers)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'No autorizado' }) };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { body = {}; }
  const precios = Array.isArray(body.precios) ? body.precios : [];
  if (!precios.length) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Sin datos para guardar' }) };
  }
  const filas = precios.map(p => [String(p.unidad || ''), String(p.precio || '')]);
  try {
    await setRange(`Precios!A2:B${1 + filas.length}`, filas);
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: String(e.message || e) }) };
  }
};
