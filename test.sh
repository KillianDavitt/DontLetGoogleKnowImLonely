#!/bin/bash

set -eux

# Style Guide
./node_modules/.bin/eslint ./ --ext .js

# Unit Tests
{ set +x; } 2>/dev/null #mute trace
printf "\n\n\n****** START OF OUTPUT FROM AUTOMATED TESTS ******\n\n\n"; set -x

