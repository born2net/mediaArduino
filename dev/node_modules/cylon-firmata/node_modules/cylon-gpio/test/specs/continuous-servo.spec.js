"use strict";

var ContinuousServo = source("continuous-servo");

describe("ContinuousServo", function() {
  var driver = new ContinuousServo({
    name: 'serv',
    device: {
      connection: { servoWrite: spy() },
      pin: 13
    }
  });

  describe("#constructor", function() {
    it("sets @pin to the provided device's pin", function() {
      expect(driver.pin).to.be.eql(13);
    });

    it("sets @angleValue to 0 by default", function() {
      expect(driver.angleValue).to.be.eql(0);
    });
  });

  describe("#commands", function() {
    it("is an object containing ContinuousServo commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a('function');
      }
    });
  });

  describe("#stop", function() {
    it('writes a value of 90 to the servo', function() {
      driver.stop();
      expect(driver.connection.servoWrite).to.be.calledWith(13, 90);
    });
  });

  describe("#clockwise", function() {
    it('writes a value of 180 to the servo', function() {
      driver.clockwise();
      expect(driver.connection.servoWrite).to.be.calledWith(13, 180);
    });
  });

  describe("#counterClockwise", function() {
    it('writes a value of 180 to the servo', function() {
      driver.counterClockwise();
      expect(driver.connection.servoWrite).to.be.calledWith(13, 89);
    });
  });
});
