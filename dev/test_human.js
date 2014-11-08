var firmata = require('firmata');
var app = require('express');

var board = new firmata.Board("/dev/ttyATH0", function (err) {

    console.log('Firmata connected');

    if (err) {
        console.log(err);
        board.reset();
        return;
    }

    function getTime(){
        var t = new Date();
        return t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds();
    }

    var HUMAN = 3;
    board.pinMode(HUMAN, board.MODES.INPUT);
    board.digitalRead(HUMAN, function (e) {
        if (e == 1)
            console.log('detected ' + getTime());
    });
});


var express = require("express");
var app = express();

/* serves main page */
app.get("/", function(req, res) {
    res.sendfile('index.htm')
});

app.post("/user/add", function(req, res) {
    /* some server side logic */
    res.send("OK");
});

/* serves all the static files */
app.get(/^(.+)$/, function(req, res){
    console.log('static file request : ' + req.params);
    res.sendfile( __dirname + req.params[0]);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});