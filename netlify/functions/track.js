const { appendRow } = require('./_sheets');

const TIPOS_VALIDOS = ['pageview', 'consulta_cabana', 'consulta_coworking'];

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { body = {}; }
  const tipo = TIPOS_VALIDOS.includes(body.tipo) ? body.tipo : null;
  if (!tipo) {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: 'tipo inválido' }) };
  }
  const detalle = String(body.detalle || '').slice(0, 120);
  const referrer = String(body.referrer || '').slice(0, 200);
  const fecha = new Date().toISOString();

  try {
    await appendRow('Estadisticas', [fecha, tipo, detalle, referrer]);
  } catch (e) {
    return { statusCode: 200, headers: cors(), body: JSON.stringify({ ok: false }) };
  }
  return { statusCode: 200, headers: cors(), body: JSON.stringify({ ok: true }) };
};

function cors() {
  return { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
}
