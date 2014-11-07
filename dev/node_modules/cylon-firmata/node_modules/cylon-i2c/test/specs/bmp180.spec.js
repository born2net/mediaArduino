'use strict';

var Cylon = require('cylon');

var Bmp180 = source("bmp180");

describe("Cylon.Drivers.I2C.Bmp180", function() {
  var driver = new Bmp180({
    name: 'bmp180',
    device: {
      connection: {},
      pin: 13,
      emit: spy()
    }
  });

  beforeEach(function() {
    // setup coefficients
    var coefficients = ["ac1", "ac2", "ac3", "ac4", "ac5",
                        "ac6", "b1", "b2", "mb", "mc", "md"];

    for (var i = 0; i < coefficients.length; i++) {
      driver[coefficients[i]] = 10;
    }
  });

  describe("constructor", function() {
    it("sets @address to 0x77", function() {
      expect(driver.address).to.be.eql(0x77);
    });
  });

  describe("#commands", function() {
    it("is an object containing BMP180 commands", function() {
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
      driver.start(callback);
    });

    afterEach(function() {
      driver.readCoefficients.restore();
    });

    it("passes callback to #readCoefficients", function() {
      expect(driver.readCoefficients).to.be.calledWith(callback);
    });
  });

  describe("#getPressure", function() {
    var callback;

    var getPressure = function() { driver.getPressure("1", callback); }

    beforeEach(function() {
      callback = spy();
      stub(driver, 'getRawTemp');
      stub(driver, 'getRawPressure');
    });

    afterEach(function() {
      driver.getRawTemp.restore();
      driver.getRawPressure.restore();
    });

    it("calls #getRawTemp", function() {
      getPressure();
      expect(driver.getRawTemp).to.be.called;
    });

    context("if #getRawTemp returns data", function() {
      beforeEach(function() {
        driver.getRawTemp.callsArgWith(0, null, 10);
      });

      it("calls #getRawPressure with the supplied mode", function() {
        getPressure();
        expect(driver.getRawPressure).to.be.calledWith("1");
      });

      context("if #getRawPressure returns data", function() {
        beforeEach(function() {
          driver.getRawPressure.callsArgWith(1, null, 20);
        });

        it("triggers the callback with the transformed data", function() {
          getPressure();
          expect(callback).to.be.calledWith(null, { press: 11276, temp: 12.8 });
        });
      });

      context("if #getRawPressure returns an error", function() {
        beforeEach(function() {
          driver.getRawPressure.callsArgWith(1, 'error');
        });

        it("triggers the callback with the error", function() {
          getPressure();
          expect(callback).to.be.calledWith("error", null);
        });
      });
    });

    context("if #getRawTemp returns an error", function() {
      beforeEach(function() {
        driver.getRawTemp.callsArgWith(0, "error");
      });

      it("triggers the callback with the error", function() {
        getPressure();
        expect(callback).to.be.calledWith("error", null);
      });
    });
  });


  describe("#getTemperature", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(driver, "getRawTemp");
    });

    afterEach(function() {
      driver.getRawTemp.restore();
    });

    it("calls #getRawTemp", function() {
      driver.getTemperature(callback);
      expect(driver.getRawTemp).to.be.called;
    });

    context("if #getRawTemp returns data", function() {
      beforeEach(function() {
        driver.getRawTemp.callsArgWith(0, null, 10);
      });

      it("triggers the callback with the transformed data", function() {
        driver.getTemperature(callback);
        expect(callback).to.be.calledWith(null, { temp: 12.8 });
      });
    });

    context("if #getRawTemp returns an error", function() {
      beforeEach(function() {
        driver.getRawTemp.callsArgWith(0, 'error');
      });

      it("triggers the callback with the error", function() {
        driver.getTemperature(callback);
        expect(callback).to.be.calledWith('error', null);
      });
    });
  });

  describe("#getAltitude", function() {
    var callback;

    var getAltitude = function() { driver.getAltitude('1', 10000, callback); };

    beforeEach(function() {
      callback = spy();
      stub(driver, 'getPressure');
    });

    afterEach(function() {
      driver.getPressure.restore();
    });

    it("uses #getPressure to read the barometric pressure", function() {
      getAltitude();
      expect(driver.getPressure).to.be.calledWith('1');
    });

    context("if #getPressure returns data", function() {
      beforeEach(function() {
        driver.getPressure.callsArgWith(1, null, { press: 50, temp: 10 });
      });

      it("triggers the callback with parsed data", function() {
        getAltitude();
        var expected = { alt: 28156.212860905558, press: 50, temp: 10 };
        expect(callback).to.be.calledWith(null, expected);
      });

      it("has a default seaLevelPressure if none is supplied", function() {
        driver.getAltitude('1', null, callback);
        var expected = { alt: 33920.64423681695, press: 50, temp: 10 };
        expect(callback).to.be.calledWith(null, expected);
      });
    });

    context("if #getPressure returns an error", function() {
      beforeEach(function() {
        driver.getPressure.callsArgWith(1, 'error');
      });

      it("triggers the callback with the error", function() {
        getAltitude();
        expect(callback).to.be.calledWith("error", null);
      });
    });
  });

  describe("#readCoefficients", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cRead = stub();
    });

    afterEach(function() {
      driver.connection.i2cRead = undefined;
    });

    it("calls #i2cRead to get coefficients from the hardware", function() {
      driver.readCoefficients(callback);
      expect(driver.connection.i2cRead).to.be.calledWith(0x77, 0xAA, 22);
    });

    context("if #i2cRead returns data", function() {
      beforeEach(function() {
        var data = [];
        for (var i = 0; i < 22; i++) { data.push(10); }
        driver.connection.i2cRead.callsArgWith(3, null, data);
      });

      it("sets coefficients based on the passed values", function() {
        driver.readCoefficients(callback);

        var coefficients = ["ac1", "ac2", "ac3", "ac4", "ac5",
                            "ac6", "b1", "b2", "mb", "mc", "md"];

        for (var i = 0; i < coefficients.length; i++) {
          expect(driver[coefficients[i]]).to.be.eql(2570);
        }
      });

      it("triggers the callback", function() {
        driver.readCoefficients(callback);
        expect(callback).to.be.calledWith();
      });

      it("emits the 'start' event", function() {
        expect(driver.device.emit).to.be.calledWith('start');
      });
    });

    context("if #i2cRead returns an error", function() {
      beforeEach(function() {
        driver.connection.i2cRead.callsArgWith(3, 'error');
      });

      it("triggers the callback with the error", function() {
        driver.readCoefficients(callback);
        expect(callback).to.be.calledWith('error');
      });
    });
  });

  describe("#getRawTemp", function() {
    var callback, clock;

    beforeEach(function() {
      callback = spy();
      clock = sinon.useFakeTimers();
      driver.connection.i2cWrite = stub();
      driver.connection.i2cRead = stub();
    });

    afterEach(function() {
      clock.restore();
      driver.connection.i2cWrite = undefined;
      driver.connection.i2cRead = undefined;
    });

    it("calls #i2cWrite to setup temperature reading", function() {
      driver.getRawTemp(callback);
      expect(driver.connection.i2cWrite).to.be.calledWith(0x77, 0xF4, [0x2E]);
    })

    context("if #i2cWrite is successful", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, null);
      });

      it("calls #i2cRead to get the temp data Cylon.Utils.after 5 ms", function() {
        driver.getRawTemp(callback);
        expect(driver.connection.i2cRead).to.not.be.called;
        clock.tick(5);
        expect(driver.connection.i2cRead).to.be.calledWith(0x77, 0xF6, 2);
      });

      context("if #i2cRead returns data", function() {
        beforeEach(function() {
          driver.connection.i2cRead.callsArgWith(3, null, [10, 10]);
        });

        it("triggers the callback with the parsed data", function() {
          driver.getRawTemp(callback);
          clock.tick(5);
          expect(callback).to.be.calledWith(null, 2570);
        });
      });

      context("if #i2cRead returns an error", function() {
        beforeEach(function() {
          driver.connection.i2cRead.callsArgWith(3, 'error');
        });

        it("triggers the callback with the error", function() {
          driver.getRawTemp(callback);
          clock.tick(5);
          expect(callback).to.be.calledWith('error', null);
        });
      });
    });

    context("if #i2cWrite returns an error", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, 'error');
      });

      it("triggers the callback with the error", function() {
        driver.getRawTemp(callback);
        expect(callback).to.be.calledWith('error');
      });
    });
  });

  describe("#getRawPressure", function() {
    var callback, clock;

    var getRawPressure = function(mode) {
      if (mode == null) { mode = '1' }
      driver.getRawPressure(mode, callback);
    };

    beforeEach(function() {
      callback = spy();
      clock = sinon.useFakeTimers();
      driver.connection.i2cWrite = stub();
      driver.connection.i2cRead = stub();
    });

    afterEach(function() {
      clock.restore();
      driver.connection.i2cWrite = undefined;
      driver.connection.i2cRead = undefined;
    });

    it("calls #i2cWrite to set up pressure reading", function() {
      getRawPressure();
      expect(driver.connection.i2cWrite).to.be.calledWith(0x77, 0xF4, [0x34]);
    });

    context("if 'mode' is outside the 0-3 bounds", function() {
      it("triggers the callback with an error", function() {
        getRawPressure(4);
        var error = new Error("Invalid pressure sensing mode")
        expect(callback).to.be.calledWith(error);
      });
    });

    context("if #i2cWrite is successful", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3);
      });

      it("calls #i2cRead Cylon.Utils.after a delay", function() {
        getRawPressure();
        expect(driver.connection.i2cRead).to.not.be.called;

        clock.tick(10);
        expect(driver.connection.i2cRead).to.be.calledWith(0x77, 0xF6, 3);
      });

      it("the delay changes depending on which mode is passed", function() {
        getRawPressure('3');

        clock.tick(10);
        expect(driver.connection.i2cRead).to.not.be.called;

        clock.tick(18);
        expect(driver.connection.i2cRead).to.be.called;
      });

      context("if #i2cRead returns data", function() {
        beforeEach(function() {
          driver.connection.i2cRead.callsArgWith(3, null, [10, 10, 10]);
        });

        it("triggers the callback with the parsed data", function() {
          getRawPressure();
          clock.tick(8);
          expect(callback).to.be.calledWith(null, 5140);
        });
      });

      context("if #i2cRead returns an error", function() {
        beforeEach(function() {
          driver.connection.i2cRead.callsArgWith(3, 'error');
        });

        it("triggers the callback with the error", function() {
          getRawPressure();
          clock.tick(8);
          expect(callback).to.be.calledWith('error', null);
        });
      });
    });

    context("if #i2cWrite returns an error", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, 'error');
      });

      it("triggers the callback with the error", function() {
        getRawPressure();
        expect(callback).to.be.calledWith('error')
      });
    });
  });
});
