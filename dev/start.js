#!/usr/bin/node

setTimeout(function () {

    var Cylon = require('cylon');

    Cylon.robot({
        connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyATH0' },
        device: [
            { name: 'led', driver: 'led', pin: 13 },
            { name: 'servo', driver: 'servo', pin: 9 },
            { name: 'button', driver: 'button', pin: 2 }
        ],

        work: function (my) {

            my.button.on('push', function () {
                console.log("bye");
                process.exit();
            });

            var angle = 45;
            var counter = 0;
            my.servo.angle(angle);
            every((1).second(), function () {
                counter++;
                if (counter == 10)
                    process.exit();
                my.led.toggle();
                angle = angle + 45;
                if (angle > 135) {
                    angle = 45
                }
                my.servo.angle(angle);
            });
        }
    }).start();

}, 60000);
