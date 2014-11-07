# Cylon.js For i2c

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics and physical computing using Node.js

This module provides drivers for i2c devices (https://en.wikipedia.org/wiki/I%C2%B2C). You would not normally use this module directly, instead it is used by Cylon.js adaptors that have i2c support.

Want to use Ruby on robots? Check out our sister project Artoo (http://artoo.io)

Want to use the Go programming language to power your robots? Check out our sister project Gobot (http://gobot.io).

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-i2c.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-i2c)

## Getting Started

Install the module with: `npm install cylon-i2c`

## Example

```javascript
var Cylon = require('cylon');

// Initialize the robot
Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: {name: 'blinkm', driver: 'blinkm'},

  work: function(my) {
    var lit = false;
    my.blinkm.off()
    every((1).seconds(), function() {
      if (lit === true) {
        lit = false;
        my.blinkm.rgb(0xaa, 0, 0);
      } else {
        lit = true;
        my.blinkm.rgb(0, 0, 0);
      }
    });
  }
}).start();
```

## Hardware Support
Cylon.js has a extensible system for connecting to hardware devices. The following i2c devices are currently supported:

  - BlinkM
  - BMP180
  - HMC6352 Digital Compass
  - LCD
  - MPL115A2 Digital Barometer & Thermometer
  - MPU6050

More drivers are coming soon...

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

Version 0.15.0 - Bugfixes, add LSM9DS0 support

Version 0.14.0 - Compatibility with Cylon 0.18.0

Version 0.13.0 - Compatibility with Cylon 0.16.0

Version 0.12.1 - Add peerDependencies to package.json

Version 0.12.0 - Compatibility with Cylon 0.15.0

Version 0.11.0 - Compatibility with Cylon 0.14.0, remove node-namespace.

Version 0.10.1 - Added new diagrams, tests, examples and bpm6080 driver

Version 0.10.0 - Update to cylon 0.13.0, Tessel compatibility, support for MPU6050 and BMP180

Version 0.9.0 - Update to cylon 0.12.0

Version 0.8.0 - Update to cylon 0.11.0, migrated to pure JS

Version 0.7.0 - Update to cylon 0.10.0, add drivers for LCD & MPL115A2

Version 0.6.0 - Update to Cylon 0.9.0

Version 0.5.1 - Bug fixes and updated BlinkM driver with full command set

Version 0.5.0 - Update to Cylon 0.8.0

Version 0.4.0 - Update to Cylon 0.7.0

Version 0.3.0 - Add support for HMC6352 digial compass

Version 0.2.0 - Update to Cylon 0.5.0

Version 0.1.0 - Add support for BlinkM

## License
Copyright (c) 2013-2014 The Hybrid Group. Licensed under the Apache 2.0 license.
