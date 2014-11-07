/*
 * MPU6050 I2C Barometric Pressure + Temperature sensor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-14 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var MPU6050_RA_ACCEL_XOUT_H = 0x3B,
    MPU6050_RA_PWR_MGMT_1 = 0x6B,
    MPU6050_PWR1_CLKSEL_BIT = 2,
    MPU6050_PWR1_CLKSEL_LENGTH = 3,
    MPU6050_CLOCK_PLL_XGYRO = 0x01,

    MPU6050_GYRO_FS_250 = 0x00,
    MPU6050_RA_GYRO_CONFIG = 0x1B,
    MPU6050_GCONFIG_FS_SEL_LENGTH = 2,
    MPU6050_GCONFIG_FS_SEL_BIT = 4,

    MPU6050_RA_ACCEL_CONFIG = 0x1C,
    MPU6050_ACONFIG_AFS_SEL_BIT = 4,
    MPU6050_ACONFIG_AFS_SEL_LENGTH = 2,
    MPU6050_ACCEL_FS_2 = 0x00,

    MPU6050_RA_PWR_MGMT_1 = 0x6B,
    MPU6050_PWR1_SLEEP_BIT = 6;

var Mpu6050 = module.exports = function Mpu6050() {
  Mpu6050.__super__.constructor.apply(this, arguments);
  this.address = 0x68; // DataSheet
  this.commands = {
    get_angular_velocity: this.getAngularVelocity,
    get_acceleration: this.getAcceleration,
    get_motion_and_temp: this.getMotionAndTemp
  };
};

Cylon.Utils.subclass(Mpu6050, Cylon.Driver);

Mpu6050.prototype.start = function(callback) {
  // setClockSource
  this.connection.i2cWrite(this.address, MPU6050_RA_PWR_MGMT_1);
  this.connection.i2cWrite(this.address, MPU6050_PWR1_CLKSEL_BIT);
  this.connection.i2cWrite(this.address, MPU6050_PWR1_CLKSEL_LENGTH);
  this.connection.i2cWrite(this.address, MPU6050_CLOCK_PLL_XGYRO);

  // setFullScaleGyroRange
  this.connection.i2cWrite(this.address, MPU6050_GYRO_FS_250);
  this.connection.i2cWrite(this.address, MPU6050_RA_GYRO_CONFIG);
  this.connection.i2cWrite(this.address, MPU6050_GCONFIG_FS_SEL_LENGTH);
  this.connection.i2cWrite(this.address, MPU6050_GCONFIG_FS_SEL_BIT);

  // setFullScaleAccelRange
  this.connection.i2cWrite(this.address, MPU6050_RA_ACCEL_CONFIG);
  this.connection.i2cWrite(this.address, MPU6050_ACONFIG_AFS_SEL_BIT);
  this.connection.i2cWrite(this.address, MPU6050_ACONFIG_AFS_SEL_LENGTH);
  this.connection.i2cWrite(this.address, MPU6050_ACCEL_FS_2);

  // setSleepEnabled
  this.connection.i2cWrite(this.address, MPU6050_RA_PWR_MGMT_1);
  this.connection.i2cWrite(this.address, MPU6050_PWR1_SLEEP_BIT);
  this.connection.i2cWrite(this.address, 0);

  callback();
  this.device.emit('start');
};

Mpu6050.prototype.halt = function(callback) {
  callback();
};

Mpu6050.prototype.getAngularVelocity = function(callback) {
  this.getMotionAndTemp(callback);
};

Mpu6050.prototype.getAcceleration = function(callback) {
  this.getMotionAndTemp(callback);
};

Mpu6050.prototype.getMotionAndTemp = function(callback) {
  this.connection.i2cRead(this.address, MPU6050_RA_ACCEL_XOUT_H, 14, function(err, data) {
    var ax = this.makeSignedInteger(data[0], data[1]),
        ay = this.makeSignedInteger(data[2], data[3]),
        az = this.makeSignedInteger(data[4], data[5]);

    var temp = this.makeSignedInteger(data[6], data[7]);

    var gx = this.makeSignedInteger(data[8], data[9]),
        gy = this.makeSignedInteger(data[10], data[11]),
        gz = this.makeSignedInteger(data[12], data[13]);

    var values = {
      'a': [ax,ay,az],
      'g': [gx,gy,gz],
      't': this.convertToCelsius(temp)
    };

    callback(err, values);
  }.bind(this));
};

// The temperature sensor is -40 to +85 degrees Celsius.
// It is a signed integer.
// According to the datasheet:
//   340 per degrees Celsius, -512 at 35 degrees.
// At 0 degrees: -512 - (340 * 35) = -12412
Mpu6050.prototype.convertToCelsius = function (temp) {
  return (temp + 12412.0) / 340.0;
};

// we have high and low bits for a signed 16bit integer
// so it has to be converted into signed 32bit integer
Mpu6050.prototype.makeSignedInteger = function (highBits, lowBits) {
  var minusBits = 128;
  var leadingOnes = 4294901760;

  var value = (highBits << 8) | lowBits;

  if ((highBits & minusBits) === minusBits) {
    // first bit is 1, so the value has to be minus

    return value | leadingOnes;
  }

  return value;
};
