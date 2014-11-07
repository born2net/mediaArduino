#!/usr/bin/node

/********************************************
 Start off script which will load Firmata and
 Cylon.js on Arduino and allow for micro
 script also includes a watchdog that will
 auto restart Arduino on failure to connect
 to bridge over serial1
 *********************************************/

var fs = require('fs');
var spawn = require('child_process').spawn;
var totalCounter = 0;
var timeout = 30;
var maxRebootCycles = 10;
var logFile = '/root/restartCycles.log';

console.log('trying to init serial bridge');
var ls = spawn('/root/initSerial.js');

ls.stdout.on('data', function (msg) {
    if (msg == 'pass') {
        console.log('serial successfully initialized');
        clearInterval(intervals);
        fs.writeFileSync(logFile, 0, 'utf8');
        loadCylon();
    } else {
        updateRebootCycles();
    }
});

ls.stderr.on('data', function (data) {
    updateRebootCycles();
});

ls.on('close', function (code) {
    // console.log('child process exited with code ' + code);
});

var intervals = setInterval(function () {
    totalCounter++;
    if (totalCounter > timeout) {
        console.log('did not receive response from serial init in time');
        updateRebootCycles();
    }
}, 1000);

function rebootDevice() {
    spawn('reset-mcu');
    spawn('reboot');
    console.log('rebooting..');
    process.exit();
}

function updateRebootCycles() {
    var fileExists = fs.existsSync(logFile);
    if (!fileExists) {
        console.log('did not find restartCycles.log so stopping watchdog');
        process.exit();
    }
    var cycles = fs.readFileSync(logFile, 'utf8');
    cycles++;
    if (cycles > maxRebootCycles) {
        console.log('not rebooting since reached max reboot cycles');
        fs.writeFileSync(logFile, 0, 'utf8');
        process.exit();
    }
    fs.writeFileSync(logFile, cycles, 'utf8');
    console.log('continuing since in cycle ' + cycles);
    rebootDevice();

}

function loadCylon() {

    var Cylon = require('cylon');

    Cylon.robot({
        connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyATH0' },
        device: [
            { name: 'led', driver: 'led', pin: 13 },
            { name: 'relay', driver: 'led', pin: 3 },
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
            every((0.300).second(), function () {
                counter++;
                if (counter == 10) {
                    my.relay.turnOff()
                    process.exit();
                }

                my.led.toggle();
                my.led.brightness(Math.floor(Math.random() * 250) + 1);
                my.relay.toggle();
                angle = angle + 45;
                if (angle > 135) {
                    angle = 45
                }
                my.servo.angle(angle);
            });
        }
    }).start();
};
