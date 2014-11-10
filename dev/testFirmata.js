#!/usr/bin/node
/**
 sampleFirmata.js
 Run this script from testFirmata.sh so it kills any previously running nodejs processes.
 Firmata driver and simple node.js web server (non Express), used for sandboxing.
 Also includes demo of calling a custom C Sketch function: board.seanBlinker(125, 125);
 as well as sending a string to the MCU: board.sendString('123456790ABCD');
 **/
var firmata = require('firmata');
var exec = require('child_process').exec, child;
var ledPin = 13;

checkSerialConnection();

function checkSerialConnection(){
    child = exec("ps | grep /usr/bin/nodejs", function (error, stdout, stderr) {
        if (error || stderr) {
            console.log('failed to check if another nodejs process is running');
            console.log(stderr);
            process.exit();
        }
        var id = stdout.split(' ')[2];
        if (parseInt(id)){
            killProcess(id);
        } else {
            firmataTest();
        }
    });
}

function killProcess(id){
    console.log('killing id ' + id);
    var cmd = "kill -9 " + id;
    exec(cmd, function (error, stdout, stderr) {
        if (error || stderr) {
            console.log('problem killing previous node process ' + stderr);
        } else {
            console.log('killed startup node.js to free up serial port');
            firmataTest();
        }
    });
}

function firmataTest(){
    console.log('running test, can take 20-30 seconds...');
    var board = new firmata.Board("/dev/ttyATH0", function (err) {
        console.log('success, connected to serial port');
        board.on('string',function(string){
            console.log('firmata log: ' + string);
            if (string=='completed...'){
                console.log('whoopeee, test passed');
                process.exit();
            }
        });

        if (err) {
            console.log(err);
            board.reset();
            return;
        }
        console.log('board.firmware: ', board.firmware);
        board.sendString('123456790ABCD'); // 13 char max
        board.seanBlinker(125, 125);  // value 1-127


        board.digitalWrite(ledPin, board.HIGH);
        setTimeout(function () {
            board.digitalWrite(ledPin, board.LOW);
        }, 2000);
        setTimeout(function () {
            board.digitalWrite(ledPin, board.HIGH);
        }, 3000);

        var url = require('url');
        var http = require('http');

        http.createServer(function (request, response) {
            var params = url.parse(request.url, true).query;

            if (params.value.toLowerCase() == 'high') {
                board.digitalWrite(ledPin, board.HIGH);
            } else {
                board.digitalWrite(ledPin, board.LOW);
            }

            response.writeHead(200);
            response.write("The value written was: " + params.value);
            response.end();
        }.bind(this)).listen(8080);
        console.log('Listening on port 8080 ...');
    });
}

