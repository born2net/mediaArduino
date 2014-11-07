var Cylon = require('cylon');

Cylon.robot({
    connection:{name:'raspi', adaptor:'raspi'},
    device:{name:'bmp180', driver:'bmp180'},

    work: function(my) {
        my.bmp180.getTemperature(function(err, val) {
            if(err) console.log(err);
            else {
                console.log("getTemperature call:");
                console.log("\tTemp: " + val.temp + " C");
            }
        });

        after(1..seconds(), function() {
            my.bmp180.getPressure(1, function(err, val) {
                if(err) console.log(err);
                else {
                    console.log("getPressure call:");
                    console.log("\tTemperature: " + val.temp + " C");
                    console.log("\tPressure: " + val.press + " Pa");
                }
            });
        });

        after(2..seconds(), function() {
            my.bmp180.getAltitude(1, null, function(err, val) {
                if(err) console.log(err);
                else {
                    console.log("getAltitude call:");
                    console.log("\tTemperature: " + val.temp + " C");
                    console.log("\tPressure: " + val.press + " Pa");
                    console.log("\tAltitude: " + val.alt + " m");
                }
            });
        });

    }
}).start();