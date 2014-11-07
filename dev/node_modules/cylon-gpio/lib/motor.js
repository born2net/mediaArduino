/*
 * Motor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require('cylon');

var Motor = module.exports = function Motor(opts) {
  Motor.__super__.constructor.apply(this, arguments);

  this.pin = this.device.pin;
  this.freq = opts.extraParams.freq || null;
  this.speedValue = 0;
  this.isOn = false;
  this.pwmScale = opts.extraParams.pwmScale || { bottom: 0, top: 255 };

  this.commands = {
    turn_on: this.turnOn,
    turn_off: this.turnOff,
    toggle: this.toggle,
    speed: this.speed,
    current_speed: this.currentSpeed
  };
};

Cylon.Utils.subclass(Motor, Cylon.Driver);

Motor.prototype.start = function(callback) {
  callback();
};

Motor.prototype.halt = function(callback) {
  callback();
};

// Public: Starts the motor.
//
// Returns nil.
Motor.prototype.turnOn = function() {
  this.isOn = true;
  this.connection.digitalWrite(this.pin, 1);
};

// Public: Stops the motor.
//
// Returns nil.
Motor.prototype.turnOff = function() {
  this.isOn = false;
  this.connection.digitalWrite(this.pin, 0);
};

// Public: Sets the state of the motor to the oposite of the current state,
// if motor is on then sets it to off.
//
// Returns true | nil.
Motor.prototype.toggle = function() {
  if (this.isOn) {
    this.turnOff();
  } else {
    this.turnOn();
  }
};

// Public: Returns the current speed of the motor as an integer between 0 and 255.
//
// Returns integer.
Motor.prototype.currentSpeed = function() {
  return this.speedValue;
};

// Public: Sets the speed of the motor to the value provided in the
// speed param, speed value must be an integer between 0 and 255.
//
// value- params
//
// Returns integer.
Motor.prototype.speed = function(value) {
  var scaledDuty = (value).fromScale(this.pwmScale.bottom, this.pwmScale.top);

  this.connection.pwmWrite(this.pin, scaledDuty, this.freq);
  this.speedValue = value;
  this.isOn = this.speedValue > 0;
};
