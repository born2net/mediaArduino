<h1>Arduino Yun with node.js & Digital Signage integration (IoT)</h1>
==========


Introduction
---------------------------------------

<h6>Developed by MediaSignage (http://www.digitalsignage.com)</h6>
<h6>Digital Signage for IoT: http://alturl.com/zqp3z</h6>


Arduino Yun is an amazing prototyping platform that allows anyone to build a custom solution for Internet of things (IoT).
This means that you can control lights, turn on oven toasters, get real time weather info, remote control servos, anything, without needing a degree in electrical engineering.

While it's true that you can buy off the shelf products to enable IoT, such as Vera, Ninja Blocks etc, Arduino is unique as it allows you to:
<ol>
    <li> create a fully customized product with very little effort</li>
    <li> keep cost down</li>
    <li> creates opportunity to build solutions for your clients and charge them for that service</li>
    <li> you can choose from thousands of inexpensive sensors, relays, switches, and more</li>
    <li> Arduino is very popular which means you can find a ton of docs, expansion boards (shields) and help</li>
    <li> 100% hackable so there are no limits</li>
</ol>

Although this document was created first and for most to help Arduino users integrate a custom solutions of IoT and Digital Signage;
anyone who is interested in setting up Arduino Yun with Node.js will greatly benefit.

To help you get started as quickly as possible we built a custom binary image that you can burn onto a micro SD card and load it directly onto the Arduino Yun.
The image includes Node.js 10.32, the Firmata drivers of Node.js and Firmata drivers for the Micro controller to allow communication between the two using the Yun bridge.
We also include a serial watchdog, sample apps and more.

To summarize:
<ul>
<li>simple to follow, step by step instructions on Arduino Yun setup</li>
<li>everything that's needed to run node.js with Arduino Yun</li>
<li>provide a pre-compiled binary image allowing for a quick setup of a new Arduino Yun</li>
<li>pre compiled Firmata driver for both Node.js and as Arduino Sketch</li>
<li>web server to allow communication between Arduino Yun and Digital Signage Internet of things</li>
<li>built in watchdog to restart upon serial communication failure</li>
<li>App for remote control of Arduino Yun across the web using SignagePlayer LAN server gateway</li>
<li>lots of sample scripts and applications including cyclon.js driver</li>
<li>video tutorials, resource links and more</li>
</ul>


Why Arduino Yun and Node.js
---------------------------------------

Arduino IDE can load a sketch, which is C based code that compiles into machine language and runs in a loop on top of the Arduino Yun Micro Controller.
While C is a powerful language, it can be a pain to develop in and even more of pain to debug.

Say hello to Node.js (http://nodejs.org) Node.js, a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications.
Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js can process Javascript code right on the Arduino Yun Linux OS.
That's right, Arduino Yun comes with built in "Linux on a chip" version of OpenWrt (https://openwrt.org)

What this means is that you can develop (and even debug) in Javascript on the Arduino Yun, and use a driver called Firmata to translate Javascript commands onto the Arduino Yun micro controller.
Essentially the Firmata is a wrapper over a serial driver that pushes bytes onto the Micro controller unit (MCU) as well as listens to data coming from the MCU.

And if you find that you do need to develop something specific in C; you'll be happy to know that we enabled in the Firmata driver an option to send and receive strings.
So you can add custom C functions on the Arduino MCU, and invoke them from Javascript, if you need to...


------------------------------------------------------------------------

Architecture
---------------------------------------

Below you can get a sense of how things are laid out.
The process of sending a byte command from your own developed javascript code and all the way down into the MCU.

<pre>
+---------------------------------+
|         Arduino Yun             |
|                                 |
|     +++++++++++++++++++++++     |
|     +   #LINUX OpenWRT#   +     |
|     +                     +     |
|     +   [Your js cde]     +     |
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
This means you can connect to it directly using a mobile phone a tablet as it will serve an IP over DHCP and has a built in web server.
You can follow these instructions to setup your Arduino Yun: http://arduino.cc/en/Guide/ArduinoYun (per Windows and Mac).

Next we need to upgrade the Firmware on the Arduino Yun to 1.5.2, to this copy this file: http://alturl.com/8ivfo
onto a micro SD card, insert it into the Arduino and reboot.

Open a up a web browser and point it to the address of the Arduino Yun (remember it is still a hot spot serving you an IP address).
You can most likely reach it via the IP address of: 192.168.240.1 or via http://arduino.local

Next, select to upgrade the firmware and reboot (it's a red box at the bottom of the web page)

Next, when the device has been updated with the latest firmware, configure it to connect to your wifi network and once again reboot it.














Next, you will need a Micro SD card. You should get a 16GB Micro SD card.

Why 16GB you ask? since the image we built was created from an 8GB micro SD, there is a chance that if you also get an 8GB micro SD that has a size that is a few bytes smaller, the image will not fit.
So to play it safe, get the next level up micro SD (16GB) and you won't have an issue burning the image in (it's only like $4.00 more, crazy how cheap memory is these days).
The binary image already has all of the Linux configuration on it including drivers, applications and configs, so you will not have to setup anything special on the Linux side.

So to proceed with the binary image, first download it from: http://alturl.com/ytdxo

To burn the binary image we will use a HDD Sector copy for Windows. Download it from: http://alturl.com/k333x

Install the exe, run it, and select source from file, and select the downloaded file of: PerfectArduino.imgc

next, click 'next' to select the target device, and pick the Micro SD and click start to begin the burning of the OS image onto the micro SD card.

<img src="http://www.digitalsignage.com/_images/burnsd.png"/>

while the burning process is taking place, go ahead and SSH into the Arduino and we will need to edit

once the task has completed, insert the micro SD card onto the Arduino and reboot the Arduino.




Once your Arduino Yun is on WIFI or ethernet network, you will need to know it's IP address.
The best way to figure this out is to install the Arduino IDE, from: http://arduino.cc/en/Main/Software

Once installed, connect the Arduino to your PC or Mac via USB cable and in the Arduino IDE select, Tools > Port to see it's new IP address.

<img src="http://www.digitalsignage.com/_images/ardsc1.png"/>

As you can see my IP address is 192.168.1.94 (yours will be different).

Next you need to ssh (login) onto the Linux side of the Arduino. In Mac ssh is part of the OS, in Windows, you can download cygwin which comes with SSH (https://www.cygwin.com/)

<pre>
ssh root@192.168.1.94
</pre>







downloading the bin
burning it
cygwin ssh scp
ftp


Startup scripts and the Watchdog
---------------------------------------

init.d
firmata wachdog and serial driver


Adding custom C code on MCU
---------------------------------------

send and receive strings


Arduino and Digital Signage
---------------------------------------

listening to commands
sending


Sending commands over the web
---------------------------------------


What's next
---------------------------------------

sample code that's included  like clientio.js for socket.io communication
u can cylon, we have sample script

Resources:
------------------------------------------------------------------------
- node js
- cylon
- firmata.js: https://github.com/jgautier/firmata
- arduino
- digitalsignage.com
- http://sunfounder.com/


License:
------------------------------------------------------------------------
- MIT License


