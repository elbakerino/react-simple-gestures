#!/bin/bash

echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >.npmrc

echo "Token length: ${#NPM_TOKEN}"

# todo: not manual resetting the file here
git checkout -- packages/webpackPartialConfig.js

cd ./packages

cd simple-gestures
cp package.json build/ && cp package-lock.json build/ && cp README.md build/
cd ../

cd ../

#npm run release
npm run release -- --yes

rm .npmrc
