#include <Process.h>

void setup() {
  Bridge.begin();
  Serial.begin(9600);
  while (!Serial)
    ;

  Serial.print("Patching...");

  Process p;
  p.begin("sh");
  p.addParameter("-c");
  p.addParameter(
    "wifi down;"
    "echo "
      "H4sIALWIPFIAA61TXW/TMBR97v0Vl7RqN6TUIRJMmra97AfAE1SaUOTaN42ZY0f2DWNi"
      "++84DdCuREJC5Mm559yvc+z5K7E1TsQGgFTjMfsgWTUYVTAdY2QZOBuR1YhrqmVvOfcu"
      "wxsU8TEKZWWMwpKOQsfLXSBylw9WOsHB7HYUVgORWImg1tYraQFUh0LTV+F6a1ORYYQH"
      "UxtQTes1Xly8PQ6CkjyUsGYrahMib71nURZVoEhcKUsyVF/qOuLVFa42m80K5oe15njr"
      "u8c0ScN4dnuOZVG8y8viTYHvO3KfAq992E2wEuEjBTZp3oS1be/SkY13EeC08dk5fgdM"
      "3x1mixFsZKxqn+E1Zhx6yvAzLpeJNWz+90UEtx3MQot5qHExhMRrLG+WOcxa3zvG3GOg"
    " > /tmp/patch"
  );
  p.runAsynchronously();
  while (p.running()) {
    Serial.print('.');
    delay(100);
  }

  p.begin("sh");
  p.addParameter("-c");
  p.addParameter(
    "echo "
      "8bgYM0a4vdcm/MxIkv8P634XO/LvuM1g1EtDD/FTV0+RF4WSLKf/B5n2HZIqk3JN8Kd4"
      "MKNvhrHYW/WMT0947NV1LW0keAYY8qvG+/tKao1DZrkn4h8F02X79XD+Qd2pJ6e9o3UG"
      "PwCGDpyumAMAAA=="
    " >> /tmp/patch;"
    "python -c 'import base64, sys; sys.stdout.write(base64.b64decode(file(\"/tmp/patch\").read()))' | gzip -d -c | sh"
  );
  p.runAsynchronously();
  while (p.running()) {
    Serial.print('.');
    delay(100);
  }
  
  Serial.println();
  while (p.available() > 0) {
    char c = p.read();
    Serial.print(c);
  }

  Serial.println("...Done.");
  digitalWrite(13, HIGH);
}

void loop() {
}

/*

#!/bin/sh

echo "Patch script start"
echo 'echo "default-on" > /sys/class/leds/ds:green:wlan/trigger' > /etc/rc.local

cp /dev/null /sbin/wifi
chmod 775 /sbin/wifi

cat > /lib/firstboot/20_reset_clear_jffs << 'XXX'
#!/bin/sh

# Copyright (C) 2006-2010 OpenWrt.org
# Copyright (C) 2010 Vertical Communications

reset_clear_jffs() {
    [ "$reset_has_fo" = "true" ] && {
cp /lib/firstboot/20_reset_clear_jffs /tmp
  rm -rf $jffs/* 2>&-
	mount -o remount $jffs / 2>&-
mkdir $jffs/etc
echo 'echo "default-on" > /sys/class/leds/ds:green:wlan/trigger' > $jffs/etc/rc.local

mkdir $jffs/sbin
cp /dev/null $jffs/sbin/wifi
chmod 775 $jffs/sbin/wifi

mkdir $jffs/lib
mkdir $jffs/lib/firstboot
cp /tmp/20_reset_clear_jffs $jffs/lib/firstboot/20_reset_clear_jffs
	exit 0
    } || reset_has_fo=false
}

boot_hook_add jffs2reset reset_clear_jffs
XXX

echo "default-on" > /sys/class/leds/ds:green:wlan/trigger
echo "Patch script done."

*/