"use strict";

var module = source("cylon-gpio");
var Cylon = require('cylon');

var AnalogSensor = source('analog-sensor'),
    Button = source('button'),
    ContinuousServo = source('continuous-servo'),
    Led = source('led'),
    MakeyButton = source('makey-button'),
    Maxbotix = source('maxbotix'),
    Motor = source('motor'),
    Servo = source('servo'),
    IrRangeSensor = source('ir-range-sensor'),
    DirectPin = source('direct-pin');

describe("GPIO", function() {
  describe('#driver', function() {
    var opts = { device: { connection: {} }, extraParams: {} };

    it("can instantiate a new AnalogSensor", function() {
      opts.name = 'analogSensor';
      var driver = module.driver(opts);
      expect(driver).to.be.an.instanceOf(AnalogSensor);
    });

    it("can instantiate a new Button", function() {
      opts.name = 'button';
      var driver = module.driver(opts);
      expect(driver).to.be.an.instanceOf(Button);
    });

    it("can instantiate a new ContinuousServo", function() {
      opts.name = 'continuous-servo';
      var driver = module.driver(opts);
      expect(driver).to.be.an.instanceOf(ContinuousServo);
    });

    it("can instantiate a new LED", function() {
      opts.name = 'led';
      var driver = module.driver(opts);
      expect(driver).to.be.an.instanceOf(Led);
    });

    it("can instantiate a new MakeyButton", function() {
      opts.name = 'makey-button';
      var driver = module.driver(opts);
      expect(driver).to.be.an.instanceOf(MakeyButton);
    });

    it("can instantiate a new Maxbotix", function() {
      opts.name = 'maxbotix';
      var driver = module.driver(opts);
      expect(driver).to.be.an.instanceOf(Maxbotix);
    });

    it("can instantiate a new Motor", function() {
      opts.name = 'motor';
      var driver = module.driver(opts);
      expect(driver).to.be.an.instanceOf(Motor);
    });

    it("can instantiate a new Servo", function() {
      opts.name = 'servo';
      var driver = module.driver(opts);
      expect(driver).to.be.an.instanceOf(Servo);
    });

    it("can instantiate a new IrRangeSensor", function() {
      opts.name = 'ir-range-sensor';
      var driver = module.driver(opts);
      expect(driver).to.be.an.instanceOf(IrRangeSensor);
    });

    it("can instantiate a new DirectPin", function() {
      opts.name = 'direct-pin';
      var driver = module.driver(opts);
      expect(driver).to.be.an.instanceOf(DirectPin);
    });

    it("returns null if not passed a name", function() {
      expect(module.driver({})).to.be.eql(null);
    });
  });

  describe("#register", function() {
    var robot = { registerDriver: spy() },
        register = robot.registerDriver;

    before(function() { module.register(robot); });

    it("registers the analogSensor driver", function() {
      expect(register).to.be.calledWith('cylon-gpio', 'analogSensor');
    });

    it("registers the button driver", function() {
      expect(register).to.be.calledWith('cylon-gpio', 'button');
    });

    it("registers the ContinuousServo driver", function() {
      expect(register).to.be.calledWith('cylon-gpio', 'continuous-servo');
    });

    it("registers the LED driver", function() {
      expect(register).to.be.calledWith('cylon-gpio', 'led');
    });

    it("registers the MakeyButton driver", function() {
      expect(register).to.be.calledWith('cylon-gpio', 'makey-button');
    });

    it("registers the Maxbotix driver", function() {
      expect(register).to.be.calledWith('cylon-gpio', 'maxbotix');
    });

    it("registers the Motor driver", function() {
      expect(register).to.be.calledWith('cylon-gpio', 'motor');
    });

    it("registers the Servo driver", function() {
      expect(register).to.be.calledWith('cylon-gpio', 'servo');
    });
  });
});
