#!/bin/sh

# build spineless-server
cd spineless-server
yarn --production
yarn build
cd ../

# build spineless-website
cd spineless-website
bundle install
bundle exec jekyll build
cd ../
