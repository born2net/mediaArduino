#!/usr/bin/node

var firmata = require('firmata');

var board = new firmata.Board('/dev/ttyATH0',function(){
    // console.log(board);
    // board.reset();
    // board.sendString('software_Reboot');
    // board.sendString('software_Reset');
    process.stdout.write('pass');
    process.exit();
});