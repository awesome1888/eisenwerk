#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

tail -f -n 30 /tmp/build-tool-output/$1;
