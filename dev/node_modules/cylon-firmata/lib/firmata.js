/*
 * Cylonjs Adaptor adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Firmata = require('firmata');
var Cylon = require('cylon');

var Adaptor = module.exports = function Adaptor(opts) {
  if (opts == null) {
    opts = {};
  }

  Adaptor.__super__.constructor.apply(this, arguments);
  this.board = "";
  this.i2cReady = false;
};

Cylon.Utils.subclass(Adaptor, Cylon.Adaptor);

Adaptor.prototype.commands = [
  'pinMode',
  'digitalRead',
  'digitalWrite',
  'analogRead',
  'analogWrite',
  'pwmWrite',
  'servoWrite',
  'i2cConfig',
  'i2cWrite',
  'i2cRead'
];

Adaptor.prototype.connect = function(callback) {
  this.board = new Firmata.Board(this.connection.port, function(data) {
    this.connection.emit('connect');
    callback(null, data);
  }.bind(this));

  this.proxyMethods(this.commands, this.board, this);
};

Adaptor.prototype.disconnect = function(callback) {
  this.board.reset();
  callback();
};

Adaptor.prototype.digitalRead = function(pin, callback) {
  this.pinMode(pin, 'input');

  var adCallback = function(readVal) {
    callback(null, readVal);
  };

  this.board.digitalRead(pin, adCallback);
};

Adaptor.prototype.digitalWrite = function(pin, value) {
  this.pinMode(pin, 'output');
  this.board.digitalWrite(pin, value);
};

Adaptor.prototype.analogRead = function(pin, callback) {
  var adCallback = function(readVal) {
    callback(null, readVal);
  };

  this.board.analogRead(pin, adCallback);
};

Adaptor.prototype.analogWrite = function(pin, value) {
  value = (value).toScale(0, 255);
  this.pinMode(this.board.analogPins[pin], 'analog');
  this.board.analogWrite(this.board.analogPins[pin], value);
};

Adaptor.prototype.pwmWrite = function(pin, value) {
  value = (value).toScale(0, 255);
  this.pinMode(pin, 'pwm');
  this.board.analogWrite(pin, value);
};

Adaptor.prototype.servoWrite = function(pin, value) {
  value = (value).toScale(0, 180);
  this.pinMode(pin, 'servo');
  this.board.servoWrite(pin, value);
};

Adaptor.prototype.i2cWrite = function(address, cmd, buff, callback) {
  if (!this.i2cReady) { this.i2cConfig(2000); }
  this.board.sendI2CWriteRequest(address, [cmd].concat(buff));
  if ('function' === typeof(callback)) { callback(); }
};

Adaptor.prototype.i2cRead = function(address, cmd, length, callback) {
  if (!this.i2cReady) { this.i2cConfig(2000); }
  // TODO: decouple read and write operations here...
  if (cmd) { this.board.sendI2CWriteRequest(address, cmd); }
  this.board.sendI2CReadRequest(address, length, function(data){
    var err = null;

    if (data.name === 'Error') {
      err = data;
      data = null;
    }

    callback(err, data);
  });
};

Adaptor.prototype.pinMode = function(pin, mode) {
  this.board.pinMode(pin, this._convertPinMode(mode));
};

Adaptor.prototype.i2cConfig = function(delay) {
  this.board.sendI2CConfig(delay);
  this.i2cReady = true;
};

Adaptor.prototype._convertPinMode = function(mode) {
  switch (mode) {
    case 'input':
      return this.board.MODES.INPUT ;
    case 'output':
      return this.board.MODES.OUTPUT ;
    case 'analog':
      return this.board.MODES.ANALOG ;
    case 'pwm':
      return this.board.MODES.PWM ;
    case 'servo':
      return this.board.MODES.SERVO ;
    default:
      return this.board.MODES.INPUT ;
  }
};
