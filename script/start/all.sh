#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# todo: test if the following is available: gulp-cli, docker, docker-compose, docker daemon is up and running, user has "docker" group joined

cd $DIR/../../;
if [ ! -f .packagejsonprev ]; then
    echo ">>> Installing root packages";
    npm install --save;
    cp package.json .packagejsonprev;
fi
if [ "$(cmp package.json .packagejsonprev)" ]; then
    echo ">>> The main package.json was changed, running 'npm install'";
    npm install --save;
    cp package.json .packagejsonprev;
fi
cd $DIR;
gulp --silent -f ../../gulpfile/all.js;
