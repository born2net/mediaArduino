#!/usr/bin/node

var Cylon = require('cylon');

var total = 0;
Cylon.robot({
    connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyATH0' },

    devices: [
        { name: 'led', driver: 'led', pin: 13 },
        { name: 'button', driver: 'button', pin: 2 }
    ],

    work: function(my) {
        setInterval(function(){
            total++;
            if (total > 50)
                process.exit();
            my.led.toggle();
        },700);
        my.button.on('push', function() {
            my.led.toggle()
        });
    }
}).start();



