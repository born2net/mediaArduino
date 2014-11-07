/*
 * LCD display driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

// i2c commands
var CLEARDISPLAY = 0x01,
    RETURNHOME = 0x02,
    ENTRYMODESET = 0x04,
    DISPLAYCONTROL = 0x08,
    CURSORSHIFT = 0x10,
    FUNCTIONSET = 0x20,
    SETCGRAMADDR = 0x40,
    SETDDRAMADDR = 0x80;

// flags for display entry mode
var ENTRYRIGHT = 0x00,
    ENTRYLEFT = 0x02,
    ENTRYSHIFTINCREMENT = 0x01,
    ENTRYSHIFTDECREMENT = 0x00;

// flags for display on/off control
var DISPLAYON = 0x04,
    DISPLAYOFF = 0x00,
    CURSORON = 0x02,
    CURSOROFF = 0x00,
    BLINKON = 0x01,
    BLINKOFF = 0x00;

// flags for display/cursor shift
var DISPLAYMOVE = 0x08,
    CURSORMOVE = 0x00,
    MOVERIGHT = 0x04,
    MOVELEFT = 0x00;

// flags for function set
var EIGHTBITMODE = 0x10,
    FOURBITMODE = 0x00,
    TWOLINE = 0x08,
    ONELINE = 0x00,
    FIVExTENDOTS = 0x04,
    FIVExEIGHTDOTS = 0x00;

// flags for backlight control
var BACKLIGHT = 0x08,
    NOBACKLIGHT = 0x00;

var En = 0x04, // Enable bit
    Rw = 0x02, // Read/Write bit
    Rs = 0x01; // Register select bit

var LCD = module.exports = function LCD() {
  LCD.__super__.constructor.apply(this, arguments);

  this.address = 0x27;
  this._backlightVal = NOBACKLIGHT;
  this._displayfunction = FOURBITMODE | TWOLINE | FIVExEIGHTDOTS;
  this._displaycontrol = DISPLAYON | CURSOROFF | BLINKOFF;
  this._displaymode = ENTRYLEFT | ENTRYSHIFTDECREMENT;

  this.setupCommands([
    'clear', 'home', 'setCursor', 'displayOff', 'displayOn',
    'cursorOff', 'cursorOn', 'blinkOff', 'blinkOn', 'backlightOff',
    'backlightOn', 'print'
  ]);
};

Cylon.Utils.subclass(LCD, Cylon.Driver);

LCD.prototype.start = function(callback) {
  Cylon.Utils.sleep(50);

  this._expanderWrite(this._backlightVal);
  Cylon.Utils.sleep(100);

  this._write4bits(0x03 << 4);
  Cylon.Utils.sleep(4);

  this._write4bits(0x03 << 4);
  Cylon.Utils.sleep(4);

  this._write4bits(0x03 << 4);
  this._write4bits(0x02 << 4);
  this._sendCommand(FUNCTIONSET | this._displayfunction);

  this.displayOn();
  this.clear();

  // Initialize to default text direction (for roman languages) & set the entry mode
  this._sendCommand(ENTRYMODESET | this._displaymode);
  this.home();

  every(0, function() {
    this._expanderWrite(this._backlightVal);
  }.bind(this));

  callback();
};

LCD.prototype.halt = function(callback) {
  callback();
};

// clear display
LCD.prototype.clear = function() {
  this._sendCommand(CLEARDISPLAY);
  Cylon.Utils.sleep(2);
};

// move display cursor to home
LCD.prototype.home = function() {
  this._sendCommand(RETURNHOME);
  Cylon.Utils.sleep(2);
};

// move display cursor to col, row
LCD.prototype.setCursor = function(col, row) {
  var row_offsets = [0x00, 0x40, 0x14, 0x54];
  this._sendCommand(SETDDRAMADDR | (col + row_offsets[row]));
};

LCD.prototype.displayOff = function() {
  this._displaycontrol &= ~DISPLAYON;
  this._sendCommand(DISPLAYCONTROL | this._displaycontrol);
};

LCD.prototype.displayOn = function() {
  this._displaycontrol |= DISPLAYON;
  this._sendCommand(DISPLAYCONTROL | this._displaycontrol);
};

LCD.prototype.cursorOff = function() {
  this._displaycontrol &= ~CURSORON;
  this._sendCommand(DISPLAYCONTROL | this._displaycontrol);
};

LCD.prototype.cursorOn = function() {
  this._displaycontrol |= CURSORON;
  this._sendCommand(DISPLAYCONTROL | this._displaycontrol);
};

LCD.prototype.blinkOff = function() {
  this._displaycontrol &= ~BLINKON;
  this._sendCommand(DISPLAYCONTROL | this._displaycontrol);
};

LCD.prototype.blinkOn = function() {
  this._displaycontrol |= BLINKON;
  this._sendCommand(DISPLAYCONTROL | this._displaycontrol);
};

LCD.prototype.backlightOff = function() {
  this._backlightVal = NOBACKLIGHT;
  this._expanderWrite(0);
};

LCD.prototype.backlightOn = function() {
  this._backlightVal = BACKLIGHT;
  this._expanderWrite(0);
};

LCD.prototype.print = function(str) {
  var chars = str.split('');

  for (var i = 0; i < chars.length; i++) {
    this._writeData(chars[i].charCodeAt(0));
  }
};

LCD.prototype._write4bits = function(val) {
  this._expanderWrite(val);
  this._pulseEnable(val);
};

LCD.prototype._expanderWrite = function(data) {
  this.connection.i2cWrite(this.address, (data | this._backlightVal) & 0xFF);
};

LCD.prototype._pulseEnable = function(data) {
  this._expanderWrite(data | En);
  Cylon.Utils.sleep(0.0001);
  this._expanderWrite(data & ~En);
  Cylon.Utils.sleep(0.05);
};

LCD.prototype._sendCommand = function(value) {
  this._sendData(value, 0);
};

LCD.prototype._writeData = function(value) {
  this._sendData(value, Rs);
};

LCD.prototype._sendData = function(val, mode) {
  var highnib = val & 0xf0,
      lownib = (val << 4) & 0xf0;

  this._write4bits(highnib | mode);
  this._write4bits(lownib | mode);
};
