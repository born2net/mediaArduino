var firmata = require('firmata');
var exec = require('child_process').exec;
var _ = require('underscore');

var board = new firmata.Board("/dev/ttyATH0", function (err) {

    console.log('fire detection on');
    // console.log(board.pins);

    board.on('string', function (string) {
        console.log('firmata log: ' + string);
    });
    if (err) {
        console.log(err);
        board.reset();
        return;
    }

    var LED = 3;
    var BUTTON = 6;
    var BUZZER = 5;
    var FIRE = 4;
    var LEDPIN = 13;
    var MAGNET = 8;

    board.pinMode(LED, board.MODES.OUTPUT);
    board.pinMode(BUTTON, board.MODES.INPUT);
    board.pinMode(MAGNET, board.MODES.INPUT);
    board.pinMode(BUZZER, board.MODES.OUTPUT);
    board.pinMode(FIRE, board.MODES.INPUT);
    board.pinMode(LEDPIN, board.MODES.OUTPUT);

    board.digitalRead(FIRE, _.debounce(function (e) {
        if (e == 1) {
            console.log('auto fire triggered');
            board.digitalWrite(LED, board.HIGH);
            board.digitalWrite(LEDPIN, board.HIGH);
            board.digitalWrite(BUZZER, board.HIGH);
            postEmergency();
            setTimeout(function(){
                endEmergency();
            },15000);
        }
    }, 2000, true));

    board.digitalRead(BUTTON, _.debounce(function (e) {
        if (e == 1) {
            console.log('manual fire triggered');
            board.digitalWrite(LED, board.HIGH);
            board.digitalWrite(LEDPIN, board.HIGH);
            board.digitalWrite(BUZZER, board.HIGH);
            postEmergency();
            setTimeout(function(){
                endEmergency();
            },15000);
        }
    }, 2000, true));

    board.digitalRead(MAGNET, function (e) {
        if (e == 1) {
            exec('curl http://192.168.1.81:9999/sendLocalEvent?eventName=iguana', function(){});
        } else {
            exec('curl http://192.168.1.81:9999/sendLocalEvent?eventName=ev1', function(){});
        }
        return false;
    });

    /*
    board.digitalRead(MAGNET, function (e) {
        if (e == 1) {
            board.digitalWrite(BUZZER, board.HIGH);
            console.log('Do you like the smell?')
        } else {
            board.digitalWrite(BUZZER, board.LOW);
            console.log('smell me please!')
        }
    });
    */

    setTimeout(function () {
        board.digitalWrite(LEDPIN, board.LOW);
    }, 500);

    setTimeout(function () {
        board.digitalWrite(LEDPIN, board.HIGH);
    }, 1000);

    setTimeout(function () {
        board.digitalWrite(LEDPIN, board.LOW);
    }, 1200);

    function postEmergency() {
        child = exec('curl http://192.168.1.81:9999/sendLocalEvent?eventName=fire',
            function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    }

    function endEmergency() {
        board.digitalWrite(LED, board.LOW);
        board.digitalWrite(LEDPIN, board.LOW);
        board.digitalWrite(BUZZER, board.LOW);
        exec('curl http://192.168.1.81:9999/sendLocalEvent?eventName=ev1',
            function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    }
});
