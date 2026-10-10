const { cookieDeLogout } = require('./_session');

exports.handler = async function () {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookieDeLogout() },
    body: JSON.stringify({ ok: true })
  };
};
