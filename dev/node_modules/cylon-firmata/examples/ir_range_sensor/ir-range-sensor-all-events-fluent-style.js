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
  var highest,
      lowest;

  robot.sensor.on('analogRead', function(val){
    console.log('Analor Read Value ===>', val);

    if (highest === undefined) {
      highest = val;
    }

    if (lowest === undefined) {
      lowest = val;
    }

    highest = (val > highest) ? val : highest;
    lowest = (val < lowest) ? val : lowest;

    console.log("Highest IR Range Value read: ", highest);
    console.log("Lowest IR Range Value read: ", lowest);

    console.log("Range in CM =>", robot.sensor.rangeCm());
    console.log("Range in Inches =>", robot.sensor.range());
  });

  robot.sensor.on('upperLimit', function(val) {
    console.log("Upper limit reached ===> " + val);
  });

  robot.sensor.on('lowerLimit', function(val) {
    console.log("Lower limit reached ===> " + val);
  });
})

.start();
