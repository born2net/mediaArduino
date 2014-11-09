#!/usr/bin/node
/**
 initSerial.js
 Script is used during the boot process to test bridge connection between Linux and MCU.
**/
var firmata = require('firmata');

var board = new firmata.Board('/dev/ttyATH0',function(){
    // console.log(board);
    // board.reset();
    process.stdout.write('pass');
    process.exit();
});