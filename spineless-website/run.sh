#!/bin/sh

cd ../spineless-editor
yarn build-and-copy

cd ../spineless-website
bundle exec jekyll serve
