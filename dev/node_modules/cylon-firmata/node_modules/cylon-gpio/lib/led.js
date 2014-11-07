/*
 * LED driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var Led = module.exports = function Led(opts) {
  Led.__super__.constructor.apply(this, arguments);

  this.pin = this.device.pin;
  this.freq = opts.extraParams.freq || null;
  this.isHigh = false;
  this.brightnessValue = 0;
  this.pwmScale = opts.extraParams.pwmScale || { bottom: 0, top: 255 };


  this.commands = {
    is_on: this.isOn,

    turn_on: this.turnOn,
    turn_off: this.turnOff,
    toggle: this.toggle,

    brightness: this.brightness,
    current_brightness: this.currentBrightness
  };
};

Cylon.Utils.subclass(Led, Cylon.Driver);

Led.prototype.start = function(callback) {
  callback();
};

Led.prototype.halt = function(callback) {
  callback();
};

// Public: Turns LED on.
//
// Returns null.
Led.prototype.turnOn = function() {
  this.isHigh = true;
  this.connection.digitalWrite(this.pin, 1);
};

// Public: Turns LED off.
//
// Returns null.
Led.prototype.turnOff = function() {
  this.isHigh = false;
  this.connection.digitalWrite(this.pin, 0);
};

// Public: Turns the LED on, or off, depending on if it is already off, or
// on, respectively.
//
// Returns null.
Led.prototype.toggle = function() {
  if (this.isHigh) {
    this.turnOff();
  } else {
    this.turnOn();
  }
};

Led.prototype.currentBrightness = function() {
  return this.brightnessValue;
};

// Public: Sets brightness of the led to the specified brightness value
// passed to brightness(brightness_int) using PWM, brightness can be any
// integer value between 0 and 255.
//
// value - params, The brightness level
//
// Returns null.
Led.prototype.brightness = function(value) {
  var scaledDuty = (value).fromScale(this.pwmScale.bottom, this.pwmScale.top);

  this.connection.pwmWrite(this.pin, scaledDuty, this.freq);
  this.brightnessValue = value;
};

Led.prototype.isOn = function(){
  return this.isHigh;
};
