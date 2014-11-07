'use strict';

var Cylon = require('cylon');

var LCD = source("lcd");

describe("Cylon.Drivers.I2C.LCD", function() {
  var driver = new LCD({
    name: 'display',
    device: {
      connection: {},
      emit: spy()
    }
  });

  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  describe("#constructor", function() {
    it("sets @address to 0x27", function() {
      expect(driver.address).to.be.eql(0x27);
    });

    it("sets @_backlightVal to NOBACKLIGHT", function() {
      expect(driver._backlightVal).to.be.eql(0x00);
    });

    it("sets @_displayfunction", function() {
      expect(driver._displayfunction).to.be.eql(0x00 | 0x08 | 0x00);
    });

    it("sets @_displaycontrol", function() {
      expect(driver._displaycontrol).to.be.eql(0x04 | 0x00 | 0x00);
    });

    it("sets @_displaymode", function() {
      expect(driver._displaymode).to.be.eql(0x02 | 0x00);
    });
  });

  describe("#commands", function() {
    it("is an object containing LCD commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a('function');
      }
    });
  });

  describe("#start", function() {
    var callback;

    var commands = ["_expanderWrite", "_write4bits", "_sendCommand",
                    "clear", "displayOn", "home"];


    beforeEach(function() {
      callback = spy();
      stub(Cylon.Utils, 'sleep');

      for (var i = 0; i < commands.length; i++) {
        stub(driver, commands[i]);
      }

      driver.start(callback);
    });

    afterEach(function() {
      Cylon.Utils.sleep.restore();

      for (var i = 0; i < commands.length; i++) {
        driver[commands[i]].restore();
      }
    });

    it("writes the backlight val Cylon.Utils.after 50ms", function() {
      expect(driver._expanderWrite).to.be.calledWith(0x00);
    });

    it("writes data Cylon.Utils.after another second", function() {
      expect(driver._write4bits).to.be.calledWith(0x03 << 4);
      expect(driver._write4bits).to.be.calledWith(0x02 << 4);
    });

    it("sends the displayfunction command", function() {
      expect(driver._sendCommand).to.be.calledWith(0x20 | driver._displayfunction);
    });

    it("turns the display on", function() {
      expect(driver.displayOn).to.be.called;
    });

    it("clears the display", function() {
      expect(driver.clear).to.be.called;
    });

    it("sets the entry mode, and default text direction", function() {
      expect(driver._sendCommand).to.be.calledWith(0x04 | driver._displaymode);
      expect(driver.home).to.be.called;
    });
  });

  describe("#clear", function() {
    beforeEach(function() {
      stub(Cylon.Utils, 'sleep');
      stub(driver, '_sendCommand');
      driver.clear();
    });

    afterEach(function() {
      Cylon.Utils.sleep.restore();
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to clear the display", function() {
      expect(driver._sendCommand).to.be.calledWith(0x01);
    });

    it("Cylon.Utils.sleeps for 2ms", function() {
      expect(Cylon.Utils.sleep).to.be.calledWith(2);
    });
  });

  describe("#home", function() {
    beforeEach(function() {
      stub(Cylon.Utils, 'sleep');
      stub(driver, '_sendCommand');
      driver.home();
    });

    afterEach(function() {
      Cylon.Utils.sleep.restore();
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to move the cursor to home", function() {
      expect(driver._sendCommand).to.be.calledWith(0x02);
    });

    it("Cylon.Utils.sleeps for 2ms", function() {
      expect(Cylon.Utils.sleep).to.be.calledWith(2);
    });
  });

  describe("#setCursor", function() {
    beforeEach(function() {
      stub(driver, '_sendCommand');
      driver.setCursor(10, 10);
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to move the display cursor", function() {
      expect(driver._sendCommand).to.be.calledWith(128);
    });
  });

  describe("#displayOff", function() {
    beforeEach(function() {
      stub(driver, '_sendCommand');
      driver.displayOff();
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to turn the display off", function() {
      expect(driver._sendCommand).to.be.calledWith(0x08 | driver._displaycontrol);
    });

    it("changes @_displaycontrol", function() {
      expect(driver._displaycontrol).to.be.eql(0);
    });
  });

  describe("#displayOn", function() {
    beforeEach(function() {
      stub(driver, '_sendCommand');
      driver.displayOn();
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to turn the display on", function() {
      expect(driver._sendCommand).to.be.calledWith(0x08 | driver._displaycontrol);
    });

    it("changes @_displaycontrol", function() {
      expect(driver._displaycontrol).to.be.eql(0x04);
    });
  });

  describe("#cursorOff", function() {
    beforeEach(function() {
      stub(driver, '_sendCommand');
      driver.cursorOff();
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to turn the cursor on", function() {
      expect(driver._sendCommand).to.be.calledWith(0x08 | driver._displaycontrol);
    });

    it("changes @_displaycontrol", function() {
      expect(driver._displaycontrol).to.be.eql(0x04);
    });
  });

  describe("#cursorOn", function() {
    beforeEach(function() {
      stub(driver, '_sendCommand');
      driver.cursorOn();
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to turn the cursor on", function() {
      expect(driver._sendCommand).to.be.calledWith(0x08 | driver._displaycontrol);
    });

    it("changes @_displaycontrol", function() {
      expect(driver._displaycontrol).to.be.eql(0x06);
    });
  });

  describe("#cursorOff", function() {
    beforeEach(function() {
      stub(driver, '_sendCommand');
      driver.cursorOff();
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to turn the cursor on", function() {
      expect(driver._sendCommand).to.be.calledWith(0x08 | driver._displaycontrol);
    });

    it("changes @_displaycontrol", function() {
      expect(driver._displaycontrol).to.be.eql(0x04);
    });
  });

  describe("#blinkOff", function() {
    beforeEach(function() {
      stub(driver, '_sendCommand');
      driver.blinkOff();
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to turn the blink on", function() {
      expect(driver._sendCommand).to.be.calledWith(0x08 | driver._displaycontrol);
    });

    it("changes @_displaycontrol", function() {
      expect(driver._displaycontrol).to.be.eql(0x04);
    });
  });

  describe("#blinkOn", function() {
    beforeEach(function() {
      stub(driver, '_sendCommand');
      driver.blinkOn();
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to turn the blink on", function() {
      expect(driver._sendCommand).to.be.calledWith(0x08 | driver._displaycontrol);
    });

    it("changes @_displaycontrol", function() {
      expect(driver._displaycontrol).to.be.eql(0x05);
    });
  });

  describe("#backlightOff", function() {
    beforeEach(function() {
      stub(driver, '_expanderWrite');
      driver.backlightOff();
    });

    afterEach(function() {
      driver._expanderWrite.restore();
    });

    it("calls #_expanderWrite", function() {
      expect(driver._expanderWrite).to.be.calledWith(0);
    });

    it("changes @_backlightVal", function() {
      expect(driver._backlightVal).to.be.eql(0);
    });
  });

  describe("#backlightOn", function() {
    beforeEach(function() {
      stub(driver, '_expanderWrite');
      driver.backlightOn();
    });

    afterEach(function() {
      driver._expanderWrite.restore();
    });

    it("calls #_expanderWrite", function() {
      expect(driver._expanderWrite).to.be.calledWith(0);
    });

    it("changes @_backlightVal", function() {
      expect(driver._backlightVal).to.be.eql(8);
    });
  });

  describe("#print", function() {
    var chars = "hello world".split('');

    beforeEach(function() {
      stub(driver, '_writeData');
      driver.print("hello world");
    });

    afterEach(function() {
      driver._writeData.restore();
    });

    it("writes the string chars to the LCD with #_writeData", function() {
      for (var i = 0; i < chars; i++) {
        expect(driver._writeData).to.be.calledWith(chars[i]);
      }
    });
  });

  describe("#_write4bits", function() {
    beforeEach(function() {
      stub(driver, '_expanderWrite');
      stub(driver, '_pulseEnable');
      driver._write4bits(0xff)
    });

    afterEach(function() {
      driver._expanderWrite.restore();
      driver._pulseEnable.restore();
    });

    it("calls #_expanderWrite with the passed val", function() {
      expect(driver._expanderWrite).to.be.calledWith(0xff);
    });

    it("calls #_pulseEnable with the passed val", function() {
      expect(driver._pulseEnable).to.be.calledWith(0xff);
    });
  });

  describe("#_expanderWrite", function() {
    beforeEach(function() {
      driver.connection.i2cWrite = stub();
      driver._expanderWrite(0xff);
    });

    afterEach(function() {
      driver.connection.i2cWrite = undefined;
    });

    it("calls #i2cWrite with the passed data", function() {
      expect(driver.connection.i2cWrite).to.be.calledWith(0x27, 0xff | driver._backlightVal);
    });
  });

  describe("#_pulseEnable", function() {
    beforeEach(function() {
      stub(driver, '_expanderWrite');
      driver._pulseEnable(0xff);
    });

    afterEach(function() {
      driver._expanderWrite.restore();
    });

    it("calls #expanderWrite", function() {
      expect(driver._expanderWrite).to.be.calledWith(0xff | 0x04)
      expect(driver._expanderWrite).to.be.calledWith(0xff & ~0x04)
    });
  });

  describe("#_sendCommand", function() {
    beforeEach(function() {
      stub(driver, '_sendData');
      driver._sendCommand(0xff);
    });

    afterEach(function() {
      driver._sendData.restore();
    });

    it("applies the provided value to #_sendData", function() {
      expect(driver._sendData).to.be.calledWith(0xff, 0);
    });
  });

  describe("#_writeData", function() {
    beforeEach(function() {
      stub(driver, '_sendData');
      driver._writeData(0xff);
    });

    afterEach(function() {
      driver._sendData.restore();
    });

    it("applies the provided value to #_sendData", function() {
      expect(driver._sendData).to.be.calledWith(0xff, 0x01);
    });
  });

  describe("#_sendData", function() {
    beforeEach(function() {
      stub(driver, '_write4bits');
      driver._sendData(0xAB, 0xEE);
    });

    afterEach(function() {
      driver._write4bits.restore();
    });

    it("writes the data using #_write4bits", function() {
      expect(driver._write4bits).to.be.calledWith(0xA0 | 0xEE);
      expect(driver._write4bits).to.be.calledWith(0xFE | 0xEE);
    });
  });
});
