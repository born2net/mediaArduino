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
    <li> Arduino is very popular which means you can find a ton of help and docs</li>
    <li>Arduino is easily expandable with shields (add on boards)</li>
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
<li>App for socket client to connect to remote socket.io node.js server</li>
<li>lots of sample scripts and applications including cyclon.js driver</li>
<li>video tutorials, resource links and more</li>
</ul>


Why Arduino Yun and Node.js
---------------------------------------

Arduino IDE can load a sketch, which is C based code that compiles into machine language and runs in a loop on top of the Arduino Yun Micro Controller.
While C is a powerful language, it can be a pain to develop in C and even more of burden to debug.

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
You can follow these instructions to initially setup your Arduino Yun: http://arduino.cc/en/Guide/ArduinoYun (per Windows and Mac).

Next, you will need a Micro SD card. You should get a 16GB Micro SD card.

Why 16GB you ask? since the image we built was created from an 8GB micro SD, there is a chance that if you also get an 8GB micro SD that has a size that is a few bytes smaller, the image will not fit.
So to play it safe, get the next level up micro SD (16GB) and you won't have an issue burning the image in (it's only like $4.00 more, crazy how cheap memory is these days).
The binary image already has all of the Linux configuration on it including drivers, applications and configs, so you will not have to setup anything special on the Linux side.

First we will begin by updating the firmware of the Arduino to version 1.5.2, so copy this updated firmware file: http://alturl.com/8ivfo onto the root micro SD card.

Next, insert the Micro SD 16GB with the file:
<pre>
openwrt-ar71xx-generic-yun-16M-squashfs-sysupgrade.bin
</pre>

that was placed in the the root drive of the Micro SD (not in any sub-directory) and reboot the Arduino.

Open a up a web browser and point it to the address of the Arduino Yun (remember it is still a hot spot serving you an IP address).
You can most likely reach it via the IP address of: 192.168.240.1 or via http://arduino.local

Next, select to upgrade the firmware and reboot (it's the [RESET] at the bottom of the web page), it wil take a few minutes for the update to complete.

<img src="http://www.digitalsignage.com/_images/ardsc2.png"/>

Next, when the device has been updated with the latest firmware, configure it to join your wifi network (click the configure button on the web interface) and once again reboot it.

Next, we will burn the Linux OS onto the Micro SD card. Download it from: http://alturl.com/ytdxo

To burn the binary image we will use a HDD Sector copy application for Windows. Download it from: http://alturl.com/k333x

Install the
<pre>
HDDRawCopy1.10Setup.exe
</pre>

Next you will need to connect the Micro SD (16GB) to the PC, it should come up as a drive letter in Windows, like F:\ or something of that sort.

Next, launch HDDRawCopy, select source from file (double click) and select the downloaded file of: PerfectArduino.imgc

Next, click 'next' to select the target device, which will be the drive letter of the Micro SD (be sure tp select the correct drive letter or you may lose data by formatting the wrong device).

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

Next you need to ssh (login) onto the Linux side of the Arduino. In Mac ssh is part of the OS, in Windows, you can download cygwin which comes with ssh (https://www.cygwin.com/)

Once you confirm your Windows or Mac has the ssh command, execute ssh@YOUR_IP_ADDRESS, as in:
<pre>
ssh root@192.168.1.94
</pre>

Default password is: arduino

Select 'yes' when ssh prompts you to remember the host.

Next, while logged into the Arduino Linux, run the command:

<pre>
cp /.extroot.md5sum /tmp/overlay-disabled/etc/extroot.md5sum
</pre>

don't reboot the Arduino just yet, as we need to install the Firmata driver onto the MCU of the Arduino so we can communicate with it from the node.js using the Node.js Firmata.js package.

Download from this git repository the file of:

<pre>
FirmatNodeJs/FirmatNodeJs.ino
</pre>

and put it in a directory on youe Mac / PC of: FirmatNodeJs/FirmatNodeJs.ino

you will also need to download 3 more files:

<pre>
firmataSketch library\
firmataSketch library\Boards.h
firmataSketch library\Firmata.cpp
firmataSketch library\Firmata.h
</pre>

You will need to override the default file that ship with Arduino as these library firmata files also add support for String argument passing to allow is to run custom C functions from Node.js.
In Windows override the files at:

<pre>
C:\Program Files (x86)\Arduino\libraries\Firmata\src
</pre>

In Mac, I am not sure where are they located, should be within the installation directory of the Arduino IDE installed App.

Next, we will burn in the FirmatNodeJs.ino C sketch into Arduino

In the Arduino IDE App select to open the sketch of:
<pre>
FirmatNodeJs/FirmatNodeJs.ino
</pre>

In the Arduino IDE App select Tools > Port > and the select the Com port or IP address of the Arduino

Next, click update and upload to burn in the Firmata driver onto the MCU

Once it's done, rebboot the Arduino

At this point you should be able to ssh back onto the Arduino and when you do
<pre>
cd /root
ls -al
</pre>

you should see a bunch of files, if you do, you are in good shape. If you don't you must have missed a step.


Select the Arduino is the device type in the Arduino IDE:
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


