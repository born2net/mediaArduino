
var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyATH0' },

  device: { name: 'button', driver: 'button', pin: 2 },

  work: function(my) {
    my.button.on('push', function() {
      console.log("Button pushed!");
    });
  }
}).start();
