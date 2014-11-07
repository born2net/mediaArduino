var test = require('tape');
var wait = require('./');
var co = require('co');

test('waits', function(t) {
  co(function*() {
    t.plan(1);
    var now = Date.now();
    yield wait(100);
    var dt = Date.now() - now;
    t.assert(Math.abs(dt - 100) < 50);
  });
});
