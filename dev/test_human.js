var firmata = require('firmata');

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
