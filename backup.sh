#!/bin/bash
cd /root
cp -r -f /usr/lib/node_modules/ ./dev/
tar cvf backup.tar ./
mv backup.tar ./dev/
