var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },

  device: {
    name: 'sensor',
    driver: 'ir-range-sensor',
    pin: 0,
    upperLimit: 400,
    lowerLimit: 100,
    model: 'gp2y0a41sk0f'
  },

  work: function(my) {
    every((1).seconds(), function(){
      var range = my.sensor.range();
      console.log('Range ===>', range);
    });
  }

}).start();
