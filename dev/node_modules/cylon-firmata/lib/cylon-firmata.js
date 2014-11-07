/*
 * cylon-firmata
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require("cylon");

var Adaptor = require("./firmata");

var GPIO = require("cylon-gpio"),
    I2C = require("cylon-i2c");

module.exports = {
  adaptor: function(args) {
    return new Adaptor(args);
  },

  register: function(robot) {
    Cylon.Logger.debug("Registering Firmata adaptor for " + robot.name);
    robot.registerAdaptor('cylon-firmata', 'firmata');

    GPIO.register(robot);
    I2C.register(robot);
  }
};
