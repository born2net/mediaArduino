var cylon = require('cylon');

cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: { name: 'led', driver: 'led', pin: 3 },
})

.on('ready', function(robot) {
  var brightness = 0,
  fade = 5;

  setInterval(function() {
    brightness += fade;
    robot.led.brightness(brightness);
    if ((brightness === 0) || (brightness === 255)) { fade = -fade; }
  }, 500);
})

.start();
