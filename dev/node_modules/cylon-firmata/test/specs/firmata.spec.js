'use strict';

var Cylon = require('cylon');
var LibFirmata = require('firmata');

var adaptor = source('firmata');

describe('Cylon.Adaptors.Firmata', function() {
  var firmata;

  beforeEach(function() {
    firmata = new adaptor({
      name: "Firmata",
      connection: { port: "/dev/ttyACM0", emit: spy() }
    });
  });

  it('should inherit from Cylon.Adaptor', function(){
    expect(adaptor.__super__).to.be.eql(Cylon.Adaptor.prototype)
  })

  describe("constructor", function() {
    it("sets @board to an empty string by default", function() {
      expect(firmata.board).to.be.eql("");
    });

    it("sets @i2cReady to false by default", function() {
      expect(firmata.i2cReady).to.be.eql(false);
    });
  });

  describe("#commands", function() {
    it("returns an array of Firmata command names", function() {
      var commands = firmata.commands;

      expect(commands).to.be.a('array');

      for (var i = 0; i < commands.length; i++) {
        expect(commands[i]).to.be.a('string');
      }
    });
  });

  describe("#connect", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      stub(LibFirmata, 'Board').callsArg(1);
      stub(firmata, 'proxyMethods');

      firmata.connect(callback);
    });

    afterEach(function() {
      LibFirmata.Board.restore();
      firmata.proxyMethods.restore();
    });

    it("sets @board to a new LibFirmata.Board instance", function() {
      expect(LibFirmata.Board).to.be.calledWithNew;
      expect(firmata.board).to.be.eql({});
    });

    it("runs the callback when the board is connected", function() {
      expect(callback).to.be.called;
    });

    it("emits 'connect' when the board is connected", function() {
      expect(firmata.connection.emit).to.be.calledWith('connect');
    });

    it("proxies methods from the board to the adaptor instance", function() {
      expect(firmata.proxyMethods).to.be.calledWith(
        firmata.commands,
        firmata.board,
        firmata
      );
    });
  });

  describe("#disconnect", function() {
    var cb;

    beforeEach(function() {
      firmata.board = { reset: spy() };
      cb = spy();

      firmata.disconnect(cb);
    });

    it("calls #disconnect on the board", function() {
      expect(firmata.board.reset).to.be.called;
    });

    it("triggers the provided callback", function() {
      expect(cb).to.be.called;
    });
  });

  describe("#digitalRead", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      firmata.board = {
        pinMode: spy(),
        digitalRead: stub().callsArgWith(1, 1),
        MODES: { INPUT: 'r' }
      };

      firmata.digitalRead(4, callback);
    });

    it("sets the pin mode on the board to input", function() {
      expect(firmata.board.pinMode).to.be.calledWith(4, 'r');
    });

    it("uses #digitalRead to get the value from the pin", function() {
      expect(firmata.board.digitalRead).to.be.calledWith(4);
      expect(callback).to.be.calledWith(null, 1);
    });
  });

  describe("#digitalWrite", function() {
    beforeEach(function() {
      firmata.board = {
        pinMode: spy(),
        digitalWrite: spy(),
        MODES: { OUTPUT: 'w' }
      };

      firmata.digitalWrite(4, 1);
    });

    it("sets the pin mode on the board to output", function() {
      expect(firmata.board.pinMode).to.be.calledWith(4, 'w');
    });

    it("uses #digitalWrite to write the value to the pin", function() {
      expect(firmata.board.digitalWrite).to.be.calledWith(4, 1);
    });
  });

  describe("#analogRead", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      firmata.board = { analogRead: stub().callsArgWith(1, 128) };
      firmata.analogRead(4, callback);
    });

    it("uses #analogRead to get the pin value", function() {
      expect(firmata.board.analogRead).to.be.calledWith(4);
      expect(callback).to.be.calledWith(null, 128);
    });
  });

  describe("#analogWrite", function() {
    beforeEach(function() {
      firmata.board = {
        pinMode: spy(),
        analogWrite: spy(),
        analogPins: { 'a4': 4 },
        MODES: { ANALOG: "a" }
      };

      firmata.analogWrite('a4', 0.5);
    });

    it("sets the pin mode on the board to analog", function() {
      expect(firmata.board.pinMode).to.be.calledWith(4, 'a');
    });

    it("uses #analogWrite to write the value to the pin", function() {
      expect(firmata.board.analogWrite).to.be.calledWith(4, 127.5);
    });
  });

  describe("#pwmWrite", function() {
    beforeEach(function() {
      firmata.board = {
        pinMode: spy(),
        analogWrite: spy(),
        MODES: { PWM: 'p' }
      };

      firmata.pwmWrite(4 , 0.5);
    });

    it("sets the pin mode on the board to pwm", function() {
      expect(firmata.board.pinMode).to.be.calledWith(4, 'p');
    });

    it("uses #analogWrite to write the value to the pin", function() {
      expect(firmata.board.analogWrite).to.be.calledWith(4, 127.5);
    });
  });

  describe("#servoWrite", function() {
    beforeEach(function() {
      firmata.board = {
        pinMode: spy(),
        servoWrite: spy(),
        MODES: { SERVO: 's' }
      };

      firmata.servoWrite(4, 0.5);
    });

    it("sets the pin mode on the board to servo", function() {
      expect(firmata.board.pinMode).to.be.calledWith(4, 's');
    });

    it("uses #analogWrite to write the value to the pin", function() {
      expect(firmata.board.servoWrite).to.be.calledWith(4, 90);
    });
  });

  describe("#i2cWrite", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      firmata.board = { sendI2CWriteRequest: spy() };

      stub(firmata, 'i2cConfig');
    });

    afterEach(function() {
      firmata.i2cConfig.restore();
    });

    context("when the board is configured up for i2c", function() {
      beforeEach(function() {
        firmata.i2cReady = true;
        firmata.i2cWrite('address', 'command', 'buffer', callback);
      });

      it("doesn't call #i2cConfig", function() {
        expect(firmata.i2cConfig).to.not.be.called;
      });

      it("sends a write request with #sendI2CWriteRequest", function() {
        expect(firmata.board.sendI2CWriteRequest).to.be.calledWith(
          'address',
          ['command', 'buffer']
        );
      });

      it("triggers the callback", function() {
        expect(callback).to.be.called;
      });
    });

    context("when the board is not configured up for i2c", function() {
      beforeEach(function() {
        firmata.i2cReady = false;
        firmata.i2cWrite('address', 'command', 'buffer', callback)
      });

      it("calls #i2cConfig", function() {
        expect(firmata.i2cConfig).to.be.called;
      });
    });
  });

  describe("#i2cRead", function() {
    var callback;
    beforeEach(function() {
      callback = spy();

      firmata.board = {
        sendI2CWriteRequest: spy(),
        sendI2CReadRequest: stub()
      };

      stub(firmata, 'i2cConfig');
    });

    afterEach(function() {
      firmata.i2cConfig.restore();
    });

    context("When the board is configured for i2c", function() {
      beforeEach(function() {
        firmata.i2cReady = true;
        firmata.i2cRead('address', 'command', 10, callback);
      });

      it("calls #sendI2CWriteRequest", function() {
        expect(firmata.board.sendI2CWriteRequest).to.be.called;
      });

      it("calls #sendI2CReadRequest", function() {
        expect(firmata.board.sendI2CReadRequest).to.be.called;
      });

      context("when an error occurs", function() {
        beforeEach(function() {
          firmata.board.sendI2CReadRequest.callsArgWith(2, { name: 'Data' });
          firmata.i2cRead('address', 'command', 10, callback);
        });

        it("calls the callback with an error and no data", function() {
          expect(callback).to.be.calledWith(null, { name: 'Data' });
        });
      });

      context("when data is returned", function() {
        beforeEach(function() {
          firmata.board.sendI2CReadRequest.callsArgWith(2, { name: 'Error' });
          firmata.i2cRead('address', 'command', 10, callback);
        });

        it("calls the callback with no error, and the data", function() {
          expect(callback).to.be.calledWith({ name: 'Error' }, null);
        });
      });
    });

    context("When the board is not configured for i2c", function() {
      beforeEach(function() {
        firmata.i2cReady = false;
        firmata.i2cRead('address', 'command', 10, callback)
      });

      it("calls #i2cConfig, telling it to delay for 2000ms", function() {
        expect(firmata.i2cConfig).to.be.calledWith(2000);
      });
    })
  });

  describe("#i2cConfig", function() {
    beforeEach(function() {
      firmata.board = { sendI2CConfig: spy() };
      firmata.i2cReady = false;
      firmata.i2cConfig(2000);
    });

    it("calls #sendI2CConfig on the board with the provided delay", function() {
      expect(firmata.board.sendI2CConfig).to.be.calledWith(2000);
    });

    it("sets @i2cReady to true", function() {
      expect(firmata.i2cReady).to.be.eql(true);
    });
  });
});
