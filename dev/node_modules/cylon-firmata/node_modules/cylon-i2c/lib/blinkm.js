/*
 * BlinkM driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');
var TO_RGB = 0x6e,
    FADE_TO_RGB = 0x63,
    FADE_TO_HSB = 0x68,
    FADE_TO_RND_RGB = 0x43,
    FADE_TO_RND_HSB = 0x48,
    PLAY_LIGHT_SCRIPT = 0x70,
    STOP_SCRIPT = 0x6f,
    SET_FADE = 0x66,
    SET_TIME = 0x74,
    GET_RGB = 0x67,
    GET_ADDRESS = 0x61,
    SET_ADDRESS = 0x41,
    GET_FIRMWARE = 0x5a;

var BlinkM = module.exports = function BlinkM() {
  BlinkM.__super__.constructor.apply(this, arguments);
  this.address = 0x09;

  this.setupCommands([
    'goToRGB', 'fadeToRGB', 'fadeToHSB', 'fadeToRandomRGB',
    'fadeToRandomHSB', 'playLightScript', 'stopScript', 'setFadeSpeed',
    'setTimeAdjust', 'getRGBColor', 'setAddress', 'getAddress', 'getFirmware'
  ]);
};

Cylon.Utils.subclass(BlinkM, Cylon.Driver);

// Public: Starts the driver.
//
// Returns null.
BlinkM.prototype.start = function(callback) {
  callback();
};

BlinkM.prototype.halt = function(callback) {
  callback();
};

// Public: Sets the color of the BlinkM RGB LED to the specified
// combination of RGB color provided.
// (red, green and blue values should be between 0 and 255)
//
// r- params, Red value
// g - params, Green value
// b - params,  Blue value
// cb - params, cb value
//
// Returns true | false.
BlinkM.prototype.goToRGB = function(r, g, b, cb) {
  this.connection.i2cWrite(this.address, TO_RGB, [r, g, b], cb);
};

// Public: Fades the color of the BlinkM RGB LED to the specified
// combination of RGB color provided.
// (red, green and blue values should be between 0 and 255)
//
// r- params, Red value
// g - params, Green value
// b - params,  Blue value
// cb - params, cb value
//
// Returns true | false.
BlinkM.prototype.fadeToRGB = function(r, g, b, cb) {
  this.connection.i2cWrite(this.address, FADE_TO_RGB, [r, g, b], cb);
};

// Public: Fades the color of the BlinkM RGB LED to the specified
// combination of HSB provided.
//
// h - params, Hue value
// s - params, Saturation value
// b - params,  Brightness value
// cb - params, cb value
//
// Returns true | false.
BlinkM.prototype.fadeToHSB = function(h, s, b, cb) {
  this.connection.i2cWrite(this.address, FADE_TO_HSB, [h, s, b], cb);
};

// Public: Fades the color of the BlinkM RGB LED to a random
//combination of RGB color.
// (red, green and blue values should be between 0 and 255)
//
// r- params, Red value
// g - params, Green value
// b - params,  Blue value
// cb - params, cb value
//
// Returns null.
BlinkM.prototype.fadeToRandomRGB = function(r, g, b, cb) {
  this.connection.i2cWrite(this.address, FADE_TO_RND_RGB, [r, g, b], cb);
};

// Public: Fades the color of the BlinkM RGB LED to a random
// combination of HSB .
//
// h - params, Hue value
// s - params, Saturation value
// b - params,  Brightness value
// cb - params, cb value
//
// Returns null.
BlinkM.prototype.fadeToRandomHSB = function(h, s, b, cb) {
  this.connection.i2cWrite(this.address, FADE_TO_RND_HSB, [h, s, b], cb);
};

// A repeat value of 0 causes the script to execute until receiving the stopScript command.
// light script ids available in the blinkM datasheet.

// Public: Plays a light script for the BlinkM RGB LED.
//
// id - params
// repeats - params
// startAtLine - params
// cb - params, cb value
//
// Returns null.
BlinkM.prototype.playLightScript = function(id, repeats, startAtLine, cb) {
  this.connection.i2cWrite(this.address, PLAY_LIGHT_SCRIPT, [id, repeats, startAtLine], cb);
};

// Public: Stops an specific script for the BlinkM RGB LED.
//
// Returns null.
BlinkM.prototype.stopScript = function(cb) {
  this.connection.i2cWrite(this.address, STOP_SCRIPT, [], cb);
};

// Speed must be an integer from 1 to 255
// Public: Sets a fade to an specific speed for the BlinkM RGB LED.
//
// speed - params
// cb - params (callback function)
//
// Returns null.
BlinkM.prototype.setFadeSpeed = function(speed, cb) {
  this.connection.i2cWrite(this.address, SET_FADE, [speed], cb);
};

// Time must be an integer betweeb -128 and 127, 0 resets the time.
// This affects the duration of the scripts being played.
// Public: Sets a time adjust for the BlinkM RGB LED.
//
// time - params
// cb - params (callback function)
//
// Returns null.
BlinkM.prototype.setTimeAdjust = function(time, cb) {
  this.connection.i2cWrite(this.address, SET_TIME, [time], cb);
};

// Public: Returns an array containing the RGB values for the current color.
// (all integer between 0 and 255)
//
// Returns [r,g,b]
BlinkM.prototype.getRGBColor = function(cb) {
  return this.connection.i2cRead(this.address, GET_RGB, 3, cb);
};

// Public: Returns an string describing the I2C addresss being used.
//
// Returns String
BlinkM.prototype.getAddress = function(cb) {
  return this.connection.i2cRead(this.address, GET_ADDRESS, 1, cb);
};

// Public: Sets an address to the driver.
//
// address - params
// cb - params (callback function)
//
// Returns null.
BlinkM.prototype.setAddress = function(address, cb) {
  this.connection.i2cWrite(this.address, SET_ADDRESS, [address, 0xd0, 0x0d, address], cb);
  this.address = address;
};

// Public: Returns an sring describing the I2C firmware version being used.
//
// cb - params (callback function)
//
// Returns String
BlinkM.prototype.getFirmware = function(cb) {
  return this.connection.i2cRead(this.address, GET_FIRMWARE, 1, cb);
};
