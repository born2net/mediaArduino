#!/usr/bin/node

/********************************************
 Start off script which will load Firmata
 on Arduino and allow for micro script also
 includes a watchdog that will
 auto restart Arduino on failure to connect
 to bridge over serial1
 *********************************************/

var firmata = require('firmata');
var fs = require('fs');
var spawn = require('child_process').spawn;
var totalCounter = 0;
var timeout = 30;
var maxRebootCycles = 10;
var logFile = '/root/restartCycles.log';
var board = undefined;
var LEDPIN = 13;

var serialReady = false;

console.log('trying to init serial bridge');
var child = spawn('/root/initSerial.js');

child.stdout.on('data', function (msg) {
    if (msg == 'pass') {
        console.log('serial successfully initialized');
        clearInterval(intervals);
        serialReady = true;
        fs.writeFileSync(logFile, 0, 'utf8');
        loadFirmata();
    } else {
        updateRebootCycles();
    }
});

child.stderr.on('data', function (data) {
    updateRebootCycles();
});

child.on('close', function (code) {
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
    console.log('rebooting..');
    spawn('reset-mcu');
    spawn('reboot');
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

function loadFirmata(){
    board = new firmata.Board("/dev/ttyATH0", function (err) {

        console.log('Firmata connected');
        serialReady = true;
        if (err) {
            console.log(err);
            board.reset();
            return;
        }
        board.pinMode(LEDPIN, board.MODES.OUTPUT);
    });
    loadServer();
}

function loadServer(){
    var express = require("express");
    var app = express();

    app.all("/mcu:pin", function (req, res) {
        if (!serialReady) {
            res.send("NOTREADY");
            return;
        }
        var pin = (req.params.pin).split(':')[0];
        var state = (req.params.pin).split(':')[1];

        console.log('setting pin ' + pin + ' ' + state);

        if (state == 1) {
            board.digitalWrite(pin, board.HIGH);
        } else {
            board.digitalWrite(pin, board.LOW);
        }
        res.send("OK");

    });

    app.use('/', express.static('/root/public'));

    app.all("/webapp", function (req, res) {
        res.sendfile('/root/public/index.htm')
    });

    var port = process.env.PORT || 3840;
    app.listen(port, function () {
        console.log("Listening on " + port);
    });

}