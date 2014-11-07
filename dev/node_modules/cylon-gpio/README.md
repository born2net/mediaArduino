# Cylon.js For GPIO

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics and physical computing using Node.js

This module provides drivers for General Purpose Input/Output (GPIO) devices (https://en.wikipedia.org/wiki/General_Purpose_Input/Output). It is normally not used directly, but instead is registered by adaptor modules such as cylon-firmata (https://github.com/hybridgroup/cylon-firmata) that support the needed interfaces for GPIO devices.

Want to use Ruby on robots? Check out our sister project Artoo (http://artoo.io)

Want to use the Go programming language to power your robots? Check out our sister project Gobot (http://gobot.io).

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-gpio.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-gpio)

## Getting Started
Install the module with: `npm install cylon-gpio`

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

## Hardware Support
Cylon.js has a extensible system for connecting to hardware devices. The following GPIO devices are currently supported:

  - Analog Sensor
  - Button
  - Continuous Servo
  - LED
  - Motor
  - Makey Button (high-resistance button like the [MakeyMakey](http://www.makeymakey.com/))
  - Maxbotix Ultrasonic Range Finder
  - Servo

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

Version 0.19.0 - Compatibility with Cylon 0.19.0

Version 0.18.0 - Bug fixes, compatibility with Cylon 0.18.0

Version 0.17.0 - Corrections to IR Range Sensor values

Version 0.16.0 - Compatibility with Cylon 0.16.0

Version 0.15.1 - Add peerDependencies to package.json

Version 0.15.0 - Compatibility with Cylon 0.15.0

Version 0.14.0 - Compatibility with Cylon 0.14.0, remove node-namespace.

Version 0.13.1 - Adds new direct-pin driver

Version 0.13.0 - Update to cylon 0.13.0, Tessel compatibility

Version 0.12.0 - Update to cylon 0.12.0

Version 0.11.0 - Update to cylon 0.11.2, updates to MakeyButton

Version 0.10.0 - Update to cylon 0.11.0, migrated to pure JS

Version 0.9.0 - Update to cylon 0.10.0, add MakeyButton driver

Version 0.8.0 - Update to cylon 0.9.0

Version 0.7.0 - Add support for continuous servo, update to cylon 0.8.0

Version 0.6.0 - Update to cylon 0.7.0

Version 0.5.0 - Add support for Maxbotix ultrasonic range finder, update to cylon 0.6.0

Version 0.4.0 - Update for Cylon 0.5.0

Version 0.3.0 - Proper event handling with newer proxying

Version 0.2.0 - Add Motor and Servo support, refactor to use Basestar

Version 0.1.0 - Initial release with support for AnalogSensor, Button, and LED

## License
Copyright (c) 2013-2014 The Hybrid Group. Licensed under the Apache 2.0 license.
