# Temperature sensor

A quick example of using a temperature sensor with Cylon and Arduino.
The program will log to the console when the sensor has hit it's upper and lower limits.

Before you run this program, make sure you have the `cylon-firmata` module
installed.

First, let's load up Cylon:

    var Cylon = require('cylon');

Now that we have Cylon imported, we can start defining our robot

    Cylon.robot({

Let's define the connection to our Arduino:

    connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/cu.usbmodem1451' },

Now we can define the analog sensor we're going to use (TMP36)

    device: { name: 'sensor', driver: 'analogSensor', pin: 0, },

Now that Cylon knows about the necessary hardware we're going to be using,
we read from sensor and calculate temperature every 5 seconds:


    work: function(my) {
      var analogValue = 0;

      every((5).second(), function() {
        analogValue = my.sensor.analogRead();
        voltage     = (analogValue * 5.0) / 1024;
        temperature = (voltage - 0.5) * 100;

        console.log('Current Temperature => ', temperature);
      });
    }

Finally start the program:

    }).start();
