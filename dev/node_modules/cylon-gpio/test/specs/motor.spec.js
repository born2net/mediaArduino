"use strict";

var Motor = source("motor");

describe("Motor", function() {
  var driver = new Motor({
    name: 'vrroom',
    device: {
      connection: { digitalWrite: spy(), pwmWrite: spy() },
      pin: 13
    },
    extraParams: {}
  });

  describe('constructor', function() {
    it("sets @pin to the value of the passed device's pin", function() {
      expect(driver.pin).to.be.eql(13);
    });

    it("sets @speedvalue to 0 by default", function() {
      expect(driver.speedValue).to.be.eql(0);
    });

    it("sets @isOn to false by default", function() {
      expect(driver.isOn).to.be["false"];
    });
  });

  describe("#commands", function() {
    it("is an object containing Motor commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a('function');
      }
    });
  });

  describe("#turnOn", function() {
    it("writes a high value to the digital pin", function() {
      driver.turnOn();

      expect(driver.isOn).to.be.eql(true);
      expect(driver.connection.digitalWrite).to.be.calledWith(13, 1);
    });
  });

  describe("#turnOff", function() {
    it("writes a low value to the digital pin", function() {
      driver.turnOff();

      expect(driver.isOn).to.be.eql(false);
      expect(driver.connection.digitalWrite).to.be.calledWith(13, 0);
    });
  });

  describe("#toggle", function() {

    before(function() {
      stub(driver, 'turnOn');
      stub(driver, 'turnOff');
    });

    after(function() {
      driver.turnOn.restore();
      driver.turnOff.restore();
    });

    context("when @isOn is true", function() {
      it("turns the motor off", function() {
        driver.isOn = true;
        driver.toggle();

        expect(driver.turnOff).to.be.called;;
      });
    });

    context("when @isOn is false", function() {
      it("turns the motor on", function() {
        driver.isOn = false;
        driver.toggle();

        expect(driver.turnOn).to.be.called;
      });
    });
  });

  describe("#currentSpeed", function() {
    it("returns the current @speedValue of the motor", function() {
      driver.speedValue = 120;
      expect(driver.currentSpeed()).to.be.eql(120);
    });
  });

  describe("#speed", function() {
    before(function() {
      driver.speed(127.5);
    });

    it("writes the speed value to the pin via the connection", function() {
      expect(driver.connection.pwmWrite).to.be.calledWith(13, 0.5);
    });

    it("sets @speedValue to the passed value", function() {
      expect(driver.speedValue).to.be.eql(127.5);
    });

    it("sets @isOn depending on whether the speed is greater than 0", function() {
      expect(driver.isOn).to.be.eql(true);
      driver.speed(0);
      expect(driver.isOn).to.be.eql(false);
    });
  });
});
