#!/bin/sh

cd editor
yarn build-and-copy

cd ../
bundle exec jekyll serve