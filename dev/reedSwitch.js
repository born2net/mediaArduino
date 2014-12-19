#!/usr/bin/node
/**
 fireAlarm.js
 Example firmata driver script with multiple inputs / outputs.
 Used to listen to a flame sensor and trigger buzzer and LED on fire trigger.
 Also includes button override to trigger events.
 In addition we also use a reed switch to sense when a magnet is within proximity to trigger events.
 When events are triggered, we use curl to post data to remote IP / PORT 192.168.1.81:9999, a SignagePlayer
 LAN server gateway (replace with your IP address / port set in the SignageStudio).
 **/
var firmata = require('firmata');
var exec = require('child_process').exec;
var _ = require('underscore');
var c = 0;
var board = new firmata.Board("/dev/ttyATH0", function (err) {

    console.log('starting reed listening');

    board.on('string', function (string) {
        console.log('firmata log: ' + string);
    });
    if (err) {
        console.log(err);
        board.reset();
        return;
    }

    var REED = 3;
    board.pinMode(REED, board.MODES.INPUT);
    // board.digitalWrite(REED, 1);
    board.digitalRead(REED, _.debounce(function (e) {
        if (e == 1) {
            console.log('door triggered ' + c++ );
        }
    }, 1000, true));

    //board.digitalRead(REED, function (e) {
    //    console.log(e);
    //});
});
