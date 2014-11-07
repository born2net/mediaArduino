var cylon = require('cylon');

cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: { name: 'maxbotix', driver: 'maxbotix' }
})

.on('ready', function(robot) {
  setInterval(function() {
    robot.maxbotix.range(function(data) {
      console.log("range: " + data);
    });
  }, 1000);
})

.start();
