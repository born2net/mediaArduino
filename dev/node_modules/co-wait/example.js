
var wait = require('./');
var co = require('co');

co(function* (){
  console.log(Date.now());
  yield wait(1000);
  console.log(Date.now());
});
