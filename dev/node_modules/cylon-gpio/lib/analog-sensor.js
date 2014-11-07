/*
 * Analog Sensor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require('cylon');

var AnalogSensor = module.exports = function AnalogSensor(opts) {
  AnalogSensor.__super__.constructor.apply(this, arguments);
  var extraParams = opts.extraParams || {};

  this.pin = this.device.pin;
  this.upperLimit = extraParams.upperLimit || 256;
  this.lowerLimit = extraParams.lowerLimit || 0;
  this.analogVal = null;

  this.commands = {
    analog_read: this.analogRead
  };
};

Cylon.Utils.subclass(AnalogSensor, Cylon.Driver);

AnalogSensor.prototype.analogRead = function() {
  return this.analogVal;
};

// Public: Starts the driver
//
// callback - params
//
// Returns null.
AnalogSensor.prototype.start = function(callback) {
  this.connection.analogRead(this.pin, function(err, readVal) {
    this.analogVal = readVal;
    this.device.emit('analogRead', readVal);

    if (readVal >= this.upperLimit) {
      this.device.emit('upperLimit', readVal);
    } else if (readVal <= this.lowerLimit) {
      this.device.emit('lowerLimit', readVal);
    }
  }.bind(this));

  callback();
};

AnalogSensor.prototype.halt = function(callback) {
  callback();
};
