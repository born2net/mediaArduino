'use strict';

var Cylon = require('cylon');

var MPL115A2 = source("mpl115a2");

describe("Cylon.Drivers.I2C.Mpl115A2", function() {
  var driver = new MPL115A2({
    name: 'mpl115a2',
    device: {
      connection: {},
      pin: 13,
      emit: spy()
    }
  });

  describe("constructor", function() {
    it("sets @address to 0x60", function() {
      expect(driver.address).to.be.eql(0x60);
    });
  });

  describe("#commands", function() {
    it("is an object containing MPL1115A2 commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a('function');
      }
    });
  });

  describe("#start", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(driver, 'readCoefficients');
    });

    afterEach(function() {
      driver.readCoefficients.restore();
    });

    it("calls #readCoefficients", function() {
      driver.start(callback);
      expect(driver.readCoefficients).to.be.calledWith(callback);
    });
  });

  describe("#getPressure", function() {
    it("is a proxy to #getPT", function() {
      expect(driver.getPressure).to.be.eql(driver.getPT)
    });
  });

  describe("#getTemperature", function() {
    it("is a proxy to #getPT", function() {
      expect(driver.getTemperature).to.be.eql(driver.getPT)
    });
  });

  describe("#readCoefficients", function() {
    var callback;
    beforeEach(function() {
      var data = [10, 10, 10, 10, 10, 10, 10, 10];
      callback = spy();
      driver.connection.i2cRead = stub().callsArgWith(3, null, data);
      driver.readCoefficients(callback);
    });

    afterEach(function() {
      driver.connection.i2cRead = undefined;
    });

    it("uses i2cRead to fetch data from the board", function() {
      expect(driver.connection.i2cRead).to.be.calledWith(
        driver.address,
        0x04,
        8
      );
    });

    it("sets coefficients based on returned data", function() {
      expect(driver.a0).to.be.eql(321.25);
      expect(driver.b1).to.be.eql(0.313720703125);
      expect(driver.b2).to.be.eql(0.1568603515625);
      expect(driver.c12).to.be.eql(0.00015306472778320312);
    });

    it("calls the provided callback", function() {
      expect(callback).to.be.called;
    });

    it("tells the device to emit the 'start' event", function() {
      expect(driver.device.emit).to.be.calledWith('start');
    });
  });

  describe("#getPT", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cWrite = spy();
      driver.connection.i2cRead = stub().callsArgWith(3, null, [10, 10, 10, 10]);
      stub(Cylon.Utils, 'sleep');
      driver.getPT(callback);
    });

    afterEach(function() {
      Cylon.Utils.sleep.restore();
      driver.connection.i2cWrite = undefined;
      driver.connection.i2cRead = undefined;
    });

    it("uses #i2cWrite to tell the sensor to start conversion", function() {
      expect(driver.connection.i2cWrite).to.be.calledWith(
        driver.address,
        0x12
      );

      expect(driver.connection.i2cWrite).to.be.calledWith(driver.address, 0);
    });

    it("Cylon.Utils.sleeps for 5 ms", function() {
      expect(Cylon.Utils.sleep).to.be.calledWith(5);
    });

    it("uses #i2cRead to get the pressure from the sensor", function() {
      expect(driver.connection.i2cRead).to.be.calledWith(
        driver.address,
        0x00,
        4
      );
    });

    it("it sets the pressure and temperature based on the readings", function() {
      expect(driver.pressure).to.be.eql(71.62334259421011);
      expect(driver.temperature).to.be.eql(110.60747663551402);
    });

    it("calls the provided callback with the temp/pressure", function() {
      var values = {
        pressure: 71.62334259421011,
        temperature: 110.60747663551402
      };
      expect(callback).to.be.calledWith(null, values);
    });
  });
});
