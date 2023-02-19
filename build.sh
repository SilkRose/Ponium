#!/usr/bin/env sh

tsc;
find ./src \( -name "*.html" -o -name "*.css" \) -exec cp -r {} ./dist/ \;
