#!/usr/bin/node

/**
 cylonButtonLED.js
 Powered by the Robotics cylon library from: http://cylonjs.com
 Sample script that uses the underline firmata / serial driver to control LED, Servo, relay and button.
 **/

var Cylon = require('cylon');

var total = 0;
Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyATH0' },

  devices: [
    { name: 'led', driver: 'led', pin: 13 },
    { name: 'button', driver: 'button', pin: 2 }
  ],

  work: function(my) {
    setInterval(function(){
      total++;
      if (total > 50)
        process.exit();
      my.led.toggle();
    },700);
    my.button.on('push', function() {
      my.led.toggle()
    });
  }
}).start();

/**
 Run multiple drivers using the Cylon library
 @method cylonMultipleDrivers
 @return
 **/
function cylonMultipleDrivers() {

  var Cylon = require('cylon');

  Cylon.robot({
    connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyATH0' },
    device: [
      { name: 'led', driver: 'led', pin: 13 },
      { name: 'relay', driver: 'led', pin: 3 },
      { name: 'servo', driver: 'servo', pin: 9 },
      { name: 'button', driver: 'button', pin: 2 }
    ],

    work: function (my) {

      my.button.on('push', function () {
        console.log("bye");
        process.exit();
      });

      var angle = 45;
      var counter = 0;
      my.servo.angle(angle);
      every((0.300).second(), function () {
        counter++;
        if (counter == 10) {
          my.relay.turnOff()
          process.exit();
        }

        my.led.toggle();
        my.led.brightness(Math.floor(Math.random() * 250) + 1);
        my.relay.toggle();
        angle = angle + 45;
        if (angle > 135) {
          angle = 45
        }
        my.servo.angle(angle);
      });
    }
  }).start();
};