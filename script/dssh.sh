#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

LINE=$(docker ps | grep $1)
ALINE=($LINE)

docker exec -it ${ALINE[0]} /bin/bash
