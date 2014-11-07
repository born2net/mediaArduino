var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },

  device: {
    name: 'servo',
    driver: 'servo',
    pin: 3,
    limits: { bottom: 20, top: 160 }
  },

  work: function(my) {
    var angle = 0,
        increment = 20;

    every((1).seconds(), function() {
      angle += increment;

      my.servo.angle(angle);

      console.log("Current Angle: " + (my.servo.currentAngle()));

      if ((angle === 0) || (angle === 180)) {
        increment = -increment;
      }
    });
  }
}).start();
