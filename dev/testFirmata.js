console.log('starting...');

var ledPin = 13;
var firmata = require('firmata');

var board = new firmata.Board("/dev/ttyATH0", function (err) {

    board.on('string',function(string){
        console.log('firmata log: ' + string);
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
