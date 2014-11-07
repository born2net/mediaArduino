var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/tty.usbmodem1421' },
  device: { name: 'gyro', driver: 'lsm9ds0g' },

  work: function(my) {
    every((1).second(), function() {
      my.gyro.getGyro(function(err, data) {
        console.log(data);
      });
    });
  }
}).start();
