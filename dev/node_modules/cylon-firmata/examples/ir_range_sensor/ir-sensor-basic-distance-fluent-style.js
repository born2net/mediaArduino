var cylon = require('cylon');

cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: {
    name: 'sensor',
    driver: 'ir-range-sensor',
    pin: 0,
    upperLimit: 400,
    lowerLimit: 100,
    model: 'gp2y0a41sk0f'
  }
})

.on('ready', function(robot) {
  setInterval(function(){
    var range = robot.sensor.range();
    console.log('Range ===>', range);
  }, 1000);
})

.start();
