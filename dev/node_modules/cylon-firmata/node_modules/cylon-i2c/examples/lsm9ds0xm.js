var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/tty.usbmodem1421' },
  device: { name: 'accel', driver: 'lsm9ds0xm' },

  work: function(my) {
    every((1).second(), function() {
      my.accel.getAccel(function(err, data) {
        console.log(data);
      });
    });
  }
}).start();
