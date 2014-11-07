var cylon = require('cylon');

cylon.robot({
  name: 'samantha',
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0'},
  device: { name: 'sensor', driver: 'analogSensor', pin: 0, upperLimit: 900, lowerLimit: 100 }
})

.on('ready', function(bot) {
  bot.sensor.on('analogRead', function(val) {
    console.log('analog read value:', val);
    console.log('analog read value:', bot.sensor.analogRead());
  });

  bot.sensor.on('upperLimit', function(val) {
    console.log("Upper limit reached ===> " + val);
  });

  bot.sensor.on('lowerLimit', function(val) {
    console.log("Lower limit reached ===> " + val);
  });
})

.start();
