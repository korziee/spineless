#!/bin/sh

# copy static assets
rm -rf ../spineless-website/assets/editor/
cp -R build/ ../spineless-website/assets/editor/

# CRA wants control over the output index.html file
# however, we want our app to load inside a custom jekyll template editor.html file
# to avoid ejecting from CRA, let CRA generate it's index.html file,
# then strip out the basic html tags, and copy the resulting page into our editor.template.html file

# reset editor.html entrypoint file
cp editor.template.html ../spineless-website/editor.html
# copy in CRA index.html file into editor.html
cat ./build/index.html | \
  sed -e 's/<!doctype html>//' | \
  sed -e 's/<html lang="en">//' | \
  sed -e 's/<head>//' | \
  sed -e 's/<\/head>//' | \
  sed -e 's/<body>//' | \
  sed -e 's/<\/body>//' | \
  sed -e 's/<\/html>//' \
  >> ../spineless-website/editor.html

