#!/usr/bin/env bash

npm install -g webpack-bundle-analyzer;
webpack-bundle-analyzer /tmp/build-tool-stats/${1} -h 0.0.0.0;
