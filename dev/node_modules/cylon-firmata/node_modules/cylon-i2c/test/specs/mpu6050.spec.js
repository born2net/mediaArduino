'use strict';

var Cylon = require('cylon');

var Mpu6050 = source('mpu6050');

describe('Cylon.Drivers.I2C.Mpu6050', function() {
  var driver = new Mpu6050({
    name: 'Mpu6050',
    device: {
      connection: {},
      pin: 13,
      emit: spy()
    }
  });

  describe("#constructor", function() {
    it("sets @address to 0x68", function() {
      expect(driver.address).to.be.eql(0x68);
    });
  });

  describe("#commands", function() {
    it("is an object containing MPU6050 commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a('function');
      }
    });
  });

  describe("#start", function() {
    var callback, i2cWrite;

    beforeEach(function() {
      callback = spy();
      i2cWrite = driver.connection.i2cWrite = stub();
      driver.start(callback);
    });

    afterEach(function() {
      driver.connection.i2cWrite = undefined;
    });

    it("sets up the clock", function() {
      expect(i2cWrite).to.be.calledWith(0x68, 0x6B);
      expect(i2cWrite).to.be.calledWith(0x68, 0x02);
      expect(i2cWrite).to.be.calledWith(0x68, 0x03);
      expect(i2cWrite).to.be.calledWith(0x68, 0x01);
    });

    it("sets up the gyroscope", function() {
      expect(i2cWrite).to.be.calledWith(0x68, 0x00);
      expect(i2cWrite).to.be.calledWith(0x68, 0x1B);
      expect(i2cWrite).to.be.calledWith(0x68, 0x02);
      expect(i2cWrite).to.be.calledWith(0x68, 0x04);
    });

    it("sets up the accelerometer", function() {
      expect(i2cWrite).to.be.calledWith(0x68, 0x1C);
      expect(i2cWrite).to.be.calledWith(0x68, 0x04);
      expect(i2cWrite).to.be.calledWith(0x68, 0x02);
      expect(i2cWrite).to.be.calledWith(0x68, 0x00);
    });

    it("enables the sleep bit", function() {
      expect(i2cWrite).to.be.calledWith(0x68, 0x6B);
      expect(i2cWrite).to.be.calledWith(0x68, 0x06);
      expect(i2cWrite).to.be.calledWith(0x68, 0x00);
    });

    it("triggers the callback", function() {
      expect(callback).to.be.called;
    });

    it("emits the 'start' event", function() {
      expect(driver.device.emit).to.be.calledWith('start');
    });
  });

  describe("#getAngularVelocity", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(driver, 'getMotionAndTemp');
      driver.getAngularVelocity(callback);
    });

    afterEach(function() {
      driver.getMotionAndTemp.restore();
    });

    it("passes the provided callback to #getMotionAndTemp", function() {
      expect(driver.getMotionAndTemp).to.be.calledWith(callback);
    });
  });

  describe("#getAcceleration", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(driver, 'getMotionAndTemp');
      driver.getAcceleration(callback);
    });

    afterEach(function() {
      driver.getMotionAndTemp.restore();
    });

    it("passes the provided callback to #getMotionAndTemp", function() {
      expect(driver.getMotionAndTemp).to.be.calledWith(callback);
    });
  });

  describe("#getMotionAndTemp", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      var data = [];
      for (var i = 0; i < 14; i++) {
        data.push(10);
      }

      driver.connection.i2cRead = stub().callsArgWith(3, null, data);
      driver.getMotionAndTemp(callback);
    });

    afterEach(function() {
      driver.connection.i2cRead = undefined;
    });

    it("calls #i2cRead to get data from the device", function() {
      expect(driver.connection.i2cRead).to.be.calledWith(0x68, 0x3B, 14);
    });

    it("triggers the callback with the parsed data", function() {
      var expected = {
        a: [2570, 2570, 2570],
        g: [2570, 2570, 2570],
        t: 44.06470588235294
      };

      expect(callback).to.be.calledWith(null, expected);
    });
  });
});
