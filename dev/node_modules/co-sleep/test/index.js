var expect = require('expect.js'),
    co = require('co'),
    sleep = require('..');

describe('co-sleep', function() {
  it('should sleep for ms', function(done) {
    co(function *() {
      var now = Date.now();
      yield sleep(1000);
      expect(Date.now() - now).to.not.be.below(1000);
    })();
    done();
  });
});
