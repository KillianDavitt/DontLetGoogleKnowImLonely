#!/bin/bash

# Terminate on error (e), error on unused variable (u), print commands (x)
set -eux

## NodeJs
apt-get install python-software-properties curl -y
curl -sL https://deb.nodesource.com/setup_7.x | bash - # add node ppa for latest node version
apt-get install nodejs -y
## Build Dependancies
npm install
