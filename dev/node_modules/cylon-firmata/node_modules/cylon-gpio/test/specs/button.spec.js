"use strict";

var Button = source("button");

describe("Button", function() {
  var driver = new Button({
    name: 'button',
    device: { connection: 'connect', pin: 13 }
  });

  describe("constructor", function() {
    it("sets @pin to the passed device's pin", function() {
      expect(driver.pin).to.be.eql(13);
    });

    it("sets @pressed to false by default", function() {
      expect(driver.pressed).to.be["false"];
    });
  });

  describe("#commands", function() {
    it("is an object containing Button commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a('function');
      }
    });
  });

  describe("on the 'data' event", function() {
    var callback = function() {},
        originalConnection;

    before(function() {
      originalConnection = driver.connection;

      driver.connection = { digitalRead: stub() };
      driver.device = { emit: spy() };
    });

    context("when 1", function() {
      before(function() {
        driver.connection.digitalRead.callsArgWith(1, null, 1);
        driver.start(callback);
      });

      it("emits 'press'", function() {
        expect(driver.device.emit).to.be.calledWith('press');
      });

      it('sets @isPressed to true', function() {
        expect(driver.isPressed()).to.be.true;
      });
    });

    context("when 0", function() {
      before(function() {
        driver.connection.digitalRead.callsArgWith(1, null, 0);
        driver.start(callback);
      });

      it("emits 'release'", function() {
        expect(driver.device.emit).to.be.calledWith('release');
      });

      it('sets @isPressed to false', function() {
        expect(driver.isPressed()).to.be.false;
      });
    });
    context("when 1 and prevState == 0", function() {
      before(function() {
        driver.connection.digitalRead.callsArgWith(1, 1);
        driver.connection.digitalRead.callsArgWith(1, 0);
        driver.start(callback);
      });

      it("emits 'push'", function() {
        expect(driver.device.emit).to.be.calledWith('push');
      });
    });
  });
});
