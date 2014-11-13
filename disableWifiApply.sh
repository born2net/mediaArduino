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