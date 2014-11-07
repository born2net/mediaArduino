var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: { name: 'blinkm', driver: 'blinkm' },

  work: function(my) {
    my.blinkm.stopScript();

    my.blinkm.getFirmware(function(version) {
      console.log("Started BlinkM version " + version);
    });

    my.blinkm.goToRGB(0,0,0);
    my.blinkm.getRGBColor(function(data){
      console.log("Starting Color: ", data);
    });

    every((2).seconds(), function() {
      my.blinkm.getRGBColor(function(data){
        console.log("Current Color: ", data);
      });
      my.blinkm.fadeToRandomRGB(128, 128, 128);
    });
  }
}).start();
