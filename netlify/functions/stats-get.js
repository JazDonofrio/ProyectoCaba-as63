const { sesionValida } = require('./_session');
const { getRows } = require('./_sheets');

exports.handler = async function (event) {
  if (!sesionValida(event.headers)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'No autorizado' }) };
  }
  try {
    const filas = await getRows('Estadisticas'); // [fecha_iso, tipo, detalle, referrer]
    const eventos = filas.slice(1).map(f => ({ fecha: f[0], tipo: f[1], detalle: f[2] || '', referrer: f[3] || '' }));

    const hace7 = Date.now() - 7 * 86400000;
    const hace30 = Date.now() - 30 * 86400000;

    const contar = (lista, filtro) => lista.filter(filtro).length;
    const esTipo = t => e => e.tipo === t;
    const desde = ms => e => new Date(e.fecha).getTime() >= ms;

    const porPagina = {};
    eventos.filter(esTipo('pageview')).forEach(e => { porPagina[e.detalle] = (porPagina[e.detalle] || 0) + 1; });

    const resumen = {
      visitas_total: contar(eventos, esTipo('pageview')),
      visitas_7d: contar(eventos.filter(esTipo('pageview')), desde(hace7)),
      visitas_30d: contar(eventos.filter(esTipo('pageview')), desde(hace30)),
      consultas_cabana_total: contar(eventos, esTipo('consulta_cabana')),
      consultas_cabana_30d: contar(eventos.filter(esTipo('consulta_cabana')), desde(hace30)),
      consultas_coworking_total: contar(eventos, esTipo('consulta_coworking')),
      consultas_coworking_30d: contar(eventos.filter(esTipo('consulta_coworking')), desde(hace30)),
      por_pagina: porPagina,
      ultimos_eventos: eventos.slice(-20).reverse()
    };

    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(resumen) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: String(e.message || e) }) };
  }
};
