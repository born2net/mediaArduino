#!/usr/bin/node
/**
 humanSensor.js
 Product: http://www.amazon.com/gp/product/B007XQRKD4/ref=oh_aui_detailpage_o09_s02?ie=UTF8&psc=1
 Example Human Sensor detection using the firmata driver.
 **/
var firmata = require('firmata');

var HUMAN = 3;
var LEDPIN = 13;

var board = new firmata.Board("/dev/ttyATH0", function (err) {

    console.log('Firmata connected');
    if (err) {
        console.log(err);
        board.reset();
        return;
    }
    board.pinMode(HUMAN, board.MODES.INPUT);
    board.pinMode(LEDPIN, board.MODES.OUTPUT);
    board.digitalRead(HUMAN, function (e) {
        if (e == 1)
            console.log('detected');
    });
});