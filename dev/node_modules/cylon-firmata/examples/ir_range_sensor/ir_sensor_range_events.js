var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM1' },

  device: {
    name: 'sensor',
    driver: 'ir-range-sensor',
    pin: 0,
    upperLimit: 400,
    lowerLimit: 100,
    model: 'gp2y0a41sk0f'
  },

  work: function(my) {
    my.sensor.on('range', function(range){
      console.log('Range in inches ===>', range);
    });

    my.sensor.on('rangeCm', function(range){
      console.log('Range in cm ===>', range);
    });
  }

}).start();
