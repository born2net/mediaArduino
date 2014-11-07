var cylon = require('cylon');

cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: { name: 'motor', driver: 'motor', pin: 3 }
})

.on('ready', function(robot) {
  var speed = 0,
  increment = 5;

  setInterval(function() {
    speed += increment;
    robot.motor.speed(speed);

    console.log("Current Speed: " + (robot.motor.currentSpeed()));

    if ((speed === 0) || (speed === 255)) { increment = -increment; }
  }, 500);
})

.start();
