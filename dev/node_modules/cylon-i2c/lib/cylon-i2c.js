/*
 * cylon-gpio
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/
'use strict';

var Cylon = require('cylon');
var BlinkM = require('./blinkm');
var Hmc6352 = require('./hmc6352');
var Mpl115A2 = require('./mpl115a2');
var Bmp180 = require('./bmp180');
var Mpu6050 = require('./mpu6050');
var LCD = require('./lcd');
var LSM9DS0G = require('./lsm9ds0g');
var LSM9DS0XM = require('./lsm9ds0xm');

module.exports = {
  driver: function(opts) {
    switch (opts.name) {
      case 'blinkm':
        return new BlinkM(opts);
      case 'hmc6352':
        return new Hmc6352(opts);
      case 'mpl115a2':
        return new Mpl115A2(opts);
      case 'bmp180':
        return new Bmp180(opts);
      case 'mpu6050':
        return new Mpu6050(opts);
      case 'lcd':
        return new LCD(opts);
      case 'lsm9ds0g':
        return new LSM9DS0G(opts);
      case 'lsm9ds0xm':
        return new LSM9DS0XM(opts);
      default:
        return null;
    }
  },

  register: function(robot) {
    Cylon.Logger.debug("Registering i2c BlinkM driver for " + robot.name);
    robot.registerDriver('cylon-i2c', 'blinkm');

    Cylon.Logger.debug("Registering i2c HMC6352 driver for " + robot.name);
    robot.registerDriver('cylon-i2c', 'hmc6352');

    Cylon.Logger.debug("Registering i2c MPL115A2 driver for " + robot.name);
    robot.registerDriver('cylon-i2c', 'mpl115a2');

    Cylon.Logger.debug("Registering i2c BMP180 driver for " + robot.name);
    robot.registerDriver('cylon-i2c', 'bmp180');

    Cylon.Logger.debug("Registering i2c MPU6050 driver for " + robot.name);
    robot.registerDriver('cylon-i2c', 'mpu6050');

    Cylon.Logger.debug("Registering i2c LCD driver for " + robot.name);
    robot.registerDriver('cylon-i2c', 'lcd');

    Cylon.Logger.debug("Registering i2c LSM9DS0G driver for " + robot.name);
    robot.registerDriver('cylon-i2c', 'lsm9ds0g');

    Cylon.Logger.debug("Registering i2c LSM9DS0XM driver for " + robot.name);
    robot.registerDriver('cylon-i2c', 'lsm9ds0xm');
  }
};
