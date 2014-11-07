/*
 * SHARP IR Range Sensor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require('cylon');
var path = require('path');

var IrRangeSensor = module.exports = function IrRangeSensor(opts) {
  IrRangeSensor.__super__.constructor.apply(this, arguments);

  if (opts.extraParams.model) {
    this.rangeTable = require(path.join(__dirname, './ir_range_tables/' + opts.extraParams.model.toLowerCase() + '.js'));
  } else {
    this.rangeTable = {};
    Cylon.Logger.info("IRSensor CANNOT calculate distance (range and rangecm) without IR model number.");
    Cylon.Logger.info("Only analogRead() values will be available.");
    Cylon.Logger.info("On how to generate a distance range table check ./node_modules/cylon-gpio/utilities/generate-ir-rage-sensor-table.js.");
    Cylon.Logger.info("Try Passing model number as a device parameter.");
  }

  this.analogVal = 0;
  this.distanceCm = 0;
  this.distanceIn = 0;

  IrRangeSensor.__super__.constructor.apply(this, arguments);

  this.commands = {
    analog_read: this.analogRead,
    range_cm: this.rangeCm,
    range: this.range
  };
};

Cylon.Utils.subclass(IrRangeSensor, Cylon.Driver);

// Public: Starts the driver
//
// Returns null.
IrRangeSensor.prototype.start = function(callback) {
  this.device.connection.analogRead(this.device.pin, function(err, readVal) {
    this._calcDistances(readVal);
    this.device.emit('range', this.distanceIn);
    this.device.emit('rangeCm', this.distanceCm);
  }.bind(this));

  callback();
};

IrRangeSensor.prototype.halt = function(callback) {
  callback();
};

IrRangeSensor.prototype._calcDistances = function(analogVal) {
  var distance = 0,
      tmpRange = 0;

  for (var range in this.rangeTable.rangeDistances){
    tmpRange = parseInt(range);
    if ((analogVal <= tmpRange) && (analogVal + 5 > tmpRange)){
      distance = this.rangeTable.rangeDistances[range].dist;
      break;
    }
  }

  this.analogVal = analogVal;
  this.distanceCm = distance;
  this.distanceIn = distance / 2.54;
};

IrRangeSensor.prototype.analogRead = function() {
  return this.analogVal || 0;
};

IrRangeSensor.prototype.rangeCm = function() {
  return this.distanceCm;
};

IrRangeSensor.prototype.range = function() {
  return this.distanceIn;
};
