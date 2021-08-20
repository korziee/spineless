#!/bin/sh

# build spineless-server
cd spineless-server
yarn --production=false
yarn build
rm -rf node_modules
yarn --production=true
cd ../

# build spineless-editor
cd spineless-editor
yarn install
yarn build-and-copy
cd ../

# build spineless-website
cd spineless-website
bundle install
bundle exec jekyll build
cd ../

# build spineless-infra
cd spineless-infra
yarn
cd ../
