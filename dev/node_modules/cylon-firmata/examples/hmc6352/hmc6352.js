var Cylon = require('cylon');

Cylon.robot(
  {connection:
    {name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0'},

  device:
    {name: 'hmc6352', driver: 'hmc6352'},

  work: function(my) {
    every((1).second(), function() {
      my.hmc6352.heading(function(data) {
        console.log("heading: " + data);
      });
    });
  }}
).start();
