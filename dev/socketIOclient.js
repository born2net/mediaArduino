var client = require('socket.io-client');
var _ = require('underscore');
var firmata = require('firmata');

// var socket = client.connect('https://secure.digitalsignage.com:442');
var io = client.connect('https://secure.digitalsignage.com:442/arduino');
var addMeOnce = false;
var nodeSourceID = 'kitchen';
var ledPin = 13;
var boardRead = false;

io.on('registerRequest', function (data) {
    io.emit('registerReply', { sourceID: nodeSourceID });
    io.emit('socketList', null);
});


io.on('sendMessage', function (data) {
    console.log(data);
    liteUp();
});

io.on('socketList', function (data) {
    _.forEach(data,function(node,a) {
        console.log('rx socket ' + node.sourceID);
        var sourceID = node.sourceID;
        if (sourceID == nodeSourceID) {
            if (addMeOnce)
                return;
            addMeOnce = true;
            addDevice(sourceID, true);
            return;
        }
        addDevice(sourceID, false);
    });
});

io.on('socketDisconnect', function (data) {
    var sourceID = data.sourceID;
    console.log('disconnected: ' + sourceID);
});

function addDevice(i_sourceID, i_me) {
}


var board = new firmata.Board("/dev/ttyATH0", function (err) {
    board.on('string', function (string) {
        console.log('firmata log: ' + string);
    });
    if (err) {
        console.log(err);
        board.reset();
        return;
    }
    setTimeout(function () {
        board.digitalWrite(ledPin, board.HIGH);
    }, 500);
    setTimeout(function () {
        board.digitalWrite(ledPin, board.LOW);
        boardRead = true;
    }, 700);
});


liteUp = function(){
    if (!boardRead)
        return;
    setTimeout(function () {
        board.digitalWrite(ledPin, board.LOW);
    }, 300);
    setTimeout(function () {
        board.digitalWrite(ledPin, board.HIGH);
    }, 700);
    setTimeout(function () {
        board.digitalWrite(ledPin, board.LOW);
    }, 1000);
    setTimeout(function () {
        board.digitalWrite(ledPin, board.HIGH);
    }, 1200);
    setTimeout(function () {
        board.digitalWrite(ledPin, board.LOW);
    }, 1500);
};


/*
socket.on('connect', function (data) {
    console.log('Connected.....');

    socket.emit('news', { my: 'data' });

    socket.on('disconnect', function(){
        console.log('disconnected.....');
    });

    socket.on('news', function (data) {
        console.log(data.hello);
        socket.emit('my other event', { my: 'data' });
    });

    socket.on('latest', function (data) {
        console.log('got latest news ' + data.more);
        socket.emit('news', { my: 'data' });
    });

});

*/


// npm install socket.io-client@0.9.16 aa aaa

/*
var io = require('socket.io-client'),
    socket = io.connect('https://secure.digitalsignage.com', {
        port: 442
    });
socket.on('connect', function () { console.log("socket connected"); });
socket.emit('private message', { user: 'me', msg: 'whazzzup?' });
    */