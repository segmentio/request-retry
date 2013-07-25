
module.exports = [econnreset, etimedout, eaddrinfo, esockettimedout, gateway];


function econnreset (err, res, body) {
  return err && err.code === 'ECONNRESET';
}


function etimedout (err, res, body) {
  return err && err.code === 'ETIMEDOUT';
}


function eaddrinfo (err, res, body) {
  return err && err.code === 'EADDRINFO';
}


function esockettimedout (err, res, body) {
  return err && err.code === 'ESOCKETTIMEDOUT';
}


function gateway (err, res, body) {
  return res && res.statusCode === 503;
}