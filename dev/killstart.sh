#!/bin/sh
# ps  | grep -ie start | awk '{print $1}' | xargs kill -9 >& /tmp/out
# /usr/bin/sudo -u root ps  | grep -ie start | awk '{print $1}'
killall node_auto_start
