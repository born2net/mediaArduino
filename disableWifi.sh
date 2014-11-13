#!/bin/sh

echo "Patch script start"
echo 'echo "default-on" > /sys/class/leds/ds:green:wlan/trigger' > /etc/rc.local

cp /dev/null /sbin/wifi
chmod 775 /sbin/wifi

cat > /lib/firstboot/20_reset_clear_jffs << 'XXX'