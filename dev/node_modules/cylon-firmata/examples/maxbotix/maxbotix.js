var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: { name: 'maxbotix', driver: 'maxbotix' },

  work: function(my) {
    every((1).seconds(), function() {
      my.maxbotix.range(function(data) {
        console.log("range: " + data);
      });
    });
  }
}).start();
