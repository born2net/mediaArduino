'use strict';

var BlinkM = source('blinkm'),
  Hmc6352 = source('hmc6352'),
  Mpl115A2 = source('mpl115a2'),
  Bmp180 = source('bmp180'),
  Mpu6050 = source('mpu6050'),
  LCD = source('lcd');

var module = source("cylon-i2c");
var Cylon = require("cylon");

describe("I2C", function() {
  describe("#driver", function() {
    var opts = { device: { connection: {} }, extraParams: {} };

    context("with 'blinkm'", function() {
      it("returns a BlinkM driver instance", function() {
        opts.name = 'blinkm';
        var driver = module.driver(opts);
        expect(driver).to.be.an.instanceOf(BlinkM);
      });
    });

    context("with 'hmc6352'", function() {
      it("returns a Hmc6352 driver instance", function() {
        opts.name = 'hmc6352';
        var driver = module.driver(opts);
        expect(driver).to.be.an.instanceOf(Hmc6352);
      });
    });

    context("with 'mpl115a2'", function() {
      it("returns a Mpl115A2 driver instance", function() {
        opts.name = 'mpl115a2';
        var driver = module.driver(opts);
        expect(driver).to.be.an.instanceOf(Mpl115A2);
      });
    });

    context("with 'bmp180'", function() {
      it("returns a Bmp180 driver instance", function() {
        opts.name = 'bmp180';
        var driver = module.driver(opts);
        expect(driver).to.be.an.instanceOf(Bmp180);
      });
    });

    context("with 'mpu6050'", function() {
      it("returns a Mpu6050 driver instance", function() {
        opts.name = 'mpu6050';
        var driver = module.driver(opts);
        expect(driver).to.be.an.instanceOf(Mpu6050);
      });
    });

    context("with 'lcd'", function() {
      it("returns a LCD driver instance", function() {
        opts.name = 'lcd';
        var driver = module.driver(opts);
        expect(driver).to.be.an.instanceOf(LCD);
      });
    });

    context("with an invalid driver name", function() {
      it("returns null", function() {
        var result = module.driver({name: 'notavaliddriver'});
        expect(result).to.be.eql(null);
      });
    });
  });

  describe("#register", function() {
    var robot;
    beforeEach(function() {
      robot = { registerDriver: spy() };
      stub(Cylon.Logger, 'debug');
      module.register(robot);
    });

    afterEach(function() {
      Cylon.Logger.debug.restore();
    });

    it("registers the BlinkM driver", function() {
      expect(Cylon.Logger.debug).to.be.calledWithMatch("Registering i2c BlinkM driver");
      expect(robot.registerDriver).to.be.calledWith("cylon-i2c", "blinkm");
    });

    it("registers the HMC6352 driver", function() {
      expect(Cylon.Logger.debug).to.be.calledWithMatch("Registering i2c HMC6352 driver");
      expect(robot.registerDriver).to.be.calledWith("cylon-i2c", "hmc6352");
    });

    it("registers the MPL115A2 driver", function() {
      expect(Cylon.Logger.debug).to.be.calledWithMatch("Registering i2c MPL115A2 driver");
      expect(robot.registerDriver).to.be.calledWith("cylon-i2c", "mpl115a2");
    });

    it("registers the BMP180 driver", function() {
      expect(Cylon.Logger.debug).to.be.calledWithMatch("Registering i2c BMP180 driver");
      expect(robot.registerDriver).to.be.calledWith("cylon-i2c", "bmp180");
    });

    it("registers the MPU6050 driver", function() {
      expect(Cylon.Logger.debug).to.be.calledWithMatch("Registering i2c MPU6050 driver");
      expect(robot.registerDriver).to.be.calledWith("cylon-i2c", "mpu6050");
    });

    it("registers the LCD driver", function() {
      expect(Cylon.Logger.debug).to.be.calledWithMatch("Registering i2c LCD driver");
      expect(robot.registerDriver).to.be.calledWith("cylon-i2c", "lcd");
    });
  });
});
