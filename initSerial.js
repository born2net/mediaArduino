#!/usr/bin/node

var firmata = require('firmata');

var board = new firmata.Board('/dev/ttyATH0',function(){
    // console.log(board);
    // board.reset();
    process.stdout.write('pass');
    process.exit();
});