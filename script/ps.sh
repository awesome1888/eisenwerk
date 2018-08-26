#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

# watch docker-compose -f ${DIR}/../docker/all.development.yml ps;
watch docker ps;
