# co-sleep

setTimeout that works with the [co](https://github.com/visionmedia/co)
generator framework

[![build status](https://secure.travis-ci.org/eugeneware/co-sleep.png)](http://travis-ci.org/eugeneware/co-sleep)

## Installation

This module is installed via npm:

``` bash
$ npm install co-sleep
```

## Example Usage

``` js
var sleep = require('co-sleep');
var co = require('co');

co(function *() {
  var now = Date.now();
  // wait for 1000 ms
  yield sleep(1000);
  expect(Date.now() - now).to.not.be.below(1000);
})();
```
