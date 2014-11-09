
var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyATH0' },
  device: [
     { name: 'servo', driver: 'servo', pin: 9 },
     { name: 'led', driver: 'led', pin: 13 },
     { name: 'button', driver: 'button', pin: 2 }
  ],

  work: function(my) {
  
    my.button.on('push', function() {
       console.log("bye");
       process.exit();
    });
                
    var angle = 45 ;
    my.servo.angle(angle);
    every((1).second(), function() {
      my.led.toggle();
      angle = angle + 45 ;
      if (angle > 135) {
        angle = 45
      }
      my.servo.angle(angle);
    });
  }
}).start();
