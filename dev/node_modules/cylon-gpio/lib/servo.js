/*
 * Servo driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require('cylon');

var Servo = module.exports = function Servo(opts) {
  Servo.__super__.constructor.apply(this, arguments);

  this.pin = this.device.pin;
  this.angleValue = 0;

  this.angleRange = opts.extraParams.range || { min: 20, max: 160 };
  this.freq = opts.extraParams.freq || null;
  this.pulseWidth = opts.extraParams.pulseWidth || { min: 500, max: 2400 };
  this.pwmScale = opts.extraParams.pwmScale || { bottom: 0, top: 180 };

  this.commands = {
    angle: this.angle,
    current_angle: this.currentAngle
  };
};

Cylon.Utils.subclass(Servo, Cylon.Driver);

Servo.prototype.start = function(callback) {
  callback();
};

Servo.prototype.halt = function(callback) {
  callback();
};

// Public: Returns the current angle of the servo, an integer value
// between 0 and 180.
//
// Returns an integer.
Servo.prototype.currentAngle = function() {
  return this.angleValue;
};

// Public: Moves the servo to the specified angle, angle must be an
// integer value between 0 and 180.
//
// value - params
//
// Returns null.
Servo.prototype.angle = function(value) {
  var scaledDuty = (this.safeAngle(value)).fromScale(this.pwmScale.bottom, this.pwmScale.top);

  this.connection.servoWrite(this.pin, scaledDuty, this.freq, this.pulseWidth);
  this.angleValue = value;
};

// Public: Saves an specified angle, angle must be an
// integer value between 0 and 180.
//
// value - params
//
// Returns null.
Servo.prototype.safeAngle = function(value) {
  if (value < this.angleRange.min) {
      value = this.angleRange.min;
  } else {
    if (value > this.angleRange.max) {
      value = this.angleRange.max;
    }
  }
  return value;
};
