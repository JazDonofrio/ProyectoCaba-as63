const { sesionValida } = require('./_session');

exports.handler = async function (event) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ logueado: sesionValida(event.headers) })
  };
};
