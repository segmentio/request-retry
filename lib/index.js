
var debug     = require('debug')('request-retry')
  , defaults  = require('defaults')
  , detectors = require('./detectors')
  , request   = require('request');


module.exports = function (options) {
  return new Requester(options);
};



function Requester (options) {
  options || (options = {});

  this.options = defaults(options, {
    retries   : 0,
    detectors : detectors
  });

  var methods = ['GET', 'POST', 'PUT', 'HEAD'];

  var self = this;
  methods.forEach(function (method) {
    self[method.toLowerCase()] = function (req, callback) {
      req.method = method;
      return self.request(req, callback);
    };
  });
}


/**
 * Returns whether the request should be retried.
 * @param  {Error}    err      Request error
 * @param  {Response} response Request response
 * @param  {object}   body     Request body
 * @return {boolean}           Whether the request should be retried
 */
Requester.prototype._should_retry = function (err, res, body) {
  return this.options.detectors.some(function (detector) {
    return detector(err, res, body);
  });
};


/**
 * Make a request-like request
 * @param  {Object}   req
 * @param  {Object}   state
 * @param  {Function} callback (err, res, body)
 */
Requester.prototype.request = function (req, state, callback) {

  var self    = this
    , options = this.options
    , retries = options.retries;

  if (typeof state === 'function') {
    callback = state;
    state = null;
  }

  state = defaults(state || {}, { tries: 0 });

  var method = req.method.toLowerCase();

  try {
    request[method](req, function (err, res, body) {

      if (state.tries >= retries || !self._should_retry(err, res, body)) {
        return callback(err, res, body);
      }

      debug('Retrying %s request... try: %s', method, state.tries);

      // add the amount of retry attempts
      state.tries += 1;

      setTimeout(function () {
        self.request(req, state, callback);
      }, 200);
    });
  } catch (err) {
    return callback(err);
  }
};