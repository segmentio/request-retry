
var _        = require('underscore'),
    express  = require('express'),
    should   = require('should');


var method    = 'post'
  , host      = 'http://localhost'
  , port      = 3000
  , respondOn = 3
  , timeout   = 1000
  , route     = '/'
  , expected  = 'hello world!';


function createServer (test) {
  var app  = express()
    , reqs = 0
    , server;

  app[method](route, function (req, res) {
    reqs += 1;
    var wait = reqs > respondOn ? 0 : timeout + (timeout / 2);

    setTimeout(function () { res.send(expected); }, wait);
  });

  before(function (done) { server = app.listen(port, done); });

  test();

  after(function (done) { server.close(done); });
}

describe('requests', function () {

  describe('recovery', function () {

    createServer(function () {

      it ('should recover from retries', function (done) {

        this.timeout((timeout * respondOn) + 1000);

        var request = require('..')({
          retries: respondOn,
          backoff: function (state) { return 10; }
        });

        var req = {
          url     : host + ':' + port + route,
          timeout : timeout
        };

        request[method](req, function (err, response, body) {
          should.not.exist(err);
          should.exist(response);
          should.exist(body);

          should.equal(body, expected);

          done(err);
        });
      });
    });
  });

  describe('timeout', function () {

    createServer(function () {

      it ('should timeout', function (done) {

        this.timeout(timeout * respondOn + 1000);

        var request = require('..')({
          retries: 1,
          backoff: function (state) { return 10; }
        });

        var req = {
          url     : host + ':' + port + route,
          timeout : timeout
        };

        request[method](req, function (err, response, body) {
          should.exist(err);
          should.equal(err.code, 'ETIMEDOUT');
          done();
        });
      });
    });
  });

});
