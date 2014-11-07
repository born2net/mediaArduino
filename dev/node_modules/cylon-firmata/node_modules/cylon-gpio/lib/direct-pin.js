/*
 * DirectPin driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require('cylon');

var DirectPin = module.exports = function DirectPin() {
  DirectPin.__super__.constructor.apply(this, arguments);

  this.pin = this.device.pin;
  this.dReadSet = false;
  this.aReadSet = false;
  this.high = false;

  this.commands = {
    digital_read: this.digitalRead,
    digital_write: this.digitalWrite,

    analog_read: this.analogRead,
    analog_write: this.analogWrite,

    pwm_write: this.pwmWrite,
    servo_write: this.servoWrite,
  };
};

Cylon.Utils.subclass(DirectPin, Cylon.Driver);

DirectPin.prototype.start = function(callback) {
  callback();
};

DirectPin.prototype.halt = function(callback) {
  callback();
};

// Public: DigitalWrite
//
// Returns null.
DirectPin.prototype.digitalWrite = function(value) {
  this.connection.digitalWrite(this.pin, value);
};

// Public: DigitalRead
// params:
//  callback: to be executed upon reading the pin state.
//
// Returns null.
DirectPin.prototype.digitalRead = function(callback) {
  if (!this.dReadSet) {
    this.connection.digitalRead(this.pin, callback);
  }
  this.dReadSet = true;
};

// Public: AnalogWrite
//
// Returns null.
DirectPin.prototype.analogWrite = function(value) {
  this.connection.analogWrite(this.pin, value);
};

// Public: AnalogRead
// params:
//  callback: to be executed upon reading the pin state.
//
// Returns null.
DirectPin.prototype.analogRead = function(callback) {
  if (!this.aReadSet) {
    this.connection.analogRead(this.pin, callback);
  }
  this.aReadSet = true;
};
// Public: ServoWrite

//
// Returns null.
DirectPin.prototype.servoWrite = function(angle) {
  return this.connection.servoWrite(this.pin, angle);
};

// Public: PwmWrite
//
// Returns null.
DirectPin.prototype.pwmWrite = function(value) {
  return this.connection.pwmWrite(this.pin, value);
};
