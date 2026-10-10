const { sesionValida } = require('./_session');
const { getRows } = require('./_google');

exports.handler = async function (event) {
  if (!sesionValida(event.headers)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'No autorizado' }) };
  }
  try {
    const filas = await getRows('Precios'); // [ [unidad, precio_usd], ... ] (fila 0 = encabezado)
    const precios = filas.slice(1).map(f => ({ unidad: f[0] || '', precio: f[1] || '' }));
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ precios }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: String(e.message || e) }) };
  }
};
