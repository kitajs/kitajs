#!/usr/bin/env bash

yarn --cwd ./packages/cli build --watch &
yarn --cwd ./packages/core build --watch &
yarn --cwd ./packages/runtime build --watch &
yarn --cwd ./packages/generator build --watch &
yarn --cwd ./packages/test build --watch &

wait