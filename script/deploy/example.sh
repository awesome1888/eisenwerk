#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../app/backend.bot.xing/;
docker build -t repo-owner/rep-name:latest .;
docker push repo-owner/repo-name:latest;
