"use strict";

var AnalogSensor = source("analog-sensor");

describe("AnalogSensor", function() {
  var driver = new AnalogSensor({
    name: 'sensor',
    device: { connection: 'connect', pin: 13 },
  });

  describe("constructor", function() {
    var testDriver = new AnalogSensor({
      name: 'sensor',
      device: { connection: 'connect', pin: 13 },
      extraParams: { upperLimit: 180, lowerLimit: 50 }
    });

    it("assigns @pin to the passed device's pin", function() {
      expect(testDriver.pin).to.be.eql(13);
    });

    it("assigns @upperlimit to the passed upper limit", function() {
      expect(testDriver.upperLimit).to.be.eql(180);
    });

    it("assigns @lowerlimit to the passed lower limit", function() {
      expect(testDriver.lowerLimit).to.be.eql(50);
    });

    it("assigns @upperlimit to 256 by default", function() {
      expect(driver.upperLimit).to.be.eql(256);
    });

    it("assigns @lowerlimit to 0 by default", function() {
      expect(driver.lowerLimit).to.be.eql(0);
    });

    it("assigns @analog_val to null by default", function() {
      expect(driver.lowerLimit).to.be.eql(0);
    });
  });

  describe("#commands", function() {
    it("is an object containing AnalogSensor commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a('function');
      }
    });
  });

  describe('#start', function() {
    var callback = function() {},
        originalConnection;

    before(function() {
      originalConnection = driver.connection;

      driver.connection = { analogRead: stub().callsArgWith(1, null, 75) };
      driver.device.emit = spy();

      driver.start(callback);
    });

    after(function() {
      driver.connection = originalConnection;
      delete driver.device.emit;
    });

    it("tells the connection to #analogRead the pin", function() {
      expect(driver.connection.analogRead).to.be.calledWith(13);
    });

    it("sets @analogVal to the read value", function() {
      expect(driver.analogVal).to.be.eql(75);
    })

    it("emits the 'analogRead' event with the read value", function() {
      expect(driver.device.emit).to.be.calledWith('analogRead', 75);
    });

    context("when #analogRead returns a value under the lower limit", function() {
      before(function() {
        driver.connection.analogRead.callsArgWith(1, null, -1);
        driver.start(callback);
      });

      it("emits the 'analogRead' event with the read value", function() {
        expect(driver.device.emit).to.be.calledWith('analogRead', -1);
      });

      it("emits the 'lowerLimit' event with the read value", function() {
        expect(driver.device.emit).to.be.calledWith('lowerLimit', -1);
      });
    });

    context("when #analogRead returns a value above the upper limit", function() {
      before(function() {
        driver.connection.analogRead.callsArgWith(1, null, 360);
        driver.start(callback);
      });

      it("emits the 'analogRead' event with the read value", function() {
        expect(driver.device.emit).to.be.calledWith('analogRead', 360);
      });

      it("emits the 'upperLimit' event with the read value", function() {
        expect(driver.device.emit).to.be.calledWith('upperLimit', 360);
      });
    });
  });
});
