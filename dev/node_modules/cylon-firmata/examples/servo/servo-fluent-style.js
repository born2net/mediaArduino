var cylon = require('cylon');

cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: {
    name: 'servo',
    driver: 'servo',
    pin: 3,
    limits: { bottom: 20, top: 160 }
  }
})

.on('ready', function(robot) {
  var angle = 0,
  increment = 20;

  setInterval(function() {
    angle += increment;

    robot.servo.angle(angle);

    console.log("Current Angle: " + (robot.servo.currentAngle()));

    if ((angle === 0) || (angle === 180)) {
      increment = -increment;
    }
  }, 1000);
})

.start();
