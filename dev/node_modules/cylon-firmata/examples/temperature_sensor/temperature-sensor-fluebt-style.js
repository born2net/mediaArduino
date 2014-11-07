var cylon = require("cylon");

cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/cu.usbmodem1451' },
  // For this example we are using TMP36 sensor
  device:     { name: 'sensor', driver: 'analogSensor', pin: 0 },
})

.on('ready', function(robot) {
  var analogValue = 0,
  voltage = 0,
  temperature = 0;

  setInterval(function() {
    analogValue = robot.sensor.analogRead();
    voltage     = (analogValue * 5.0) / 1024;
    temperature = (voltage - 0.5) * 100;

    console.log('Current Temperature => ', temperature);
  }, 5000);
})

.start();
