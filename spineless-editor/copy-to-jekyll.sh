#!/bin/sh

# copy static assets
rm -rf ../spineless-website/assets/editor/
cp -R build/ ../spineless-website/assets/editor/

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

