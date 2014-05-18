#!/bin/sh
sudo leapd &
cd ..; python -m SimpleHTTPServer &
node ledserver/ledserver.js
killall python
