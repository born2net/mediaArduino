"use strict";

var Cylon = require('cylon');

var OUT_TEMP_L_XM = 0x05,
    OUT_TEMP_H_XM = 0x06,
    STATUS_REG_M = 0x07,
    OUT_X_L_M = 0x08,
    OUT_X_H_M = 0x09,
    OUT_Y_L_M = 0x0A,
    OUT_Y_H_M = 0x0B,
    OUT_Z_L_M = 0x0C,
    OUT_Z_H_M = 0x0D,
    WHO_AM_I_XM = 0x0F,
    INT_CTRL_REG_M = 0x12,
    INT_SRC_REG_M = 0x13,
    INT_THS_L_M = 0x14,
    INT_THS_H_M = 0x15,
    OFFSET_X_L_M = 0x16,
    OFFSET_X_H_M = 0x17,
    OFFSET_Y_L_M = 0x18,
    OFFSET_Y_H_M = 0x19,
    OFFSET_Z_L_M = 0x1A,
    OFFSET_Z_H_M = 0x1B,
    REFERENCE_X = 0x1C,
    REFERENCE_Y = 0x1D,
    REFERENCE_Z = 0x1E,
    CTRL_REG0_XM = 0x1F,
    CTRL_REG1_XM = 0x20,
    CTRL_REG2_XM = 0x21,
    CTRL_REG3_XM = 0x22,
    CTRL_REG4_XM = 0x23,
    CTRL_REG5_XM = 0x24,
    CTRL_REG6_XM = 0x25,
    CTRL_REG7_XM = 0x26,
    STATUS_REG_A = 0x27,
    OUT_X_L_A = 0x28,
    OUT_X_H_A = 0x29,
    OUT_Y_L_A = 0x2A,
    OUT_Y_H_A = 0x2B,
    OUT_Z_L_A = 0x2C,
    OUT_Z_H_A = 0x2D,
    FIFO_CTRL_REG = 0x2E,
    FIFO_SRC_REG = 0x2F,
    INT_GEN_1_REG = 0x30,
    INT_GEN_1_SRC = 0x31,
    INT_GEN_1_THS = 0x32,
    INT_GEN_1_DURATION = 0x33,
    INT_GEN_2_REG = 0x34,
    INT_GEN_2_SRC = 0x35,
    INT_GEN_2_THS = 0x36,
    INT_GEN_2_DURATION = 0x37,
    CLICK_CFG = 0x38,
    CLICK_SRC = 0x39,
    CLICK_THS = 0x3A,
    TIME_LIMIT = 0x3B,
    TIME_LATENCY = 0x3C,
    TIME_WINDOW = 0x3D,
    ACT_THS = 0x3E,
    ACT_DUR = 0x3F;

var LSM9DS0XM = module.exports = function LSM9DS0XM(opts) {
  LSM9DS0XM.__super__.constructor.apply(this, arguments);
  var extraParams = opts.extraParams || {};
  this.address = 0x1d;

  this.commands = {
    getAccel: this.getAccel,
    getMag: this.getMag
  };
};

Cylon.Utils.subclass(LSM9DS0XM, Cylon.Driver);

LSM9DS0XM.prototype.start = function(callback) {
  this._initAccel();
  this._initMag();
  callback();
};

LSM9DS0XM.prototype.halt = function(callback) {
  callback();
};

LSM9DS0XM.prototype.getAccel = function(callback) {
  var self = this;

  self.connection.i2cRead(self.address, OUT_X_L_A, 6, function(err, data) {
    if (err) {
      callback(err, null);
    } else {
      var result = {};
      result['x'] = (data[1] << 8) | data[0]; // Store x-axis values into gx
      result['y'] = (data[3] << 8) | data[2]; // Store y-axis values into gy
      result['z'] = (data[5] << 8) | data[4]; // Store z-axis values into gz
      callback(null, result);
    }
  });
};

LSM9DS0XM.prototype.getMag = function(callback) {
  var self = this;

  self.connection.i2cRead(self.address, OUT_X_L_M, 6, function(err, data) {
    if (err) {
      callback(err, null);
    } else {
      var result = {};
      result['x'] = (data[1] << 8) | data[0]; // Store x-axis values into gx
      result['y'] = (data[3] << 8) | data[2]; // Store y-axis values into gy
      result['z'] = (data[5] << 8) | data[4]; // Store z-axis values into gz
      callback(null, result);
    }
  });
};

LSM9DS0XM.prototype._initAccel = function() {
  /* CTRL_REG0_XM (0x1F) (Default value: 0x00)
  Bits (7-0): BOOT FIFO_EN WTM_EN 0 0 HP_CLICK HPIS1 HPIS2
  BOOT - Reboot memory content (0: normal, 1: reboot)
  FIFO_EN - Fifo enable (0: disable, 1: enable)
  WTM_EN - FIFO watermark enable (0: disable, 1: enable)
  HP_CLICK - HPF enabled for click (0: filter bypassed, 1: enabled)
  HPIS1 - HPF enabled for interrupt generator 1 (0: bypassed, 1: enabled)
  HPIS2 - HPF enabled for interrupt generator 2 (0: bypassed, 1 enabled)   */
  this.connection.i2cWrite(this.address, CTRL_REG0_XM, 0x00);
  
  /* CTRL_REG1_XM (0x20) (Default value: 0x07)
  Bits (7-0): AODR3 AODR2 AODR1 AODR0 BDU AZEN AYEN AXEN
  AODR[3:0] - select the acceleration data rate:
    0000=power down, 0001=3.125Hz, 0010=6.25Hz, 0011=12.5Hz, 
    0100=25Hz, 0101=50Hz, 0110=100Hz, 0111=200Hz, 1000=400Hz,
    1001=800Hz, 1010=1600Hz, (remaining combinations undefined).
  BDU - block data update for accel AND mag
    0: Continuous update
    1: Output registers aren't updated until MSB and LSB have been read.
  AZEN, AYEN, and AXEN - Acceleration x/y/z-axis enabled.
    0: Axis disabled, 1: Axis enabled                  */ 
  this.connection.i2cWrite(this.address, CTRL_REG1_XM, 0x57); // 100Hz data rate, x/y/z all enabled
  
  /* CTRL_REG2_XM (0x21) (Default value: 0x00)
  Bits (7-0): ABW1 ABW0 AFS2 AFS1 AFS0 AST1 AST0 SIM
  ABW[1:0] - Accelerometer anti-alias filter bandwidth
    00=773Hz, 01=194Hz, 10=362Hz, 11=50Hz
  AFS[2:0] - Accel full-scale selection
    000=+/-2g, 001=+/-4g, 010=+/-6g, 011=+/-8g, 100=+/-16g
  AST[1:0] - Accel self-test enable
    00=normal (no self-test), 01=positive st, 10=negative st, 11=not allowed
  SIM - SPI mode selection
    0=4-wire, 1=3-wire                           */
  this.connection.i2cWrite(this.address, CTRL_REG2_XM, 0x00); // Set scale to 2g
  
  /* CTRL_REG3_XM is used to set interrupt generators on INT1_XM
  Bits (7-0): P1_BOOT P1_TAP P1_INT1 P1_INT2 P1_INTM P1_DRDYA P1_DRDYM P1_EMPTY
  */
  this.connection.i2cWrite(this.address, CTRL_REG3_XM, 0x04); // Accelerometer data ready on INT1_XM (0x04)
};

LSM9DS0XM.prototype._initMag = function() {
  /* CTRL_REG5_XM enables temp sensor, sets mag resolution and data rate
  Bits (7-0): TEMP_EN M_RES1 M_RES0 M_ODR2 M_ODR1 M_ODR0 LIR2 LIR1
  TEMP_EN - Enable temperature sensor (0=disabled, 1=enabled)
  M_RES[1:0] - Magnetometer resolution select (0=low, 3=high)
  M_ODR[2:0] - Magnetometer data rate select
    000=3.125Hz, 001=6.25Hz, 010=12.5Hz, 011=25Hz, 100=50Hz, 101=100Hz
  LIR2 - Latch interrupt request on INT2_SRC (cleared by reading INT2_SRC)
    0=interrupt request not latched, 1=interrupt request latched
  LIR1 - Latch interrupt request on INT1_SRC (cleared by readging INT1_SRC)
    0=irq not latched, 1=irq latched                   */
  this.connection.i2cWrite(this.address, CTRL_REG5_XM, 0x94); // Mag data rate - 100 Hz, enable temperature sensor
  
  /* CTRL_REG6_XM sets the magnetometer full-scale
  Bits (7-0): 0 MFS1 MFS0 0 0 0 0 0
  MFS[1:0] - Magnetic full-scale selection
  00:+/-2Gauss, 01:+/-4Gs, 10:+/-8Gs, 11:+/-12Gs               */
  this.connection.i2cWrite(this.address, CTRL_REG6_XM, 0x00); // Mag scale to +/- 2GS
  
  /* CTRL_REG7_XM sets magnetic sensor mode, low power mode, and filters
  AHPM1 AHPM0 AFDS 0 0 MLP MD1 MD0
  AHPM[1:0] - HPF mode selection
    00=normal (resets reference registers), 01=reference signal for filtering, 
    10=normal, 11=autoreset on interrupt event
  AFDS - Filtered acceleration data selection
    0=internal filter bypassed, 1=data from internal filter sent to FIFO
  MLP - Magnetic data low-power mode
    0=data rate is set by M_ODR bits in CTRL_REG5
    1=data rate is set to 3.125Hz
  MD[1:0] - Magnetic sensor mode selection (default 10)
    00=continuous-conversion, 01=single-conversion, 10 and 11=power-down */
  this.connection.i2cWrite(this.address, CTRL_REG7_XM, 0x00); // Continuous conversion mode
  
  /* CTRL_REG4_XM is used to set interrupt generators on INT2_XM
  Bits (7-0): P2_TAP P2_INT1 P2_INT2 P2_INTM P2_DRDYA P2_DRDYM P2_Overrun P2_WTM
  */
  this.connection.i2cWrite(this.address, CTRL_REG4_XM, 0x04); // Magnetometer data ready on INT2_XM (0x08)
  
  /* INT_CTRL_REG_M to set push-pull/open drain, and active-low/high
  Bits[7:0] - XMIEN YMIEN ZMIEN PP_OD IEA IEL 4D MIEN
  XMIEN, YMIEN, ZMIEN - Enable interrupt recognition on axis for mag data
  PP_OD - Push-pull/open-drain interrupt configuration (0=push-pull, 1=od)
  IEA - Interrupt polarity for accel and magneto
    0=active-low, 1=active-high
  IEL - Latch interrupt request for accel and magneto
    0=irq not latched, 1=irq latched
  4D - 4D enable. 4D detection is enabled when 6D bit in INT_GEN1_REG is set
  MIEN - Enable interrupt generation for magnetic data
    0=disable, 1=enable) */
  this.connection.i2cWrite(this.address, INT_CTRL_REG_M, 0x09); // Enable interrupts for mag, active-low, push-pull
};
