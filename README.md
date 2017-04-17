<h1>Arduino Yun with node.js & Digital Signage Internet Of Things</h1>
==========


Introduction
---------------------------------------

<h6>Developed by MediaSignage (http://www.digitalsignage.com)</h6>
<h6>Digital Signage for IoT: http://alturl.com/zqp3z</h6>


Arduino Yun is an amazing prototyping platform that allows anyone to build a custom solution for Internet of things (IoT).
This means that you can control lights, turn on oven toasters, get real time weather info, remote control servos, automate anything, without needing a degree in electrical engineering.

While it's true that you can buy off the shelf products to enable IoT, such as Vera, Ninja Blocks etc... Arduino is unique as it allows you to:
<ol>
    <li> Create a fully customized product with very little effort</li>
    <li> Keep the cost down</li>
    <li> Creates an opportunity to build solutions for your clients and charge them accordingly</li>
    <li> You can choose from thousands of inexpensive sensors, relays, switches, and more</li>
    <li> Arduino is very popular which means you can find a ton of help and docs</li>
    <li> Arduino is easily expandable with shields (add on boards)</li>
    <li> It's 100% hackable so there are no limits</li>
</ol>

This document was created to help you get started with Arduino and Node.js as well as to take advantage of a pre-compiled binary Linux image that you can download and burn onto your own Micro SD card.
Anyone who is interested in setting up Arduino Yun with Node.js will greatly benefit from this doc.
Also, at the end of the document we cover integration between Digital Signage with Arduino as well.

To help you get started as quickly as possible we built a custom binary image that you can burn onto a micro SD card and load it directly onto the Arduino Yun.
The image includes Node.js 10.32, the Firmata drivers of Node.js and Firmata drivers for the Micro controller to allow communication between the two using the Yun bridge.
We also include a serial watchdog as well lots of sample apps, pre compiled binaries such as socket.io and more.

To summarize:
<ul>
<li>simple to follow, step by step instructions on Arduino Yun setup</li>
<li>everything that's needed to run node.js with Arduino Yun</li>
<li>provide a perfectly setup pre-compiled binary of Linux OpenWRT image allowing for a quick setup of a new Arduino Yun</li>
<li>pre compiled Firmata driver for both Node.js and as Arduino Sketch</li>
<li>web server to allow communication between Arduino Yun and Digital Signage Internet Of Things</li>
<li>built in watchdog to restart upon serial communication failure</li>
<li>App for remote control of Arduino Yun across the web using SignagePlayer LAN server gateway</li>
<li>App for socket client to connect to remote socket.io node.js server</li>
<li>lots of sample scripts and applications including cyclon.js driver</li>
<li>video tutorials, resource links and more</li>
</ul>


Why Arduino Yun and Node.js
---------------------------------------

Arduino IDE can load and compile sketches, which are C based code base that compiles into machine language and runs in a loop on top of the Arduino Yun Micro Controller (MCU).
While C is a powerful language, it can be a pain to develop in, and even more of burden to debug.

Say hello to Node.js (http://nodejs.org) Node.js, a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications.
Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js can process Javascript code right on the Arduino Yun Linux OS.
That's right, Arduino Yun comes with a built in "Linux on a chip" version of OpenWRT (https://openwrt.org)

What this means is that you can develop (and even debug) in Javascript on the Arduino Yun, and use a driver called Firmata to translate Javascript commands onto the Arduino Yun micro controller.
Essentially the Firmata is a wrapper over a serial driver that pushes bytes onto the Micro controller unit (MCU) as well as listens to data coming from the MCU.

And if you find that you do need to develop something specific in C; you'll be happy to know that we have enabled in the Firmata driver an option to send and receive Strings.
So you can add custom C functions on the Arduino MCU, and invoke them from Javascript, if you need to...

------------------------------------------------------------------------

Architecture
---------------------------------------

Below you can get a sense of how things are laid out.
The process of sending a serial byte from your own developed javascript Node.js code and all the way down onto the MCU.

<pre>
+---------------------------------+
|         Arduino Yun             |
|                                 |
|     +++++++++++++++++++++++     |
|     +   #LINUX OpenWRT#   +     |
|     +                     +     |
|     +   [Your js code]    +     |
|     +        |            +     |
|     +    [node.js]        +     |
|     +        |            +     |
|     +   [Firmata.js]      +     |
|     +        |            +     |
|     +   [serialport.js]   +     |
|     +        |            +     |
|     +++++++++++++++++++++++     |
|              |                  |
|     +++++++++++++++++++++++     |
|     + #serial Yun Bridge# +     |
|     +++++++++++++++++++++++     |
|              |                  |
|     +++++++++++++++++++++++     |
|     + #Micro Controller#  +     |
|     +        |            +     |
|     +  [Firmata C code]   +     |
|     +        |            +     |
|     + [custom functions]  +     |
|     +++++++++++++++++++++++     |
+---------------------------------+
</pre>



Arduino setup
---------------------------------------

When you first get your new Arduino Yun it will come configured as a WIFI hot spot.
This means you can connect to it directly using a mobile phone or tablet as it will serve an IP over DHCP so you connect to its built in web server.
Follow these instructions to initially setup your Arduino Yun: http://arduino.cc/en/Guide/ArduinoYun (per Windows and Mac).

Next, you will need a Micro SD card. You should get a 8GB Micro SD card.

Why 8GB you ask? since the binary OpenWRT image we built was created from a 4GB micro SD, there is a chance that it may not be exactly the same number of sectors as your 4GB Micro SD, which will result in failure as the binary image may not fit.
So to play it safe, get the next level up micro SD (8GB) and you won't have any issues burning the image in (it's only like $2.00 more, crazy how cheap memory is these days).
The binary image already has all of the Linux configuration on it including drivers, applications and configs, so you will not have to setup anything on the Linux side.

First we will begin by updating the firmware of the Arduino to version 1.5.2, so copy this updated firmware file: http://alturl.com/8ivfo onto the root micro SD card.

<pre>
openwrt-ar71xx-generic-yun-16M-squashfs-sysupgrade.bin
</pre>

Confirm the file is in the root of the Micro SD (not in sub-folder), insert onto the Micro SD slot of the Arduino Yun and reboot it.

Open a up a web browser and point it to the address of the Arduino Yun (remember it is still a hot spot serving you an IP address).
You can most likely can reach it via the IP address of: 192.168.240.1 or via http://arduino.local

Next, select to upgrade the firmware and reboot (it's the [RESET] at the bottom of the web page), it wil take a few minutes for the update to complete.

<img src="http://www.digitalsignage.com/_images/ardsc2.png"/>

Next, when the device has been updated with the latest firmware, configure it to join your wifi network (click the configure button on the web interface) and once again reboot it.

Next, we will burn the Linux OS onto the Micro SD card.

To burn the binary image we will use a HDD Sector copy application for Windows. Download it from: http://alturl.com/k333x

Install the application in Windows

<pre>
HDDRawCopy1.10Setup.exe
</pre>

Next you will need to connect the Micro SD to the PC, it should come up as a drive letter in Windows, like F:\ or something of that sort.

Next, launch HDDRawCopy, select source from file (double click) and select the downloaded file of: http://www.digitalsignage.com/arduino/PerfectArduino.imgc

Now click 'next' to select the target device, which will be the drive letter of the Micro SD (be sure tp select the correct drive letter or you may lose data by formatting the wrong device).

Next, pick the Micro SD and click start to begin the burning process of the Linux OS image onto the micro SD card, this will take a little while.

<img src="http://www.digitalsignage.com/_images/burnsd.png"/>

Once it's done you can remove the micro SD from your PC and plug it into the Arduino.

Now that the Arduino is on your WIFI or Ethernet network, you will need to know it's IP address.
The best way to figure this out is to install the Arduino IDE, from: http://arduino.cc/en/Main/Software

Next, connect the Arduino to your PC or Mac via USB cable.

Inside Arduino IDE, select the board type from: Tools > Board > Arduino Yun

Next, select Tools > Port to see it's new IP address that the Arduino received from your local network.

<img src="http://www.digitalsignage.com/_images/ardsc1.png"/>

As you can see my IP address is 192.168.1.94 (yours will be different).

Next you need to ssh (login) onto the Linux side of the Arduino.

In Mac ssh is part of the OS, in Windows, you can download cygwin which comes with ssh (https://www.cygwin.com/)

Once you confirm your Windows or Mac has the ssh command, execute ssh@YOUR_IP_ADDRESS, as in:
<pre>
ssh root@192.168.1.94
</pre>

Default password is: arduino

Select 'yes' when ssh prompts you to remember the host.

Next, while logged into the Arduino Linux, execute the commands:

<pre>
mkdir  /tmp/overlay-disabled
mkdir /tmp/overlay-disabled/etc/
cp /.extroot.md5sum /tmp/overlay-disabled/etc/extroot.md5sum
</pre>

this will create a clean md5 hash so OpenWRT accepts the Micro SD as a valid device to mount.
Don't reboot the Arduino just yet, as we need to install the Firmata driver onto the MCU of the Arduino so we can communicate with it from the node.js using the Firmata.js package.

Download from this git repository the file of:

<pre>
firmata/firmata.ino
</pre>

and put it in a directory on your Mac or PC of: firmata/firmata.ino

you will also need to download 3 more files from this repository:

<pre>
firmataSketch library\Boards.h
firmataSketch library\Firmata.cpp
firmataSketch library\Firmata.h
</pre>

You will need to override the 3 default files that ship with Arduino as this library firmata files also add support for String argument passing to allow us to run custom C functions from Node.js.
In Windows override the files at:

<pre>
C:\Program Files (x86)\Arduino\libraries\Firmata\src
</pre>

In Mac, I am not sure where are they located, it should be within the installation directory of the Arduino IDE installed App.

Next, we will burn in the firmata.ino C sketch into Arduino

In the Arduino IDE App select to open the sketch of:
<pre>
firmata/firmata.ino
</pre>

In the Arduino IDE App select Tools > Port > and select the Com port or IP address of the Arduino

Next, click update and upload to burn in the Firmata driver onto the MCU.

Once it's done, reboot the Arduino

---------------------------------------

Is it all working?
---------------------------------------


At this point you should be able to ssh back onto the Arduino, execute:

<pre>
cd /root
ls -al
</pre>

you should see a bunch of files, if you do, you are in good shape.
If you don't you must have missed a step as OpenWRT did not mount the Micro SD as the main Linux drive.
Now lets test that Node.js can communicate with the Micro controller. Type:

<pre>
/root/dev/testFirmata.js
</pre>

You should see the text below and the red LED on pin 13 should blink a few times.
If you did, GOOD JOB, the hard part is behind you.

<img src="http://www.digitalsignage.com/_images/ardsc5.gif"/>

Keep in mind that this test script will stop /root/start.js and free up the serial port so we can run the test,
so you will need to reboot Arduino one time to get the /root/start.js node daemon to start back up (we will cover start.js in just a sec).

So what's installed on the Linux OS?
---------------------------------------

Next we will review some of the cool things you got as part of the pre-installed Linux OpenWRT OS:

- serial driver and node modules
- startup script and watchdog
- socket communication
- Digital Signage web server
- More goodies...

<h5>Serial driver</h5>
In /usr/lib/node_modules/serial you will find the node.js serial driver that is the basis for all serial communication.
Also, in /usr/lib/node_modules/ you will find other node modules including express web server, firmata, underscore and others.

<h5>startup script and watchdog</h5>
under /etc/init.d/arduinostart you will find the daemon that kicks in when the Arduino is started.
It will in turn run /root/start.js which builds a communication path to the serial bridge.

The serial bridge between Linux OS and the MCU will remain occupied by start.js, so be sure to kill it before testing other scripts.

Inside C Sketch that runs on top of the MCU we have a statement of:

<pre>
delay(10000);
  Serial1.begin(9600); // Set the baud.
  while (!Serial1) {}
</pre>

Which will wait for U-boot to finish startup.  Consume all bytes until we are done.
While this hack works 95% of the time, there is still a slight chance the Arduino serial bridge will fail.
But not to worry, if it does fail, our watchdog which runs from start.js through /root/initSerial.js and it monitors the serial bridge.

If a connection is not establish within the given time frame, the Arduino Linux and MCU are restarted and messages are logged onto start.log.

To view stats.js startup script using the tail command execute:

<pre>
tail -f /tmp/start.log
</pre>

So within 1-2 boots the Serial bridge will recover, so restart your Arduino with confidence knowing you will always have a connection between the Linux OS and MCU.

<h5>/root/clientio.js socket sample script</h5>
The Arduino includes a sample socket script which connects to a socket.io sever (http://socket.io).
If you ever want to connect to a remote socket.io node.js server and bypass your LAN firewall and not have to create router maps in your local ISP's router, this is will work great.

<h5>/root/start.js Express Digital Signage web server</h5>
/root/start.js is the main script that runs on boot-up.
The includes Express server that will listen to commands on port 3840 from the SignagePlayer gateway (or any POST for that matter) and assist in remote reading and writing I/O pin data.

<h5>Sample web application to send remote commands</h5>
One of the great things about using the SignagePlayer as a LAN server (gateway) is the ability to securely send remote commands to the Arduino over the web.
This is done without having to open any firewalls or map internal IP / port addresses in your local ISP router. It's like the socket.io client, only that we at MediaSignage provide a free Socket web server for you as well as a local socket client,
which is the SignagePlayer LAN Server.

Because the SignagePlayer operate as a LAN server, and since it already connects with a socket to the remote mediaCLOUD, it can also pass through events destined to the Arduino.
To learn more about this functionally be sure to checkout the video tutorial at: http://www.digitalsignage.com/_html/signage_video.html?videoNumber=arduino


Adding custom C code on MCU
---------------------------------------

If you look at the C code in our Arduino Firmata sketch:

<pre>
firmata/firmata.ino
</pre>

you will notice that we added a snippet of C code:

<pre>
Firmata.attach(STRING_DATA, stringCallback);
</pre>

this allows you to send any arbitrary string from the Node.js side, and have it call the function:

<pre>
void stringCallback(char *myString)
{

    if (myString == "do_something") {
        // send a string back to node.js Firmata driver
        Firmata.sendString(myString);
     }
}
</pre>

and so you can add additional custom C code on the MCU while still having the convenience of using node.js for the logic part of your code.

Also if you wanted to send back a string (data) back to node.js from the MCU, simple use the function:

<pre>
Firmata.sendString(myString);
</pre>

which in turn will be received on the node.js via the function:

<pre>
 board.on('string',function(string){
        console.log('firmata log: ' + string);
    });
</pre>

Checkout /root/dev/testFirmata.js for a sample script that send and receives data to and from the MCU.

In addition, we also developed a custom function on the Sketch called seanBlinkerCallback.
This function can be executed directly from Node.js as we included the definition for the custom function as the command in Firmata.h header file:

<pre>
# define SET_SEAN_BLINKER        0xF1 // set a pin to INPUT/OUTPUT/PWM/etc
</pre>

as well as in Firmata.cpp file:

<pre>
case SET_SEAN_BLINKER:
     if(seanBlinkerCallback)
       (*seanBlinkerCallback)(storedInputData[1], storedInputData[0]);
     break;
</pre>

and call it from /root/dev/testFirmata.js using

<pre>
board.seanBlinker(125, 125);  // value 1-127
</pre>


Arduino & Digital Signage
---------------------------------------
One of the great benefits of using Arduino, is its seamless integration with the free Digital Signage service from http://www.digitalsignage.com
All you need is to install the SignagePlayer, and configure it as a LAN Server.

Once you do, you will be able to send and receive events / triggers from Arduino, as you can see below.

<img src="http://www.digitalsignage.com/_images/ardsc6.gif"/>

Pretty cool ha?

The SignagePlayer will essentially becomes a socket gateway to sending and receiving events.
This has the benefit of allowing secure socket commands to be sent to the SignagePlayer across the web and onto the SignagePlayer.
From the SignagePlayer, the events will propagate to the appropriate Arduino.

To learn more about setting the SignageStudio to send events to specific SignagePlayers / Arduino IP addresses review the video at:
http://www.digitalsignage.com/_html/signage_video.html?videoNumber=arduino

If you inspect the code in /root/start.js you will notice that it comes with a built in Express web server.
The server is pre-configured to listen to events coming from the SignagePlayer and act upon these events.

It includes crossdomain.xml to allow certain Sandbox clients (such as Adobe Flash / AIR) secure access to the web server.
Of course you can modify it to do whatever you want, but by default if you send the express web server a post, using curl or a web browser:

<pre>
curl http://192.168.1.94:3840/mcu13:1
curl http://192.168.1.94:3840/mcu13:0
</pre>

it will toggle the LED connected to pin 13 (1 == ON and 0 == OFF).

The code that manages the pin number and state is part of the example included in start.js:

<pre>
app.all("/mcu:pin", function (req, res) {
     if (!serialReady) {
         res.send("NOTREADY");
         return;
     }
     var pin = (req.params.pin).split(':')[0];
     var state = (req.params.pin).split(':')[1];

     console.log('setting pin ' + pin + ' ' + state + ' ' + getTime());

     if (state == 1) {
         board.digitalWrite(pin, board.HIGH);
     } else {
         board.digitalWrite(pin, board.LOW);
     }
     res.send("OK");

 });
</pre>


Sending commands over the web
---------------------------------------

Another sample application included in the Linux OpenWRT binary image is a web application that allows anyone to develop a Javascript based UI to send events directly
to the SignagePlayer gateway and to pass these event to the Arduino.
You will find the web app under /root/public/webcommands.html which is served by the Express web server:

<pre>
http://YOUR_ARDUINO_IP:3840/webcommands.html
</pre>

If you want to test this script online (to confirm firewall bypassing is working) visit: http://www.digitalsignage.com/arduino/webcommands.html
Enter your SignageStudio login name, password and station id (station id is retrived from Studio Pro > Stations > selected station grid).


Debugging node.js on Arduino Yun
---------------------------------------

One of the great benefits in developing in Node.js / Javascript vs C, is the ability to debug in real time your node.js code.
You can use the built in debugger in node.js, but we highly recommend using WebStorm or IntelliJ for a much better work flow: (https://www.jetbrains.com/webstorm/)

In WebStorm config the node.js as such:

<img src="http://www.digitalsignage.com/_images/ardsc8.png"/>

next, you to to create ssh tunnel (in Windows install cygwin for the open source ssh client)

<pre>
nodem --debug-brk --nolazy ./testFirmata.js
</pre>

and forward the port 5858

<pre>
ssh -L 5858:127.0.0.1:5858 root@192.168.1.76 -N
</pre>

notice that we are using nodem (m = more memory) instead of the standard node executable (part of the our Linux image).
This is because you will need to give nodejs more memory to do real time debugging, so we just created an alias env script for node which gives it that extra working room:

The normal node runs as:
<pre>
NODE_PATH=/usr/lib/node_modules /usr/bin/nodejs --stack_size=1024 --max_old_space_size=20 --max_new_space_size=2048 --max_executable_size=5 --gc_global --gc_interval=100 $@
</pre>

while nodem with extra memory runs as:

<pre>
NODE_PATH=/usr/lib/node_modules /usr/bin/nodejs --stack_size=1024 --max_old_space_size=20 --max_executable_size=50 --gc_global --gc_interval=100 $@
</pre>


What's next
---------------------------------------

In the source code you will find additional useful code and libraries which include:

- cylonExample: Robotics Javascript cylon library from: http://cylonjs.com
- echo.js: a simple way to interact between the MCU and Linux using stdin and stdout pipes
- fireAlarm.js: Javascript example using multiple INPUT / OUTPUT pins and sending curl post
- humanSensor.js: example using a human detector sensor
- restart.sh: bash to restart Arduino gracefully
- socketIOclient.js: a client library for interacting with socket.io node.js server, includes binary ws
- testFirmata.js: general test script for Firmata and simple node.js web server
- wifiResetAndReboot: reset shell script
- diskSpaceExpander: Arduino storage expander (no need if you are using our image)
- sysUpgradeImage: upgrade Arduino to release 1.5.2 (check Arduino.cc for newer builds)
- initSerial.js: boot up test for MCU to Linux bridge connection


Resources:
------------------------------------------------------------------------
- node.js: http://nodejs.org
- cylon: http://cylonjs.com
- firmata.js: https://github.com/jgautier/firmata
- arduino: http://arduino.cc
- digitalsignage.com: http://www.digitalsignage.com (free digital signage)
- start kits: http://sunfounder.com

License:
------------------------------------------------------------------------
- MIT License


