/*
 * Cylon Makey Button driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require('cylon');

var MakeyButton = module.exports = function MakeyButton() {
  MakeyButton.__super__.constructor.apply(this, arguments);

  this.pin = this.device.pin;
  this.isPressed = false;
  this.currentValue = 0;
  this.data = [];
};

Cylon.Utils.subclass(MakeyButton, Cylon.Driver);

// Public: Starts the driver
//
// callback - params
//
// Returns null.
MakeyButton.prototype.start = function(callback) {
  this.connection.digitalRead(this.pin, function(err, data) {
    this.currentValue = data;
  }.bind(this));

  Cylon.Utils.every(50, function() {
    this.data.push(this.currentValue);
    if (this.data.length > 5) {
      this.data.shift();
    }

    if (this.averageData() <= 0.5 && !this.isPressed) {
      this.isPressed = true;
      this.device.emit('push');
    } else if (this.averageData() > 0.5 && this.isPressed) {
      this.isPressed = false;
      this.device.emit('release');
    }
  }.bind(this));

  callback();
};

MakeyButton.prototype.halt = function(callback) {
  callback();
};

MakeyButton.prototype.averageData = function() {
  var result = 0;

  if (this.data.length > 0) {
    this.data.forEach(function(n) { result += n; });
    result = result / this.data.length;
  }

  return result;
};
