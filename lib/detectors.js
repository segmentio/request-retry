
var econnreset = function (err, response, body) {
  return (err && err.code === 'ECONNRESET');
};

var etimedout = function (err, response, body) {
  return (err && err.code === 'ETIMEDOUT');
};

var eaddrinfo = function (err, response, body) {
  return (err && err.code === 'EADDRINFO');
};

var gateway = function (err, response, body) {
  return (response && response.statusCode === 503);
};

module.exports = [econnreset, etimedout, eaddrinfo, gateway];