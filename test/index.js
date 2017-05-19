
var express = require('express')
  , request = require('..')()
  , should  = require('should');


describe('request-retry', function () {

  var methods = ['get', 'post', 'put']
    , host    = 'http://localhost'
    , port    = 3000;

  describe('#request', function () {

    var app      = express()
      , route    = '/'
      , expected = 'hello world'
      , server;

    methods.forEach(function (method) {
      app[method](route, function (req, res) {
        res.send(expected);
      });
    });

    before(function (done) { server = app.listen(port, done); });

    methods.forEach(function (method) {

      it ('should be able to make ' + method + ' requests', function (done) {

        var req = { url: host + ':' + port + route };

        request[method](req, function (err, response, body) {
          should.not.exist(err);
          should.exist(response);
          should.exist(body);

          should.equal(body, expected);

          done(err);
        });
      });
    });

    // no clue what's going on here
    it.skip('should not throw on bad unicode', function (done) {
      var qs = String.fromCharCode(0xDC00);
      var req = {
        qs: qs,
        url: 'http://google.com'
      };
      request.get(req, function (err, res) {
        should.exist(err);
        err.message.should.eql('URI malformed');
        done();
      });
    });

    after(function (done) { server.close(done); });
  });

});
