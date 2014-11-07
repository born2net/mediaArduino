# Cylon.js For Firmata

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics and physical computing using Node.js

This module provides an adaptor for microcontrollers such as Arduino that support the Firmata protocol (http://firmata.org/wiki/Main_Page). It uses the Firmata node module (https://github.com/jgautier/firmata) created by [@jgautier](https://github.com/jgautier) thank you!

Want to use Ruby on robots? Check out our sister project Artoo (http://artoo.io)

Want to use the Go programming language to power your robots? Check out our sister project Gobot (http://gobot.io).

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-firmata.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-firmata)

## Getting Started
Install the module with: `npm install cylon-firmata`

## Example

```javascript
var Cylon = require('cylon');

// Initialize the robot
Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  devices: [{name: 'led', driver: 'led', pin: 13},
            {name: 'button', driver: 'button', pin: 2}],

  work: function(my) {
    my.button.on('push', function() {my.led.toggle()});
  }
}).start();
```

## Connecting to Arduino

### OSX

The main steps are:
- Install the cylon-firmata npm module
- Find out what serial port your arduino is connected to
- Upload the Firmata protocol to the arduino
- Connect to the device using Cylon

First plug the Arduino into your computer via the USB/serial port. A dialog box will appear telling you that a new network interface has been detected. Click "Network Preferences...", and when it opens, simply click "Apply".

Install the cylon-firmata module:

```
$ npm install cylon-firmata
```

Once plugged in, use the `cylon scan serial` command to find out your connection info and serial port address:

```
$ cylon scan serial
```

Use the `cylon firmata install` command to install avrdude,
this will allow you to upload firmata to the arduino:

```
$ cylon firmata install
```

Once the avrdude uploader is installed we upload the firmata protocol to
the arduino, use the arduino serial port address found when you ran
`cylon scan serial`, or leave it blank to use the default address `/dev/ttyACM0`:

```
$ cylon firmata upload /dev/ttyACM0
```

Now you are ready to connect and communicate with the Arduino using serial port connection

### Ubuntu

The main steps are:
- Install the cylon-firmata npm module
- Find out what serial port your arduino is connected to
- Upload the Firmata protocol to the arduino
- Connect to the device using Cylon

First plug the Arduino into your computer via the USB/serial port.

Install the cylon-firmata module:

```
$ npm install cylon-firmata
```

Once plugged in, use the `cylon scan serial` command to find out your connection info and serial port address:

```
$ cylon scan serial
```

Use the `cylon firmata install` command to install avrdude,
this will allow you to upload firmata to the arduino:

```
$ cylon firmata install
```

Once the avrdude uploader is installed we upload the firmata protocol to
the arduino, use the arduino serial port address found when you ran
`cylon scan serial`, or leave it blank to use the default address `ttyACM0`:

```
$ cylon firmata upload ttyACM0
```

Now you are ready to connect and communicate with the Arduino using serial port connection

### Windows

We are currently working on docs and instructions for Windows. Please check back soon!

## Documentation
We're busy adding documentation to our web site at http://cylonjs.com/ please check there as we continue to work on Cylon.js

Thank you!

## Contributing

* All patches must be provided under the Apache 2.0 License
* Please use the -s option in git to "sign off" that the commit is your work and you are providing it under the Apache 2.0 License
* Submit a Github Pull Request to the appropriate branch and ideally discuss the changes with us in IRC.
* We will look at the patch, test it out, and give you feedback.
* Avoid doing minor whitespace changes, renamings, etc. along with merged content. These will be done by the maintainers from time to time but they can complicate merges and should be done seperately.
* Take care to maintain the existing coding style.
* Add unit tests for any new or changed functionality & Lint and test your code using [Grunt](http://gruntjs.com/).
* All pull requests should be "fast forward"
  * If there are commits after yours use “git rebase -i <new_head_branch>”
  * If you have local changes you may need to use “git stash”
  * For git help see [progit](http://git-scm.com/book) which is an awesome (and free) book on git

## Release History

Version 0.16.0 - Compatibility with Cylon 0.19.0

Version 0.15.0 - Compatibility with Cylon 0.18.0

Version 0.14.0 - Compatibility with Cylon 0.16.0

Version 0.13.1 - Add peerDependencies to package.json

Version 0.13.0 - Compatibility with Cylon 0.15.0

Version 0.12.0 - Compatibility with Cylon 0.14.0, remove node-namespace.

Version 0.11.1 - Added examples and updated adaptor

Version 0.11.0 - Update to cylon 0.12.0

Version 0.10.2 - Correct version numbers

Version 0.10.1 - CLI bugfixes

Version 0.10.0 - Updates to Cylon 0.11.0, migrated to pure JS

Version 0.9.0 - Updates to Cylon 0.10.0, CLI commands to install Firmata

Version 0.8.0 - Updates to Cylon 0.9.0, correct use of peerDependencies

Version 0.7.0 - Updates to Cylon 0.8.0

Version 0.6.0 - Updates to Cylon 0.7.0

Version 0.5.0 - Updates to Cylon 0.6.0

Version 0.4.0 - Updates to latest cylon core

Version 0.3.0 - Add support for i2c, load cylon-i2c driver set

Version 0.2.0 - Add support for PWM and servo commands, and refactor to use Basestar

Version 0.1.0 - Initial release with support for digital read/write and analog read/write

## License
Copyright (c) 2013-2014 The Hybrid Group. Licensed under the Apache 2.0 license.
