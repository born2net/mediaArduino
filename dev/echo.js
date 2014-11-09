#!/usr/bin/node
/**
 echo.js
 If you would rather set direct communication through piping stdin and stdout from the Linux OS
 onto the bridge and out to the MCU, you can use readline to pipe string.

 You will need to burn the C sketch at the bottom of this script onto the Arduino Yun.
 The Sketch will execute this script (/root/dev/echo.js) as a child process and use stdin and stdout
 to communicate back and fourth, so you can call functions inside the Sketch from node.js or any stdin / stdout for that matter.

 For full documentation visit: http://www.tigoe.com/pcomp/code/arduinowiring/1216/

 **/
var readline = require('readline'); // include the readline module

console.log("Hello Arduino");       // send an intial message on startup

setTimeout(function(){
   console.log('Linux is sending hello world');
},6000);

// create an interface to read lines from the Arduino:

var lineReader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});


// when you get a newline in the stdin (ends with \n),
// send a reply out the stdout:
lineReader.on('line', function (data) {
  console.log('You sent me: '+ data);
});


/*
 Running Node.js processes asynchronously using
 the Process class.

 This sketch shows how to run a node.js script as a linux shell command
 using an Arduino Yún. It starts a process running asynchronously,
 then passes bytes from the STDOUT of the process to the Arduino's
 serial port.  Any bytes from the Arduino's serial port are sent to the STDIN of the process.

 created 21 Jun 2014
 by Tom Igoe
 https://github.com/tigoe/NetworkExamples/blob/master/BridgeToNode/NodeToSerial/NodeToSerial.ino

 To use this, remove the comments below and burn onto the Arduino as the running Sketch.
 */

/*
#include <Process.h>
Process nodejs;    // make a new Process for calling Node


void setup() {
    Bridge.begin();	// Initialize the Bridge
    Serial.begin(9600);	// Initialize the Serial

    // Wait until a Serial Monitor is connected.
    while (!Serial);

    // launch the echo.js script asynchronously:
    nodejs.runShellCommandAsynchronously("node /dev/root/echo.js");
    Serial.println("Started process");
}

void loop() {
    // pass any bytes that come in from the serial port
    // to the running node process:
    if (Serial.available()) {
        if (nodejs.running()) {
            nodejs.write(Serial.read());
        }
    }

    // pass any incoming bytes from the running node process
    // to the serial port:
    while (nodejs.available()) {
        Serial.write(nodejs.read());
    }
}
*/