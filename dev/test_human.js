var firmata = require('firmata');
var express = require("express");
var app = express();

var HUMAN = 3;
var LEDPIN = 13;
var serialReady = false;

var board = new firmata.Board("/dev/ttyATH0", function (err) {

    console.log('Firmata connected');
    serialReady = true;
    if (err) {
        console.log(err);
        board.reset();
        return;
    }
    board.pinMode(HUMAN, board.MODES.INPUT);
    board.pinMode(LEDPIN, board.MODES.OUTPUT);
    board.digitalRead(HUMAN, function (e) {
        if (e == 1)
            console.log('detected ' + getTime());
    });
});

// curl 192.168.1.94:5000/mcu13:1
// curl 192.168.1.94:5000/webapp

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

app.all("/webapp", function (req, res) {
    res.sendfile('index.htm')
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});

function getTime() {
    var t = new Date();
    return t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds();
}