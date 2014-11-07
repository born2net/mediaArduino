var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyATH0' },

  devices: [
    { name: 'led', driver: 'led', pin: 13 },
    { name: 'button', driver: 'button', pin: 2 }
  ],

  work: function(my) {
    setInterval(function(){
      my.led.toggle();
    },30);
    my.button.on('push', function() {
      my.led.toggle()
    });
  }
}).start();
