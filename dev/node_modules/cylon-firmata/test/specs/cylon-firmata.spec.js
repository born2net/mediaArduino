'use strict';

var GPIO = require('cylon-gpio'),
    I2C = require('cylon-i2c');

var Adaptor = source('firmata');

var module = source('cylon-firmata');

describe('cylon-firmata', function() {
  describe('#register', function() {
    var bot;

    before(function() {
      bot = { registerAdaptor: spy() };
      stub(GPIO, 'register');
      stub(I2C, 'register');

      module.register(bot);
    });

    after(function() {
      GPIO.register.restore();
      I2C.register.restore();
    });

    it("registers 'firmata' with the passed Robot", function() {
      expect(bot.registerAdaptor).to.be.calledWith('cylon-firmata', 'firmata');
    });

    it('registers the robot with the cylon-gpio module', function() {
      expect(GPIO.register).to.be.calledWith(bot);
    });

    it('registers the robot with the cylon-i2c module', function() {
      expect(I2C.register).to.be.calledWith(bot);
    });
  });

  describe("#adaptor", function() {
    it("returns a new adaptor instance", function() {
      expect(module.adaptor({})).to.be.an.instanceOf(Adaptor);
    });
  });
});
