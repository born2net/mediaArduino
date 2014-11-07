# BlinkM

For this example, we're going to use the `cylon-firmata` module to blink a light
using BlinkM.

Before we start, make sure you've got the `cylon-firmata` module installed.

First, let's import Cylon:

    var Cylon = require('cylon');

With Cylon imported, we can start defining our robot.

    Cylon.robot({

Our robot will be using an Arduino, and communicating over the Firmata protocol

      connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },

And we'll have one device, a BlinkM led.

      device: { name: 'blinkm', driver: 'blinkm' },

We'll now set up our robot's work.

      work: function(my) {

We stop the default BlinkM's light script

        my.blinkm.stopScript();

We'll request the BlinkM's version, and print that to the console

        my.blinkm.getFirmware(function(version) {
          console.log("Started BlinkM version " + version);
        });

By default, we'll turn the LED off

        my.blinkm.goToRGB(0,0,0);

We print the default starting color (in this case 0,0,0 since we turned the led off)

        my.blinkm.getRGBColor(function(data){
          console.log("Starting Color: ", data)
        });

Now, every 2 seconds, we'll change the LED color to a random value:

        every((2).seconds(), function() {
          my.blinkm.getRGBColor(function(data){
            console.log("Current Color: ", data);
          });
          my.blinkm.fadeToRandomRGB(128, 128, 128);
        });
      }

Now that our robot knows what to do, let's get started:

    }).start();
