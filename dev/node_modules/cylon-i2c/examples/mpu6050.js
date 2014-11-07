var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/tty.usbmodem1421' },
  device: { name: 'mpu6050', driver: 'mpu6050' },

  work: function(my) {
    every((1).seconds(), function() {
      my.mpu6050.getMotionAndTemp(function(data) {
        console.log(data);
      });
    });
  }
}).start();
