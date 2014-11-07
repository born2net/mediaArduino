/*
 * Maxbotix ultrasonic rangefinder driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require('cylon');

var Maxbotix = module.exports = function Maxbotix() {
  Maxbotix.__super__.constructor.apply(this, arguments);

  this.pin = this.device.pin;
  this.analogValue = 0;

  this.commands = {
    range: this.range,
    rangeCm: this.rangeCm
  };
};

Cylon.Utils.subclass(Maxbotix, Cylon.Driver);

// Public: Stops the driver
//
// Returns null.
Maxbotix.prototype.start = function(callback) {
  Cylon.Logger.debug("Maxbotix on pin " + this.pin + " started");

  this.device.connection.analogRead(this.pin, function(err, readVal) {
    this.analogValue = readVal;
    this.device.emit('range', this.range());
    this.device.emit('rangeCm', this.rangeCm());
  }.bind(this));

  callback();
};

Maxbotix.prototype.halt = function(callback) {
  callback();
};

// Public: Returns the distance measured by the sonar in inches.
//
// Returns number.
Maxbotix.prototype.range = function() {
  return (254.0 / 1024.0) * 2.0 * this.analogValue;
};

// Public: Returns the distance measured by the sonar in cm.
//
// Returns number.
Maxbotix.prototype.rangeCm = function() {
  return (this.analogValue / 2.0) * 2.54;
};
