var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },

  device: { name: 'lcd', driver: 'lcd' },

  work: function(my) {
    my.lcd.print("Hello!");
  }

}).start();
