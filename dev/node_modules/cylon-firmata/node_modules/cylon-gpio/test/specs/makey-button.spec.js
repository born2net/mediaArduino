"use strict";

var MakeyButton = source("makey-button");

describe("MakeyButton", function() {
  var driver = new MakeyButton({
    name: 'button',
    device: {
      connection: { digitalRead: spy() },
      pin: 13,
      emit: spy()
    }
  });

  describe("#constructor", function() {
    it("sets @pin to the passed device's pin", function() {
      expect(driver.pin).to.be.eql(13);
    });

    it("sets @isPressed to false by default", function() {
      expect(driver.isPressed).to.be.eql(false);
    });

    it("sets @currentValue to 0 by default", function() {
      expect(driver.currentValue).to.be.eql(0);
    });

    it("sets @data to an empty array by default", function() {
      expect(driver.data).to.be.eql([]);
    });
  });

  describe("#start", function() {
    before(function() {
      this.clock = sinon.useFakeTimers();
      driver.start(function() {});
    });

    after(function() {
      this.clock.restore();
    });

    it("reads the value of the pin into @currentValue", function() {
      expect(driver.connection.digitalRead).to.be.calledWith(13);
    });

    describe("button-checking loop", function() {
      it("adds @currentValue to @data every 50ms", function() {
        expect(driver.data).to.be.eql([]);
        this.clock.tick(51);
        expect(driver.data).to.be.eql([0]);
      });

      it("keeps the array at 5 items by shifting out the oldest values", function() {
        driver.data = [];
        this.clock.tick(251);
        expect(driver.data).to.be.eql([0, 0, 0, 0, 0]);
        driver.currentValue = 1;
        this.clock.tick(151);
        expect(driver.data).to.be.eql([0, 0, 1, 1, 1]);
      });

      describe("if @averageData is greater than 0.5", function() {
        before(function() {
          driver.isPressed = true;
          driver.device.emit = spy();
          stub(driver, 'averageData').returns(0.65);
        });

        after(function() {
          driver.averageData.restore();
        });

        it("emits 'release' once", function() {
          this.clock.tick(150);
          expect(driver.device.emit).to.be.calledWith('release');
          expect(driver.device.emit).to.be.calledOnce;
        });

        it("sets @isPressed to false", function() {
          expect(driver.isPressed).to.be.eql(false);
        });
      });

      describe("if @averageData is less than 0.5", function() {
        before(function() {
          driver.isPressed = false;
          driver.device.emit = spy();
          stub(driver, 'averageData').returns(0.45);
        });

        after(function() {
          driver.averageData.restore();
        });

        it("emits 'push' once", function() {
          this.clock.tick(150);
          expect(driver.device.emit).to.be.calledWith('push');
          expect(driver.device.emit).to.be.calledOnce;
        });

        it("sets @isPressed to true", function() {
          expect(driver.isPressed).to.be.eql(true);
        });
      });
    });
  });

  describe('#averateData', function() {
    context("when @data is empty", function() {
      before(function() { driver.data = []; });

      it("returns 0", function() {
        expect(driver.averageData()).to.be.eql(0);
      });
    });

    context("when @data is an array of values", function() {
      before(function() { driver.data = [0, 0, 10, 10]; });

      it("returns an average", function() {
        expect(driver.averageData()).to.be.eql(5);
      });
    });
  });
});
