'use strict';

var Cylon = require('cylon');

var LSM9DS0G = source("lsm9ds0g");

describe("Cylon.Drivers.I2C.LSM9DS0G", function() {
  var driver = new LSM9DS0G({
    name: 'lsm9ds0g',
    device: {
      connection: {},
      pin: 13,
      emit: spy()
    }
  });

  describe("constructor", function() {
    it("sets @address to 0x6b", function() {
      expect(driver.address).to.be.eql(0x6b);
    });
  });

  describe("#commands", function() {
    it("is an object containing LSM9DS0G commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a('function');
      }
    });
  });

  describe("#start", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(driver, '_initGyro');
    });

    afterEach(function() {
      driver._initGyro.restore();
    });

    it("calls #_initGyro", function() {
      driver.start(callback);
      expect(driver._initGyro).to.be.called;
    });
  });

  describe("#getGyro", function() {
    it("must #getGyro");
  });
});
