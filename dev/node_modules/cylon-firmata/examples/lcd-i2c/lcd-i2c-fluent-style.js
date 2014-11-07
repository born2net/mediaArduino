var cylon = require('cylon');

cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: { name: 'lcd', driver: 'lcd' }
})

.on('ready', function(my) {
  my.lcd.print("Hello!");
})

.start();
